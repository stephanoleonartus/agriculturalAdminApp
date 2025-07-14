from rest_framework import viewsets
from .models import User
from .serializers import UserSerializer

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
