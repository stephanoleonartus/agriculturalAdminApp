# chat/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import ChatRoom, Message, MessageRead
from .serializers import ChatRoomSerializer, MessageSerializer

class ChatRoomViewSet(viewsets.ModelViewSet):
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ChatRoom.objects.filter(
            participants=self.request.user,
            is_active=True
        )
    
    def perform_create(self, serializer):
        room = serializer.save(created_by=self.request.user)
        room.participants.add(self.request.user)
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        room = self.get_object()
        messages = room.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        room = self.get_object()
        
        if request.user not in room.participants.all():
            return Response({'error': 'You are not a participant in this room'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.save(room=room, sender=request.user)
            room.last_message_at = message.created_at
            room.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        room = self.get_object()
        message_id = request.data.get('message_id')
        
        if message_id:
            message = Message.objects.get(id=message_id, room=room)
            MessageRead.objects.get_or_create(
                message=message,
                user=request.user
            )
        else:
            # Mark all messages as read
            unread_messages = room.messages.exclude(
                read_by__user=request.user
            )
            for message in unread_messages:
                MessageRead.objects.get_or_create(
                    message=message,
                    user=request.user
                )
        
        return Response({'message': 'Messages marked as read'})
    
    @action(detail=False, methods=['post'])
    def create_private_chat(self, request):
        participant_id = request.data.get('participant_id')
        
        if not participant_id:
            return Response({'error': 'participant_id is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Check if private chat already exists
        existing_room = ChatRoom.objects.filter(
            room_type='private',
            participants=request.user
        ).filter(
            participants=participant_id
        ).first()
        
        if existing_room:
            serializer = self.get_serializer(existing_room)
            return Response(serializer.data)
        
        # Create new private chat
        room = ChatRoom.objects.create(
            room_type='private',
            created_by=request.user
        )
        room.participants.add(request.user, participant_id)
        
        serializer = self.get_serializer(room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
