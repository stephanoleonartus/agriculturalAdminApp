from rest_framework import viewsets, permissions
from .models import Order
from .serializers import OrderSerializer
from products.permissions import IsOwnerOrReadOnly

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'buyer':
            return Order.objects.filter(buyer=user)
        else:
            return Order.objects.filter(product__owner=user)

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)