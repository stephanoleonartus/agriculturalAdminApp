# orders/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, create_order_from_product

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('orders/create_from_product/', create_order_from_product, name='create_order_from_product'),
    path('', include(router.urls)), # Removed 'api/v1/'
]