from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer

class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })

class FarmerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.filter(role='farmer')
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.filter(role='farmer')
        region = self.request.query_params.get('region')
        if region is not None:
            queryset = queryset.filter(region__name=region)
        return queryset

class SupplierViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.filter(role='supplier')
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.filter(role='supplier')
        region = self.request.query_params.get('region')
        if region is not None:
            queryset = queryset.filter(region__name=region)
        return queryset
