# chat/serializers.py
from rest_framework import serializers
from .models import ChatRoom, Message, MessageRead

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    reply_to_content = serializers.CharField(source='reply_to.content', read_only=True)
    
    class Meta:
        model = Message
        fields = [
            'id', 'room', 'sender', 'sender_name', 'message_type', 'content',
            'file_url', 'file_name', 'reply_to', 'reply_to_content',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['sender', 'created_at', 'updated_at']

class ChatRoomSerializer(serializers.ModelSerializer):
    participants_names = serializers.StringRelatedField(source='participants', many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatRoom
        fields = [
            'id', 'name', 'room_type', 'participants', 'participants_names',
            'created_by', 'is_active', 'last_message_at', 'last_message',
            'unread_count', 'created_at'
        ]
        read_only_fields = ['created_by', 'created_at']
    
    def get_last_message(self, obj):
        last_message = obj.messages.last()
        if last_message:
            return MessageSerializer(last_message).data
        return None
    
    def get_unread_count(self, obj):
        user = self.context['request'].user
        return obj.messages.exclude(
            read_by__user=user
        ).count()
