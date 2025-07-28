from .models import Notification
from django.contrib.contenttypes.models import ContentType

def create_notification(actor, recipient, verb, target=None, action_object=None, notif_type='general', description=None, link=None):
    Notification.objects.create(
        actor=actor,
        recipient=recipient,
        verb=verb,
        target=target,
        action_object=action_object,
        notification_type=notif_type,
        description=description,
        link=link
    )
