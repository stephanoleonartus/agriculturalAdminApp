#  analytics/serializers.py
from rest_framework import serializers
from .models import AnalyticsEvent, UserAnalytics, SalesAnalytics

class AnalyticsEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticsEvent
        fields = [
            'id', 'user', 'event_type', 'event_data', 'ip_address',
            'user_agent', 'referrer', 'session_id', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']

class UserAnalyticsSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserAnalytics
        fields = [
            'id', 'user', 'username', 'total_orders', 'total_spent',
            'total_reviews', 'avg_rating_given', 'avg_rating_received',
            'last_login_at', 'total_login_count', 'created_at', 'updated_at'
        ]

class SalesAnalyticsSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.username', read_only=True)
    
    class Meta:
        model = SalesAnalytics
        fields = [
            'id', 'supplier', 'supplier_name', 'date', 'total_orders',
            'total_revenue', 'completed_orders', 'cancelled_orders',
            'avg_order_value', 'created_at', 'updated_at'
        ]
