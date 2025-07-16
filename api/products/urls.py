from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, 
    CategoryViewSet,
    CategoryProductsView,
    UserProductsView,
    WishlistViewSet,
    CartViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
    path('category/<slug:category_slug>/', CategoryProductsView.as_view(), name='category-products'),
    path('user/<int:user_id>/', UserProductsView.as_view(), name='user-products'),
    
    # Add these custom paths
    path('my_products/', ProductViewSet.as_view({'get': 'my_products'}), name='my-products'),
    path('products/featured/', ProductViewSet.as_view({'get': 'featured'}), name='featured-products'),
]