from django.contrib import admin
from .models import Notification

class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'recipient', 'verb', 'actor_display', 'target_display', 'notification_type', 'is_read', 'timestamp')
    list_filter = ('notification_type', 'is_read', 'timestamp', 'recipient')
    search_fields = ('recipient__username', 'verb', 'description', 'actor__username')
    readonly_fields = ('timestamp', 'target_content_type', 'target_object_id', 'target',
                       'action_object_content_type', 'action_object_object_id', 'action_object')
    list_select_related = ('recipient', 'actor', 'target_content_type', 'action_object_content_type') # Optimize queries

    def actor_display(self, obj):
        return obj.actor.username if obj.actor else "System"
    actor_display.short_description = "Actor"

    def target_display(self, obj):
        if obj.target:
            return str(obj.target)
        return "N/A"
    target_display.short_description = "Target Object"

    fieldsets = (
        ("Notification Info", {
            'fields': ('recipient', ('actor', 'verb'), 'description', 'notification_type')
        }),
        ("Related Objects (Generic FKs)", {
            'fields': (('target_content_type', 'target_object_id'),
                       ('action_object_content_type', 'action_object_object_id')),
            'classes': ('collapse',)
        }),
        ("Status & Details", {
            'fields': ('is_read', 'link', 'timestamp')
        }),
    )


admin.site.register(Notification, NotificationAdmin)
