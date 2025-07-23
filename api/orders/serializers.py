from rest_framework import serializers
from .models import Order, OrderItem, OrderHistory
from products.models import Product
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
    
    class Meta:
        model = Order
        fields = [
            'order_id', 'buyer', 'status', 'payment_status',
            'total_amount', 'order_date', 'updated_at', 'shipping_address',
            'billing_address', 'tracking_number', 'notes', 'items', 'history'
        ]
        read_only_fields = ['order_id', 'buyer', 'total_amount', 'order_date', 'updated_at']

class OrderCreateSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(write_only=True, required=True)
    quantity = serializers.IntegerField(write_only=True, required=True, min_value=1)

    class Meta:
        model = Order
        fields = ['product_id', 'quantity', 'shipping_address', 'billing_address', 'notes']

    def create(self, validated_data):
        product_id = validated_data.pop('product_id')
        quantity = validated_data.pop('quantity')
        buyer = self.context['request'].user

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found")

        total_amount = product.price * quantity
        order = Order.objects.create(buyer=buyer, total_amount=total_amount, **validated_data)
        OrderItem.objects.create(order=order, product=product, quantity=quantity, price=product.price)

        return order