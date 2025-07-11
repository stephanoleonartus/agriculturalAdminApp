#  chat/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatRoomViewSet

router = DefaultRouter()
router.register(r'chat', ChatRoomViewSet, basename='chatroom')

urlpatterns = [
    path('api/v1/', include(router.urls)),
]