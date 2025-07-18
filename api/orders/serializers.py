# orders/serializers.py
from rest_framework import serializers
from .models import Order, OrderItem, OrderHistory
from products.serializers import ProductSerializer
from accounts.serializers import UserSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'total_price']
        read_only_fields = ['total_price']

class OrderHistorySerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = OrderHistory
        fields = ['id', 'status', 'created_at', 'created_by', 'comment']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    history = OrderHistorySerializer(many=True, read_only=True)
    buyer = UserSerializer(read_only=True)
    supplier = UserSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'order_id', 'buyer', 'supplier', 'status', 'payment_status', 
            'total_amount', 'order_date', 'updated_at', 'shipping_address',
            'billing_address', 'tracking_number', 'notes', 'items', 'history'
        ]
        read_only_fields = ['order_id', 'total_amount', 'order_date', 'updated_at']