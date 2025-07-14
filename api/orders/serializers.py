from rest_framework import serializers
from .models import Order
from products.serializers import ProductSerializer
from accounts.serializers import UserSerializer

class OrderSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    buyer = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'product', 'buyer', 'quantity', 'total_price', 'status', 'ordered_at']
        read_only_fields = ['total_price', 'ordered_at']
