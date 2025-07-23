from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Order, OrderItem, OrderHistory
from .serializers import OrderSerializer, OrderCreateSerializer
from .permissions import OrderPermission
from products.models import Product

class OrderViewSet(viewsets.ModelViewSet):
    """
    Complete Order Management System
    - Create, view, update orders
    - Status management (confirm/ship/deliver/cancel)
    - Filtering by status/user/date
    """
    queryset = Order.objects.all()
    permission_classes = [OrderPermission]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'payment_status', 'buyer']
    search_fields = ['order_id', 'tracking_number', 'buyer__username']
    ordering_fields = ['order_date', 'total_amount', 'updated_at']
    ordering = ['-order_date']

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(buyer=user)

    def perform_create(self, serializer):
        """Create an order from a product or from the cart."""
        serializer.save()

    @action(detail=True, methods=['post'])
    def deliver(self, request, pk=None):
        """Mark order as delivered"""
        order = self.get_object()
        if order.status != 'shipped':
            return Response(
                {'error': 'Only shipped orders can be delivered'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'delivered'
        order.save()
        self._create_history(order, 'delivered', request.user)
        return Response({'status': 'delivered'})

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel order (buyer or supplier)"""
        order = self.get_object()
        valid_statuses = ['pending', 'confirmed']
        
        if order.status not in valid_statuses:
            return Response(
                {'error': f'Orders can only be cancelled when in {valid_statuses}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'cancelled'
        order.save()
        self._create_history(order, 'cancelled', request.user)
        return Response({'status': 'cancelled'})

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """List all pending orders (for suppliers)"""
        queryset = self.filter_queryset(
            self.get_queryset().filter(status='pending')
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def mine(self, request):
        """Get current user's orders with status filter"""
        status_filter = request.query_params.get('status')
        queryset = self.filter_queryset(self.get_queryset())
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def _create_history(self, order, status, user):
        """Create order history record"""
        OrderHistory.objects.create(
            order=order,
            status=status,
            created_by=user,
            comment=f"Status changed to {status} by {user.get_full_name()}"
        )