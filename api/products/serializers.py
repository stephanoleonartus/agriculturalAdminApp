# products/serializers.py
from rest_framework import serializers
from .models import Product, Category, ProductImage, ProductVideo, Wishlist, Cart, CartItem
from accounts.serializers import UserSerializer, RegionSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'created_at']

class ProductVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVideo
        fields = ['id', 'video_url', 'video_file', 'alt_text', 'is_primary', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    videos = ProductVideoSerializer(many=True, read_only=True)
    region = RegionSerializer(read_only=True)
    farmer_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['owner', 'created_at']

class ProductCreateSerializer(serializers.ModelSerializer):
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    uploaded_videos = serializers.ListField(
        child=serializers.FileField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'category', 'quantity', 'unit', 'min_order_quantity', 'status', 'harvest_date', 'expiry_date', 'origin_region', 'is_organic', 'uploaded_images', 'uploaded_videos']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        uploaded_videos = validated_data.pop('uploaded_videos', [])
        product = Product.objects.create(**validated_data)
        for image in uploaded_images:
            ProductImage.objects.create(product=product, image=image)
        for video in uploaded_videos:
            ProductVideo.objects.create(product=product, video_file=video)
        return product

class ProductUpdateSerializer(serializers.ModelSerializer):
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    uploaded_videos = serializers.ListField(
        child=serializers.FileField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'category', 'quantity', 'unit', 'min_order_quantity', 'status', 'harvest_date', 'expiry_date', 'origin_region', 'is_organic', 'uploaded_images', 'uploaded_videos']

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        uploaded_videos = validated_data.pop('uploaded_videos', [])
        instance = super().update(instance, validated_data)
        for image in uploaded_images:
            ProductImage.objects.create(product=instance, image=image)
        for video in uploaded_videos:
            ProductVideo.objects.create(product=instance, video_file=video)
        return instance

        

class ProductStockUpdateSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=0)

class ProductPriceUpdateSerializer(serializers.Serializer):
    price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0)

class ProductStatusSerializer(serializers.Serializer):
    is_active = serializers.BooleanField()

class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_id', 'created_at']
        read_only_fields = ['id', 'product', 'created_at']
    
    def validate_product_id(self, value):
        try:
            product = Product.objects.get(id=value, is_active=True)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found or not available")
        return value
    
    def create(self, validated_data):
        product_id = validated_data.pop('product_id')
        product = Product.objects.get(id=product_id)
        return Wishlist.objects.create(
            user=self.context['request'].user,
            product=product,
            **validated_data
        )

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'added_at', 'total_price']
        read_only_fields = ['total_price']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    total_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'created_at', 'updated_at', 'total_items', 'total_price']

