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
        fields = ['id', 'name', 'description', 'price', 'image', 'category', 'quantity', 'owner', 'region', 'created_at', 'owner_name', 'role', 'region_name']
        read_only_fields = ['owner', 'region', 'created_at']