# products/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, 
    CategoryViewSet,
    CategoryProductsView,
    UserProductsView,
    WishlistViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('', include(router.urls)),
    path('products/category/<slug:category_slug>/', CategoryProductsView.as_view(), name='category-products'),
    path('products/user/<int:user_id>/', UserProductsView.as_view(), name='user-products'),
]