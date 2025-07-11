# accounts/views.py
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from django.db import transaction
from .models import User, UserProfile, FarmerProfile, SupplierProfile
from .serializers import (
    UserRegistrationSerializer, 
    UserSerializer,
    UserProfileSerializer,
    FarmerProfileSerializer,
    SupplierProfileSerializer
)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = authenticate(
                username=request.data.get('username'),
                password=request.data.get('password')
            )
            if user:
                user_data = UserSerializer(user).data
                response.data['user'] = user_data
        return response

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['user_type', 'region', 'is_verified']
    search_fields = ['username', 'first_name', 'last_name', 'email']
    ordering_fields = ['created_at', 'username']

class FarmerListView(generics.ListAPIView):
    queryset = User.objects.filter(user_type='farmer')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['region', 'is_verified']
    search_fields = ['username', 'first_name', 'last_name']

class SupplierListView(generics.ListAPIView):
    queryset = User.objects.filter(user_type='supplier')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['region', 'is_verified']
    search_fields = ['username', 'first_name', 'last_name']

class FarmerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = FarmerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        farmer_profile, created = FarmerProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                'farm_name': f"{self.request.user.username}'s Farm",
                'farm_type': 'crop',
                'farm_size': 0,
                'farming_experience': 0
            }
        )
        return farmer_profile

class SupplierProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = SupplierProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        supplier_profile, created = SupplierProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                'business_name': f"{self.request.user.username}'s Business",
                'supplier_type': 'general',
                'license_number': f"LIC{self.request.user.id}",
                'tax_id': f"TAX{self.request.user.id}"
            }
        )
        return supplier_profile

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_user(request, user_id):
    """Admin only - verify user account"""
    if request.user.user_type != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = User.objects.get(id=user_id)
        user.is_verified = True
        user.save()
        return Response({'message': 'User verified successfully'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics for admin"""
    if request.user.user_type != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    stats = {
        'total_users': User.objects.count(),
        'total_farmers': User.objects.filter(user_type='farmer').count(),
        'total_suppliers': User.objects.filter(user_type='supplier').count(),
        'total_customers': User.objects.filter(user_type='customer').count(),
        'verified_users': User.objects.filter(is_verified=True).count(),
        'recent_registrations': User.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=30)
        ).count()
    }
    
    return Response(stats, status=status.HTTP_200_OK)
