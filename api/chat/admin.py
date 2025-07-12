from django.contrib import admin
from .models import ChatRoom, Message, MessageRead

class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'room_type', 'created_by', 'created_at', 'last_message_at', 'is_active')
    list_filter = ('room_type', 'is_active', 'created_at')
    search_fields = ('name', 'created_by__username')
    filter_horizontal = ('participants',) # Easier to manage ManyToManyFields

class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'room', 'sender', 'message_type', 'content_preview', 'created_at', 'is_read')
    list_filter = ('message_type', 'is_read', 'created_at', 'room')
    search_fields = ('content', 'sender__username', 'room__name')

    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content Preview'

class MessageReadAdmin(admin.ModelAdmin):
    list_display = ('id', 'message_id_display', 'user', 'read_at')
    list_filter = ('read_at',)
    search_fields = ('user__username', 'message__id')

    def message_id_display(self, obj):
        return obj.message.id
    message_id_display.short_description = 'Message ID'

admin.site.register(ChatRoom, ChatRoomAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(MessageRead, MessageReadAdmin)
