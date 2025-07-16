# products/views.py
from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination  # Add this import
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Product, Category, ProductImage, ProductVideo, Wishlist
from .serializers import (
    ProductSerializer, CategorySerializer, ProductCreateSerializer, 
    ProductUpdateSerializer, ProductImageSerializer, ProductVideoSerializer,
    ProductStockUpdateSerializer, ProductPriceUpdateSerializer,
    ProductStatusSerializer, WishlistSerializer
)
from .permissions import IsOwnerOrReadOnly, IsSupplierOrFarmer
from .filters import ProductFilter

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return ProductCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ProductUpdateSerializer
        return ProductSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsSupplierOrFarmer])
    def upload_image(self, request, pk=None):
        product = self.get_object()
        serializer = ProductImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsSupplierOrFarmer])
    def update_stock(self, request, pk=None):
        product = self.get_object()
        serializer = ProductStockUpdateSerializer(data=request.data)
        if serializer.is_valid():
            product.quantity = serializer.validated_data['quantity']
            product.save()
            return Response({'status': 'stock updated'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsSupplierOrFarmer])
    def update_price(self, request, pk=None):
        product = self.get_object()
        serializer = ProductPriceUpdateSerializer(data=request.data)
        if serializer.is_valid():
            product.price = serializer.validated_data['price']
            product.save()
            return Response({'status': 'price updated'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsSupplierOrFarmer])
    def toggle_status(self, request, pk=None):
        product = self.get_object()
        serializer = ProductStatusSerializer(data=request.data)
        if serializer.is_valid():
            # Implement your status toggle logic here
            # For example, you might have an is_active field
            return Response({'status': 'status toggled'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_products = self.get_queryset().order_by('-created_at')[:10]
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def out_of_stock(self, request):
        out_of_stock = self.get_queryset().filter(quantity__lte=0)
        serializer = self.get_serializer(out_of_stock, many=True)
        return Response(serializer.data)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None

class CategoryProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        return Product.objects.filter(category__name=category_slug)

class UserProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Product.objects.filter(owner__id=user_id)

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)