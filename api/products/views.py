from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .models import Product, Category, Wishlist, Cart, CartItem
from .serializers import (
    ProductSerializer, CategorySerializer, 
    WishlistSerializer, CartSerializer, CartItemSerializer
)
from .permissions import IsOwnerOrReadOnly, IsFarmerOrSupplier

# ====================== PRODUCTS ======================
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'region', 'owner', 'is_featured']
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsFarmerOrSupplier()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    # Custom Actions
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search products by name, description, or category"""
        queryset = self.filter_queryset(self.get_queryset())
        query = request.query_params.get('q', '')
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) | 
                Q(description__icontains=query) |
                Q(category__name__icontains=query)
            )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """List featured products"""
        queryset = self.get_queryset().filter(is_featured=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

# ====================== CATEGORIES ======================
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """List products in a category"""
        category = self.get_object()
        products = Product.objects.filter(category=category, is_active=True)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

# ====================== MISSING VIEWS ======================
class CategoryProductsView(generics.ListAPIView):
    """List products by category slug"""
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        category = get_object_or_404(Category, slug=category_slug)
        return Product.objects.filter(category=category, is_active=True)

class UserProductsView(generics.ListAPIView):
    """List products by user ID"""
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Product.objects.filter(owner_id=user_id, is_active=True)

# ====================== WISHLIST ======================
class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """Add/remove product from wishlist"""
        product_id = request.data.get('product_id')
        wishlist_item, created = Wishlist.objects.get_or_create(
            user=request.user, 
            product_id=product_id
        )
        if not created:
            wishlist_item.delete()
            return Response({'status': 'removed'}, status=status.HTTP_200_OK)
        return Response({'status': 'added'}, status=status.HTTP_201_CREATED)

# ====================== CART ======================
class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add product to cart (or update quantity)"""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, 
            product_id=product_id,
            defaults={'quantity': quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)