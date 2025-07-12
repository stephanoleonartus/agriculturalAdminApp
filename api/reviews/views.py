# reviews/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Count, Q # Added Q
from .models import Review, ReviewResponse, ReviewHelpful
from .serializers import ReviewSerializer, ReviewResponseSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Review.objects.filter(is_approved=True)
    
    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_helpful(self, request, pk=None):
        review = self.get_object()
        is_helpful = request.data.get('is_helpful', True)
        
        helpful_vote, created = ReviewHelpful.objects.get_or_create(
            review=review,
            user=request.user,
            defaults={'is_helpful': is_helpful}
        )
        
        if not created:
            helpful_vote.is_helpful = is_helpful
            helpful_vote.save()
        
        # Update helpful count
        review.helpful_count = review.helpful_votes.filter(is_helpful=True).count()
        review.save()
        
        return Response({'message': 'Review marked as helpful'})
    
    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        review = self.get_object()
        
        if request.user != review.reviewee:
            return Response({'error': 'You can only respond to your own reviews'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        if hasattr(review, 'response'):
            return Response({'error': 'Response already exists'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ReviewResponseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(review=review, created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_reviews(self, request):
        reviews = Review.objects.filter(reviewer=request.user)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def received_reviews(self, request):
        reviews = Review.objects.filter(reviewee=request.user)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'user_id parameter required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        stats = Review.objects.filter(reviewee_id=user_id).aggregate(
            avg_rating=Avg('rating'),
            total_reviews=Count('id'),
            five_star=Count('id', filter=models.Q(rating=5)),
            four_star=Count('id', filter=models.Q(rating=4)),
            three_star=Count('id', filter=models.Q(rating=3)),
            two_star=Count('id', filter=models.Q(rating=2)),
            one_star=Count('id', filter=models.Q(rating=1))
        )
        
        return Response(stats)
