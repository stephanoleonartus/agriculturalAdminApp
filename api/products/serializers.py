# products/serializers.py
from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVideo, Cart, CartItem, Wishlist # Added ProductVideo

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'product_count', 'created_at']
    
    def get_product_count(self, obj):
        return obj.products.filter(status='available').count()

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary']

class ProductVideoSerializer(serializers.ModelSerializer): # Added ProductVideoSerializer
    class Meta:
        model = ProductVideo # Assuming ProductVideo model exists
        fields = ['id', 'video_url', 'video_file', 'alt_text', 'is_primary']

class ProductSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.get_full_name', read_only=True)
    farmer_region = serializers.CharField(source='farmer.region', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    videos = ProductVideoSerializer(many=True, read_only=True) # Added videos
    average_rating = serializers.ReadOnlyField()
    is_available = serializers.ReadOnlyField()
    is_wishlisted = serializers.SerializerMethodField()

    # Write-only fields for uploads
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )
    uploaded_videos = serializers.ListField(
        child=serializers.FileField(allow_empty_file=False, use_url=False), # Assuming FileField for videos
        write_only=True, required=False
    )
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'category', 'category_name', 'farmer', 
            'farmer_name', 'farmer_region', 'price', 'unit', 'quantity_available',
            'min_order_quantity', 'status', 'harvest_date', 'expiry_date', 
            'origin_region', 'is_organic', 'slug', 'tags',
            'images', 'videos',
            'uploaded_images', 'uploaded_videos',
            'average_rating', 'is_available', 'is_wishlisted', 'created_at', 'updated_at'
        ]
        read_only_fields = ['farmer', 'slug', 'created_at', 'updated_at']
    
    def get_is_wishlisted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Wishlist.objects.filter(user=request.user, product=obj).exists()
        return False
    
    def _handle_media_uploads(self, product, uploaded_media, MediaModel, media_field_name):
        # Helper to handle both image and video uploads
        if uploaded_media:
            # Clear existing media if needed (e.g., for updates) or handle appending
            # For simplicity in create, we just add. For update, one might clear existing first.
            # MediaModel.objects.filter(product=product).delete() # Optional: clear existing

            for index, media_file in enumerate(uploaded_media):
                media_data = {
                    'product': product,
                    media_field_name: media_file,
                    'is_primary': index == 0 # Set the first uploaded media as primary
                }
                MediaModel.objects.create(**media_data)

    def create(self, validated_data):
        uploaded_images_data = validated_data.pop('uploaded_images', [])
        uploaded_videos_data = validated_data.pop('uploaded_videos', [])

        validated_data['farmer'] = self.context['request'].user
        product = super().create(validated_data) # Creates the Product instance

        self._handle_media_uploads(product, uploaded_images_data, ProductImage, 'image')
        self._handle_media_uploads(product, uploaded_videos_data, ProductVideo, 'video_file') # Assuming 'video_file' is the field on ProductVideo model

        return product

    def update(self, instance, validated_data):
        uploaded_images_data = validated_data.pop('uploaded_images', None) # Use None to detect if provided
        uploaded_videos_data = validated_data.pop('uploaded_videos', None)

        product = super().update(instance, validated_data)

        if uploaded_images_data is not None: # If field was provided (even if empty list)
            # Clear existing images before adding new ones for simplicity
            instance.images.all().delete()
            self._handle_media_uploads(product, uploaded_images_data, ProductImage, 'image')

        if uploaded_videos_data is not None: # If field was provided
            instance.videos.all().delete()
            self._handle_media_uploads(product, uploaded_videos_data, ProductVideo, 'video_file')

        return product

class ProductListSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.get_full_name', read_only=True)
    farmer_region = serializers.CharField(source='farmer.region', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.ReadOnlyField()
    is_available = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category_name', 'farmer_name', 'farmer_region',
            'price', 'unit', 'status', 'is_organic', 'primary_image',
            'average_rating', 'is_available', 'created_at'
        ]
    
    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return primary_image.image.url
        return None

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'total_price', 'added_at']
    
    def validate_product_id(self, value):
        try:
            product = Product.objects.get(id=value)
            if not product.is_available:
                raise serializers.ValidationError("Product is not available")
            return value
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found")
    
    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        return value

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'total_price', 'created_at', 'updated_at']

class WishlistSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_id', 'created_at']
    
    def validate_product_id(self, value):
        try:
            Product.objects.get(id=value)
            return value
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found")
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)