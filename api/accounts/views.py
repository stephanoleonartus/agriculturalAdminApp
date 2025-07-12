# accounts/views.py
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend # Added
from rest_framework.filters import SearchFilter, OrderingFilter # Added
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from django.db import transaction
from django.utils import timezone

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from datetime import timedelta
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
    queryset = User.objects.filter(user_type='farmer').select_related('farmer_profile', 'profile')
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny] # Changed to AllowAny
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter] # Ensure all filters are available
    filterset_fields = ['region', 'is_verified', 'farmer_profile__farm_type', 'farmer_profile__certifications']
    search_fields = [
        'username', 'first_name', 'last_name', 'email',
        'farmer_profile__farm_name',
        'farmer_profile__farm_type',
        'farmer_profile__crops_grown', # Assumes JSONField is text searchable or custom filter needed
        'farmer_profile__livestock_types' # Same as above
    ]
    ordering_fields = ['username', 'first_name', 'created_at', 'farmer_profile__farm_name']


class SupplierListView(generics.ListAPIView):
    queryset = User.objects.filter(user_type='supplier').select_related('supplier_profile', 'profile')
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny] # Changed to AllowAny
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter] # Ensure all filters are available
    filterset_fields = ['region', 'is_verified', 'supplier_profile__supplier_type']
    search_fields = [
        'username', 'first_name', 'last_name', 'email',
        'supplier_profile__business_name',
        'supplier_profile__supplier_type',
        'supplier_profile__products_categories' # Assumes JSONField is text searchable or custom filter needed
    ]
    ordering_fields = ['username', 'first_name', 'created_at', 'supplier_profile__business_name']

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

# Search Recommendations View
from django.db import models # Added for Q objects
from products.models import Product as ProductModel
# from products.serializers import ProductListSerializer # Not directly used for final response structure

class SearchRecommendationsView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return ProductModel.objects.none() # Return an empty queryset as the list method is customized

    def get_serializer_class(self):
        # This view doesn't use a single serializer for the combined results directly in DRF's default way.
        # We construct the response manually.
        return None

    def list(self, request, *args, **kwargs):
        query = request.query_params.get('q', '').strip()
        limit = int(request.query_params.get('limit', 5)) # Limit number of suggestions per type
        suggestions = []

        if not query or len(query) < 2: # Minimum query length
            return Response(suggestions)

        # Product Suggestions
        # Using ProductListSerializer to get a consistent structure if needed, or simplify
        product_qs = ProductModel.objects.filter(name__icontains=query, status='available')[:limit]
        for product in product_qs:
            suggestions.append({
                'type': 'Product',
                'id': product.id,
                'name': product.name,
                'category': product.category.name if product.category else None,
                'image_url': product.images.filter(is_primary=True).first().image.url if product.images.filter(is_primary=True).exists() else None,
                # 'url': f'/products/{product.slug}/' # Example URL
            })

        # Farmer Suggestions
        farmer_qs = User.objects.filter(
            user_type='farmer', is_active=True, is_verified=True
        ).filter(
            models.Q(username__icontains=query) |
            models.Q(first_name__icontains=query) |
            models.Q(last_name__icontains=query) |
            models.Q(farmer_profile__farm_name__icontains=query)
        ).distinct()[:limit]

        for user in farmer_qs:
            suggestions.append({
                'type': 'Farmer',
                'id': user.id,
                'name': user.farmer_profile.farm_name if hasattr(user, 'farmer_profile') and user.farmer_profile.farm_name else user.get_full_name() or user.username,
                'region': user.region,
                'image_url': user.profile_picture.url if user.profile_picture else None,
                # 'url': f'/farmers/{user.id}/' # Example URL
            })

        # Supplier Suggestions
        supplier_qs = User.objects.filter(
            user_type='supplier', is_active=True, is_verified=True
        ).filter(
            models.Q(username__icontains=query) |
            models.Q(first_name__icontains=query) |
            models.Q(last_name__icontains=query) |
            models.Q(supplier_profile__business_name__icontains=query)
        ).distinct()[:limit]

        for user in supplier_qs:
            suggestions.append({
                'type': 'Supplier',
                'id': user.id,
                'name': user.supplier_profile.business_name if hasattr(user, 'supplier_profile') and user.supplier_profile.business_name else user.get_full_name() or user.username,
                'region': user.region,
                'image_url': user.profile_picture.url if user.profile_picture else None,
                # 'url': f'/suppliers/{user.id}/' # Example URL
            })

        # Could add category suggestions too if needed
        # from products.models import Category as CategoryModel
        # category_qs = CategoryModel.objects.filter(name__icontains=query)[:limit]
        # for category_item in category_qs:

    

        #     suggestions.append({

        #         'type': 'Category',
        #         'id': category_item.id,
        #         'name': category_item.name
        #     })

        # Sort suggestions? Or keep them grouped by type? For now, grouped.
        # Randomize or limit total number of suggestions if too many types
        # suggestions = suggestions[:total_limit]

        return Response(suggestions)
