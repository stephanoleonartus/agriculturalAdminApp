from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer
from django.utils import timezone

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all notifications
        for the currently authenticated user.
        """
        return Notification.objects.filter(recipient=self.request.user)

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = Notification.objects.filter(recipient=request.user, is_read=False).count()
        return Response({'unread_count': count})

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        if notification.recipient == request.user:
            notification.is_read = True
            notification.save()
            return Response({'status': 'notification marked as read'})
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=['post'])
    def mark_as_unread(self, request, pk=None):
        notification = self.get_object()
        if notification.recipient == request.user:
            notification.is_read = False
            notification.save()
            return Response({'status': 'notification marked as unread'})
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'all notifications marked as read'})

    # perform_create, perform_update, perform_destroy can be customized if needed
    # For now, default behavior is fine. Notifications are typically created by system events/signals.
    # Direct creation via API might be limited to admin or specific scenarios.
    def perform_create(self, serializer):
        # This would likely not be a primary way to create notifications for users
        # It's more for testing or specific admin actions if allowed.
        # By default, recipient would need to be set or handled.
        # For now, let's assume it's for testing and recipient is in payload.
        serializer.save()

    # Deleting notifications is allowed by default by ModelViewSet.
    # You might want to override perform_destroy for soft delete or other logic.
    # For example, only allow users to delete their own notifications.
    def destroy(self, request, *args, **kwargs):
        notification = self.get_object()
        if notification.recipient != request.user:
            return Response({'error': 'Permission denied. You can only delete your own notifications.'},
                            status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
