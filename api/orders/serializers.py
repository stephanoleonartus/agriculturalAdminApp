# orders/serializers.py
from rest_framework import serializers
from .models import Order, OrderItem, OrderHistory

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'product_description', 'quantity', 'unit_price', 'total_price']
        read_only_fields = ['total_price']

class OrderHistorySerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = OrderHistory
        fields = ['id', 'status', 'comment', 'created_by_name', 'created_at']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    history = OrderHistorySerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    supplier_name = serializers.CharField(source='supplier.username', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_id', 'customer', 'supplier', 'customer_name', 'supplier_name',
            'status', 'payment_status', 'total_amount', 'shipping_address', 'billing_address',
            'order_date', 'delivery_date', 'tracking_number', 'notes', 'items', 'history',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['order_id', 'customer', 'order_date', 'created_at', 'updated_at']
