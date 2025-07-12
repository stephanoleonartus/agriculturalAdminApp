from django.urls import path
from .views import SearchRecommendationsView

urlpatterns = [
    path('search/recommendations/', SearchRecommendationsView.as_view(), name='search-recommendations'),
]
