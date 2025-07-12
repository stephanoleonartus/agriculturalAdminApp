#  chat/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatRoomViewSet

router = DefaultRouter()
router.register(r'rooms', ChatRoomViewSet, basename='chatroom') # Changed base path to 'rooms'

urlpatterns = [
    path('', include(router.urls)), # Removed 'api/v1/' prefix from here
]