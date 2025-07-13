from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    add_product,
    ProductViewSet,
    CategoryViewSet,
    CartViewSet,
    CartItemViewSet,
    WishlistViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'cart', CartViewSet, basename='cart') # Manages the cart itself
router.register(r'cart-items', CartItemViewSet, basename='cartitem') # Manages items in a cart
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('products/add/', add_product, name='product-add'),
    path('products/', ProductViewSet.as_view({'get': 'list'}), name='product-list'),
    path('products/<int:pk>/', ProductViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='product-detail'),
    path('', include(router.urls)),
]
