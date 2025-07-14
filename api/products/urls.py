from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet,
    CategoryViewSet,
    CartViewSet,
    CartItemViewSet,
    WishlistViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'cart', CartViewSet, basename='cart') # Manages the cart itself
router.register(r'cart-items', CartItemViewSet, basename='cartitem') # Manages items in a cart
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

category_router = DefaultRouter()
category_router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(category_router.urls)),
]
