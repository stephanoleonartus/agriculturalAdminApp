# products/urls.py (Complete version)
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, 
    CategoryViewSet,
    CategoryProductsView,
    UserProductsView,
    WishlistViewSet,
    # CartViewSet  # Add this import
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
# router.register(r'cart', CartViewSet, basename='cart')  # Add this line

urlpatterns = [
    path('', include(router.urls)),
    path('category/<slug:category_slug>/', CategoryProductsView.as_view(), name='category-products'),
    path('user/<int:user_id>/', UserProductsView.as_view(), name='user-products'),
]