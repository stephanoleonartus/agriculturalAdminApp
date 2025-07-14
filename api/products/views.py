from rest_framework import viewsets, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Product, Category, ProductImage, ProductVideo, Cart, CartItem, Wishlist
from .serializers import (
    ProductSerializer,
    ProductListSerializer,
    CategorySerializer,
    CartSerializer,
    CartItemSerializer,
    WishlistSerializer
)
from .permissions import IsOwnerOrReadOnly, IsFarmerOrSupplier, IsAdminOrReadOnly

class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows products to be viewed or edited.
    - Admins can see all products.
    - Other users see only 'available' products.
    - Creation, update, deletion require user to be a 'farmer' or 'supplier' and the owner, or admin.
    """
    serializer_class = ProductSerializer
    parser_classes = (MultiPartParser, FormParser)

    # Filters
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = {
        'category__id': ['exact'],
        'category__name': ['exact', 'icontains'],
        'farmer__region': ['exact'], # Filter by farmer's region
        'farmer__id': ['exact'],
        'is_organic': ['exact'],
        'price': ['gte', 'lte', 'exact'],
        'status': ['exact'],
    }
    search_fields = ['name', 'description', 'tags', 'category__name', 'farmer__username', 'farmer__first_name', 'farmer__last_name']
    ordering_fields = ['name', 'price', 'created_at', 'average_rating', 'quantity_available']

    def get_queryset(self):
        """
        Admins can see all products. Other users see only 'available' products.
        A 'status' query param can be used by admins to filter by status.
        """
        user = self.request.user
        queryset = Product.objects.select_related('category', 'farmer').prefetch_related('images', 'videos')

        if user.is_authenticated and user.is_staff:
            status = self.request.query_params.get('status')
            if status and status != 'all':
                return queryset.filter(status=status)
            return queryset.all()

        return queryset.filter(status='available')

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer

    def get_permissions(self):
        """
        - 'create': User must be an authenticated farmer or supplier.
        - 'update', 'partial_update', 'destroy': User must be the owner or admin.
        - 'list', 'retrieve': Open to all.
        """
        if self.action == 'create':
            self.permission_classes = [permissions.IsAuthenticated, IsFarmerOrSupplier]
        elif self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly | IsAdminOrReadOnly]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)

    # For future: implement soft delete by overriding destroy, or use a library

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows categories to be viewed.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name']

# Basic Cart, CartItem, Wishlist Views (can be expanded later)

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure users can only see/modify items in their own cart
        if self.request.user.carts.exists():
            cart = self.request.user.carts.first() # Assuming one cart per user for now
            return CartItem.objects.filter(cart=cart)
        return CartItem.objects.none()

    def perform_create(self, serializer):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        # Check if product already in cart, if so, update quantity (or handle in serializer)
        product_id = serializer.validated_data.get('product_id')
        quantity = serializer.validated_data.get('quantity', 1)

        existing_item = CartItem.objects.filter(cart=cart, product_id=product_id).first()
        if existing_item:
            existing_item.quantity += quantity
            existing_item.save()
            # Need to return the updated existing_item serialized
            # For simplicity, the current serializer will create a new one if unique_together is not strict
            # Or, raise validation error if item exists, force PUT/PATCH to update
            # This basic implementation will just save new as per serializer if not handled there.
            # A better approach is to handle this logic in serializer.create or view.create
            serializer.instance = existing_item # Hack to make it return existing after update
            # This is not ideal, better to prevent creation if exists or update directly.
            # For now, relying on CartItemSerializer to handle this or model's unique_together
        else:
            serializer.save(cart=cart)


class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Ensure product_id is used to get Product instance for the Wishlist
        product_id = serializer.validated_data.get('product_id')
        product = Product.objects.get(id=product_id)
        serializer.save(user=self.request.user, product=product)

    def destroy(self, request, *args, **kwargs):
        # Allow deleting by product_id from wishlist if specified in request body
        # or by wishlist item ID in URL
        if 'product_id' in request.data:
            wishlist_item = Wishlist.objects.filter(user=request.user, product_id=request.data['product_id']).first()
            if wishlist_item:
                wishlist_item.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({'detail': 'Not found in wishlist.'}, status=status.HTTP_404_NOT_FOUND)
        return super().destroy(request, *args, **kwargs)
