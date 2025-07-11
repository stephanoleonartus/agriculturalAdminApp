from django.db import models
from django.conf import settings
from django.utils import timezone

class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = [
        ('new_message', 'New Message'),
        ('order_update', 'Order Update'),
        ('product_update', 'Product Update'), # e.g. price change, back in stock
        ('review_response', 'Review Response'),
        ('new_follower', 'New Follower'), # If implementing follow system
        ('system_alert', 'System Alert'),
        ('promotion', 'Promotion'),
        ('general', 'General Notification'),
    ]

    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='triggered_notifications') # User who triggered notification

    verb = models.CharField(max_length=255) # e.g., "replied to your review", "updated your order"
    description = models.TextField(blank=True, null=True) # Optional longer text

    # For generic relations
    from django.contrib.contenttypes.models import ContentType
    from django.contrib.contenttypes.fields import GenericForeignKey

    target_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True) # For generic foreign key to target object
    target_object_id = models.PositiveIntegerField(null=True, blank=True)
    target = GenericForeignKey('target_content_type', 'target_object_id') # e.g., the Order, the Product, the Review

    action_object_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True, related_name='notification_action_object') # e.g., the Message in a chat, the specific Product that was updated
    action_object_object_id = models.PositiveIntegerField(null=True, blank=True)
    action_object = GenericForeignKey('action_object_content_type', 'action_object_object_id')

    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPE_CHOICES, default='general')
    link = models.URLField(blank=True, null=True, help_text="A direct link related to the notification, if applicable.")

    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(default=timezone.now) # Use default=timezone.now for flexibility, auto_now_add=True if only creation time needed

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
        ]

    def __str__(self):
        if self.target:
            return f'{self.actor} {self.verb} {self.target} for {self.recipient}'
        return f'{self.actor} {self.verb} for {self.recipient}'

    def mark_as_read(self):
        if not self.is_read:
            self.is_read = True
            self.save()

    def mark_as_unread(self):
        if self.is_read:
            self.is_read = False
            self.save()

# Example of how to create a notification (would be in a signal or view)
# from django.contrib.contenttypes.models import ContentType
# def create_my_notification(actor, recipient, verb, target=None, action_object=None, notif_type='general', description=None, link=None):
#     Notification.objects.create(
#         actor=actor,
#         recipient=recipient,
#         verb=verb,
#         target=target,
#         action_object=action_object,
#         notification_type=notif_type,
#         description=description,
#         link=link
#     )
