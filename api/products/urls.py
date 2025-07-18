# products/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, 
    CategoryViewSet,
    WishlistViewSet,
    CartViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'cart', CartViewSet, basename='cart')

# Manually add custom endpoints
urlpatterns = [
    path('', include(router.urls)),
    
    # Custom endpoints (they won't appear in API root but will work)
    path('products/search/', ProductViewSet.as_view({'get': 'search'}), name='product-search'),
    path('products/featured/', ProductViewSet.as_view({'get': 'featured'}), name='product-featured'),
    path('products/out_of_stock/', ProductViewSet.as_view({'get': 'out_of_stock'}), name='product-out-of-stock'),
    path('products/<int:pk>/update_stock/', ProductViewSet.as_view({'post': 'update_stock'}), name='product-update-stock'),
    
    # Category products
    path('categories/<slug:slug>/products/', CategoryViewSet.as_view({'get': 'products'}), name='category-products'),
    
    # Cart actions
    path('cart/add_item/', CartViewSet.as_view({'post': 'add_item'}), name='cart-add-item'),
    path('cart/clear/', CartViewSet.as_view({'post': 'clear'}), name='cart-clear'),
    
    # Wishlist toggle
    path('wishlist/toggle/', WishlistViewSet.as_view({'post': 'toggle'}), name='wishlist-toggle'),
]