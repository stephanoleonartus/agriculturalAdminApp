from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer

class SearchRecommendationsView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
