# analytics/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnalyticsEventViewSet, UserAnalyticsViewSet, SalesAnalyticsViewSet, DashboardStatsView

router = DefaultRouter()
router.register(r'events', AnalyticsEventViewSet, basename='analytics-event')
router.register(r'users', UserAnalyticsViewSet, basename='user-analytics')
router.register(r'sales', SalesAnalyticsViewSet, basename='sales-analytics')

urlpatterns = [
    path('', include(router.urls)), # Removed 'api/v1/analytics/'
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]