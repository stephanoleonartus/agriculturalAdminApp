from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Order, OrderItem, OrderHistory
from .serializers import OrderSerializer, OrderCreateSerializer, OrderHistorySerializer
from .permissions import OrderPermission
from products.models import Product
from chat.models import ChatRoom
from chat.serializers import ChatRoomSerializer
from notifications.utils import create_notification

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

        # For farmers, return orders they are assigned to
        if hasattr(user, 'farmer_profile'):
            return Order.objects.filter(farmer=user)

        # For buyers, return orders they have created
        return Order.objects.filter(buyer=user)

    def perform_create(self, serializer):
        """
        Create an order and assign the correct farmer based on the product.
        """
        items_data = serializer.validated_data.pop('items')

        # The validation is now in the serializer, so we can safely get the farmer from the first item
        farmer = items_data[0]['product'].owner

        # Create the order
        order = serializer.save(buyer=self.request.user, farmer=farmer)

        # Create order items
        for item_data in items_data:
            OrderItem.objects.create(
                order=order,
                product=item_data['product'],
                quantity=item_data['quantity'],
                price=item_data['product'].price  # Use the current product price
            )

        # Create a chat room for the order
        chat_room = ChatRoom.objects.create(
            name=f"Order #{order.order_id}",
            room_type='private',
            created_by=self.request.user
        )
        chat_room.participants.add(self.request.user, farmer)
        order.chat = chat_room

        # Recalculate the total amount based on the items
        order.save()

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm a pending order (farmer only)"""
        order = self.get_object()
        if order.status != 'pending':
            return Response(
                {'error': 'Only pending orders can be confirmed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Add permission check to ensure only the assigned farmer can confirm
        if request.user != order.farmer:
            return Response(
                {'error': 'You are not authorized to confirm this order'},
                status=status.HTTP_403_FORBIDDEN
            )

        order.status = 'confirmed'
        order.save()
        self._create_history(order, 'confirmed', request.user)
        create_notification(
            actor=request.user,
            recipient=order.buyer,
            verb='confirmed your order',
            target=order,
            notif_type='order_update'
        )
        return Response({'status': 'confirmed'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a pending order (farmer only)"""
        order = self.get_object()
        if order.status != 'pending':
            return Response(
                {'error': 'Only pending orders can be rejected'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Add permission check to ensure only the assigned farmer can reject
        if request.user != order.farmer:
            return Response(
                {'error': 'You are not authorized to reject this order'},
                status=status.HTTP_403_FORBIDDEN
            )

        order.status = 'rejected'
        order.save()
        self._create_history(order, 'rejected', request.user)
        create_notification(
            actor=request.user,
            recipient=order.buyer,
            verb='rejected your order',
            target=order,
            notif_type='order_update'
        )
        return Response({'status': 'rejected'})

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
        create_notification(
            actor=request.user,
            recipient=order.buyer,
            verb='delivered your order',
            target=order,
            notif_type='order_update'
        )
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

        # Notify the other party
        if request.user == order.buyer:
            recipient = order.farmer
        else:
            recipient = order.buyer

        create_notification(
            actor=request.user,
            recipient=recipient,
            verb='cancelled an order',
            target=order,
            notif_type='order_update'
        )
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

    @action(detail=True, methods=['get'])
    def chat(self, request, pk=None):
        """Retrieve the chat room for an order"""
        order = self.get_object()
        if not order.chat:
            return Response(
                {'error': 'Chat room not found for this order'},
                status=status.HTTP_404_NOT_FOUND
            )

        # You might want to use a more specific serializer for the chat room
        serializer = ChatRoomSerializer(order.chat, context={'request': request})
        return Response(serializer.data)

    def _create_history(self, order, status, user):
        """Create order history record"""
        OrderHistory.objects.create(
            order=order,
            status=status,
            created_by=user,
            comment=f"Status changed to {status} by {user.get_full_name()}"
        )