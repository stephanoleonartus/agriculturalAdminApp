# reviews/serializers.py
from rest_framework import serializers
from .models import Review, ReviewResponse, ReviewHelpful

class ReviewResponseSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = ReviewResponse
        fields = ['id', 'response_text', 'created_by_name', 'created_at']

class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.username', read_only=True)
    reviewee_name = serializers.CharField(source='reviewee.username', read_only=True)
    response = ReviewResponseSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'reviewer', 'reviewee', 'reviewer_name', 'reviewee_name',
            'review_type', 'rating', 'title', 'comment', 'is_verified',
            'is_approved', 'helpful_count', 'order_reference', 'response',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['reviewer', 'helpful_count', 'is_verified', 'created_at', 'updated_at']
