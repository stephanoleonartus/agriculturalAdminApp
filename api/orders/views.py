from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q
from .models import Order, OrderItem, OrderHistory
from .serializers import (
    OrderSerializer, 
    OrderItemSerializer,
    OrderHistorySerializer
)
from products.models import Product
from accounts.models import User

class OrderPermission(permissions.BasePermission):
    """Custom permission for order access control"""
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Buyers can see their own orders
        if request.user == obj.buyer:
            return True
        # Suppliers/farmers can see orders of their products
        if request.user == obj.supplier:
            return True
        # Admins can see all orders
        return request.user.is_staff

class OrderViewSet(viewsets.ModelViewSet):
    """
    Complete Order Management System
    - Create, view, update orders
    - Status management (confirm/ship/deliver/cancel)
    - Filtering by status/user/date
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [OrderPermission]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'payment_status', 'buyer', 'supplier']
    search_fields = ['order_id', 'tracking_number', 'buyer__name', 'supplier__name']
    ordering_fields = ['order_date', 'total_amount', 'updated_at']
    ordering = ['-order_date']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'buyer':
            return Order.objects.filter(buyer=user)
        elif user.role in ['farmer', 'supplier']:
            return Order.objects.filter(supplier=user)
        elif user.is_staff:
            return Order.objects.all()
        return Order.objects.none()

    def perform_create(self, serializer):
        """Auto-set buyer and calculate total on order creation"""
        order = serializer.save(buyer=self.request.user)
        
        # Calculate total from cart items if available
        if hasattr(self.request.user, 'cart'):
            cart = self.request.user.cart
            order.total_amount = cart.total_price
            order.save()
            
            # Convert cart items to order items
            for item in cart.items.all():
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price
                )
            cart.items.all().delete()

    # ================= ORDER STATUS ACTIONS =================
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Supplier confirms an order"""
        order = self.get_object()
        if order.status != 'pending':
            return Response(
                {'error': 'Only pending orders can be confirmed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'confirmed'
        order.save()
        self._create_history(order, 'confirmed', request.user)
        return Response({'status': 'confirmed'})

    @action(detail=True, methods=['post'])
    def ship(self, request, pk=None):
        """Supplier marks order as shipped"""
        order = self.get_object()
        if order.status != 'confirmed':
            return Response(
                {'error': 'Only confirmed orders can be shipped'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        tracking_number = request.data.get('tracking_number')
        if not tracking_number:
            return Response(
                {'error': 'Tracking number is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'shipped'
        order.tracking_number = tracking_number
        order.save()
        self._create_history(order, 'shipped', request.user)
        return Response({'status': 'shipped'})

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
                {'error': f'Orders can only be cancelled when {valid_statuses}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'cancelled'
        order.save()
        self._create_history(order, 'cancelled', request.user)
        return Response({'status': 'cancelled'})

    # ================= FILTERED ORDER VIEWS =================
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

    # ================= HELPER METHODS =================
    def _create_history(self, order, status, user):
        """Create order history record"""
        OrderHistory.objects.create(
            order=order,
            status=status,
            created_by=user,
            comment=f"Status changed to {status} by {user.get_full_name()}"
        )