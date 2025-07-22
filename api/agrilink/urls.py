from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from rest_framework_simplejwt.views import TokenRefreshView  # Add this

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/products/', include('products.urls')),
    path('api/recommendations/', include('recommendations.urls')),
    path('api/chat/', include('chat.urls')),  # Removed v1 for consistency
    path('api/orders/', include('orders.urls')),  # Removed v1
    path('api/analytics/', include('analytics.urls')),  # Removed v1
    path('api/reviews/', include('reviews.urls')),  # Removed v1
    path('api/notifications/', include('notifications.urls')),  # Removed v1
    
    # Add token refresh endpoint
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Static and media files handling
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    # Production-ready static files serving
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
        re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
    ]