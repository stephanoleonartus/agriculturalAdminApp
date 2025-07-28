from rest_framework import serializers
from .models import Order, OrderItem, OrderHistory
from products.models import Product
from products.serializers import ProductSerializer
from accounts.serializers import UserSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'price', 'total_price']
        read_only_fields = ['total_price', 'product']

class OrderHistorySerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = OrderHistory
        fields = ['id', 'status', 'created_at', 'created_by', 'comment']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    history = OrderHistorySerializer(many=True, read_only=True)
    buyer = UserSerializer(read_only=True)
    farmer = UserSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'order_id', 'buyer', 'farmer', 'status', 'payment_status',
            'total_amount', 'order_date', 'updated_at', 'shipping_address',
            'billing_address', 'tracking_number', 'notes', 'items', 'history'
        ]
        read_only_fields = ['order_id', 'buyer', 'farmer', 'total_amount', 'order_date', 'updated_at']

class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            'shipping_address', 'billing_address', 'notes', 'items'
        ]

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("An order must have at least one item.")

        first_product_owner = items[0]['product'].owner
        for item in items:
            if item['product'].owner != first_product_owner:
                raise serializers.ValidationError("All items in an order must belong to the same farmer.")
        return items