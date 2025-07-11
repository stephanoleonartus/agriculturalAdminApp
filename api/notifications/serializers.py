from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    recipient_username = serializers.CharField(source='recipient.username', read_only=True)
    actor_username = serializers.CharField(source='actor.username', read_only=True, allow_null=True)
    # TODO: Add more human-readable fields for target and action_object if needed

    class Meta:
        model = Notification
        fields = [
            'id', 'recipient', 'recipient_username', 'actor', 'actor_username',
            'verb', 'description', 'notification_type', 'link',
            'is_read', 'timestamp',
            # 'target', 'action_object' # These might be tricky to serialize directly without more context
            # Consider serializing target/action_object identifiers or a summary string
        ]
        read_only_fields = ('timestamp',)
