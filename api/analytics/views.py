# analytics/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from datetime import datetime, timedelta
from .models import AnalyticsEvent, UserAnalytics, SalesAnalytics
from .serializers import AnalyticsEventSerializer, UserAnalyticsSerializer, SalesAnalyticsSerializer

class AnalyticsEventViewSet(viewsets.ModelViewSet):
    serializer_class = AnalyticsEventSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return AnalyticsEvent.objects.all()
        return AnalyticsEvent.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def track_event(self, request):
        """Track custom analytics event"""
        event_type = request.data.get('event_type')
        event_data = request.data.get('event_data', {})
        
        # Get client IP and user agent
        ip_address = request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        referrer = request.META.get('HTTP_REFERER', '')
        
        event = AnalyticsEvent.objects.create(
            user=request.user,
            event_type=event_type,
            event_data=event_data,
            ip_address=ip_address,
            user_agent=user_agent,
            referrer=referrer
        )
        
        serializer = self.get_serializer(event)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Get dashboard statistics for admin"""
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        # Get date range
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)
        
        # Basic stats
        total_events = AnalyticsEvent.objects.filter(created_at__gte=start_date).count()
        unique_users = AnalyticsEvent.objects.filter(
            created_at__gte=start_date
        ).values('user').distinct().count()
        
        # Event type breakdown
        event_breakdown = AnalyticsEvent.objects.filter(
            created_at__gte=start_date
        ).values('event_type').annotate(count=Count('id')).order_by('-count')
        
        # Daily activity
        daily_activity = AnalyticsEvent.objects.filter(
            created_at__gte=start_date
        ).extra(
            select={'date': 'DATE(created_at)'}
        ).values('date').annotate(
            count=Count('id'),
            unique_users=Count('user', distinct=True)
        ).order_by('date')
        
        return Response({
            'total_events': total_events,
            'unique_users': unique_users,
            'event_breakdown': list(event_breakdown),
            'daily_activity': list(daily_activity)
        })
    
    @action(detail=False, methods=['get'])
    def user_activity(self, request):
        """Get user activity analytics"""
        user_id = request.query_params.get('user_id')
        days = int(request.query_params.get('days', 30))
        
        if user_id and request.user.is_staff:
            user_filter = Q(user_id=user_id)
        else:
            user_filter = Q(user=request.user)
        
        start_date = timezone.now() - timedelta(days=days)
        
        events = AnalyticsEvent.objects.filter(
            user_filter,
            created_at__gte=start_date
        ).values('event_type').annotate(count=Count('id')).order_by('-count')
        
        return Response(list(events))

class UserAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserAnalyticsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return UserAnalytics.objects.all()
        return UserAnalytics.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def top_users(self, request):
        """Get top users by various metrics"""
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        metric = request.query_params.get('metric', 'total_spent')
        limit = int(request.query_params.get('limit', 10))
        
        if metric not in ['total_spent', 'total_orders', 'total_reviews']:
            return Response({'error': 'Invalid metric'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        top_users = UserAnalytics.objects.order_by(f'-{metric}')[:limit]
        serializer = self.get_serializer(top_users, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def update_user_stats(self, request):
        """Update user analytics (for admin or automated tasks)"""
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'user_id required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # This would typically be called by a background task
        # Update user analytics based on their orders, reviews, etc.
        from orders.models import Order
        from reviews.models import Review
        
        user_analytics, created = UserAnalytics.objects.get_or_create(
            user_id=user_id
        )
        
        # Update order stats
        orders = Order.objects.filter(customer_id=user_id)
        user_analytics.total_orders = orders.count()
        user_analytics.total_spent = orders.aggregate(
            total=Sum('total_amount')
        )['total'] or 0
        
        # Update review stats
        given_reviews = Review.objects.filter(reviewer_id=user_id)
        received_reviews = Review.objects.filter(reviewee_id=user_id)
        
        user_analytics.total_reviews = given_reviews.count()
        user_analytics.avg_rating_given = given_reviews.aggregate(
            avg=Avg('rating')
        )['avg'] or 0
        user_analytics.avg_rating_received = received_reviews.aggregate(
            avg=Avg('rating')
        )['avg'] or 0
        
        user_analytics.save()
        
        serializer = self.get_serializer(user_analytics)
        return Response(serializer.data)

class SalesAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SalesAnalyticsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return SalesAnalytics.objects.all()
        return SalesAnalytics.objects.filter(supplier=self.request.user)
    
    @action(detail=False, methods=['get'])
    def revenue_chart(self, request):
        """Get revenue chart data"""
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now().date() - timedelta(days=days)
        
        if request.user.is_staff:
            # Admin can see all suppliers
            supplier_id = request.query_params.get('supplier_id')
            if supplier_id:
                queryset = SalesAnalytics.objects.filter(
                    supplier_id=supplier_id,
                    date__gte=start_date
                )
            else:
                # Aggregate all suppliers
                queryset = SalesAnalytics.objects.filter(
                    date__gte=start_date
                ).values('date').annotate(
                    total_revenue=Sum('total_revenue'),
                    total_orders=Sum('total_orders')
                ).order_by('date')
                return Response(list(queryset))
        else:
            # Supplier can only see their own data
            queryset = SalesAnalytics.objects.filter(
                supplier=request.user,
                date__gte=start_date
            )
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get sales summary"""
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now().date() - timedelta(days=days)
        
        if request.user.is_staff:
            supplier_id = request.query_params.get('supplier_id')
            if supplier_id:
                queryset = SalesAnalytics.objects.filter(
                    supplier_id=supplier_id,
                    date__gte=start_date
                )
            else:
                queryset = SalesAnalytics.objects.filter(date__gte=start_date)
        else:
            queryset = SalesAnalytics.objects.filter(
                supplier=request.user,
                date__gte=start_date
            )
        
        summary = queryset.aggregate(
            total_revenue=Sum('total_revenue'),
            total_orders=Sum('total_orders'),
            total_completed=Sum('completed_orders'),
            total_cancelled=Sum('cancelled_orders'),
            avg_order_value=Avg('avg_order_value')
        )
        
        return Response(summary)
    
    @action(detail=False, methods=['post'])
    def generate_daily_stats(self, request):
        """Generate daily sales statistics (for admin or automated tasks)"""
        if not request.user.is_staff:
            return Response({'error': 'Admin access required'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        target_date = request.data.get('date')
        if target_date:
            target_date = datetime.strptime(target_date, '%Y-%m-%d').date()
        else:
            target_date = timezone.now().date()
        
        # This would typically be called by a background task
        from orders.models import Order
        from django.contrib.auth.models import User
        
        suppliers = User.objects.filter(supplier_orders__isnull=False).distinct()
        
        for supplier in suppliers:
            orders = Order.objects.filter(
                supplier=supplier,
                order_date__date=target_date
            )
            
            completed_orders = orders.filter(status='delivered')
            cancelled_orders = orders.filter(status='cancelled')
            
            total_revenue = completed_orders.aggregate(
                total=Sum('total_amount')
            )['total'] or 0
            
            avg_order_value = completed_orders.aggregate(
                avg=Avg('total_amount')
            )['avg'] or 0
            
            SalesAnalytics.objects.update_or_create(
                supplier=supplier,
                date=target_date,
                defaults={
                    'total_orders': orders.count(),
                    'total_revenue': total_revenue,
                    'completed_orders': completed_orders.count(),
                    'cancelled_orders': cancelled_orders.count(),
                    'avg_order_value': avg_order_value
                }
            )
        
        return Response({'message': f'Daily stats generated for {target_date}'})


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # In a real application, you would fetch this data from your database
        data = {
            'widgets': [
                {'title': 'Sales', 'value': '$12,345'},
                {'title': 'Customers', 'value': '1,234'},
                {'title': 'Orders', 'value': '567'},
            ],
            'chartData': {
                'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                'values': [1200, 1900, 3000, 5000, 2300, 3200],
            }
        }
        return Response(data)
