from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FarmerViewSet, SupplierViewSet, BuyerViewSet, RegisterView, LoginView, RegionViewSet, LogoutView, CurrentUserView, ChangePasswordView

router = DefaultRouter()
router.register(r'farmers', FarmerViewSet, basename='farmer')
router.register(r'suppliers', SupplierViewSet, basename='supplier')
router.register(r'buyers', BuyerViewSet, basename='buyer')  # Add this line
router.register(r'regions', RegionViewSet, basename='region')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('me/', CurrentUserView.as_view(), name='auth_me'),
    path('change-password/', ChangePasswordView.as_view(), name='auth_change_password'),
]