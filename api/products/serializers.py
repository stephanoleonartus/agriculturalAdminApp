from rest_framework import serializers
from .models import Product, Category
from accounts.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    owner_name = serializers.CharField(source='owner.username', read_only=True)
    role = serializers.CharField(source='owner.role', read_only=True)
    region_name = serializers.CharField(source='owner.region.name', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['owner', 'created_at']

class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'image', 'category', 'quantity', 'unit', 'min_order_quantity', 'status', 'harvest_date', 'expiry_date', 'origin_region', 'is_organic']

class ProductUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'image', 'category', 'quantity', 'unit', 'min_order_quantity', 'status', 'harvest_date', 'expiry_date', 'origin_region', 'is_organic']