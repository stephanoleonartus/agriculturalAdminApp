from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve  # ✅ Add this

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/', include('accounts.urls')),
    path('api/products', include('products.urls')),
    path('api/recommendations/', include('recommendations.urls')),
    path('api/v1/chat/', include('chat.urls')),
    path('api/v1/orders/', include('orders.urls')),
    path('api/v1/analytics/', include('analytics.urls')),
    path('api/v1/reviews/', include('reviews.urls')),
    path('api/v1/notifications/', include('notifications.urls')),
]

# Choose only one of the below options:

# ✅ Option 1 (recommended for development)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# OR

# ✅ Option 2 (manual fallback)
# if settings.DEBUG:
#     urlpatterns += [
#         re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
#         re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
#     ]
