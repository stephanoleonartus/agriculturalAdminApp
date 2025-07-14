from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FarmerViewSet, SupplierViewSet, RegisterView, LoginView

router = DefaultRouter()
router.register(r'farmers', FarmerViewSet, basename='farmer')
router.register(r'suppliers', SupplierViewSet, basename='supplier')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
]