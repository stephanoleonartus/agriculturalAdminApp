from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FarmerViewSet, SupplierViewSet

router = DefaultRouter()
router.register(r'farmers', FarmerViewSet, basename='farmer')
router.register(r'suppliers', SupplierViewSet, basename='supplier')

urlpatterns = [
    path('', include(router.urls)),
]