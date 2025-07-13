# accounts/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    UserRegistrationView,
    UserProfileView,
    UserListView,
    FarmerListView,
    SupplierListView,
    FarmerProfileView,
    SupplierProfileView,
    logout_view,
    verify_user,
    dashboard_stats,
    SearchRecommendationsView, # Added SearchRecommendationsView
    PasswordResetRequestView,
    PasswordResetView
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset-confirm/', PasswordResetView.as_view(), name='password-reset-confirm'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', logout_view, name='logout'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('farmers/', FarmerListView.as_view(), name='farmer-list'),
    path('suppliers/', SupplierListView.as_view(), name='supplier-list'),
    path('farmer-profile/', FarmerProfileView.as_view(), name='farmer-profile'),
    path('supplier-profile/', SupplierProfileView.as_view(), name='supplier-profile'),
    path('verify-user/<int:user_id>/', verify_user, name='verify-user'),
    path('dashboard-stats/', dashboard_stats, name='dashboard-stats'),
    path('search/recommendations/', SearchRecommendationsView.as_view(), name='search-recommendations'), # Added URL
]