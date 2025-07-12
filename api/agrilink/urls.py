"""
URL configuration for api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path # Added include
from django.conf import settings # Added settings
from django.conf.urls.static import static # Added static

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Unified API URLs
    path('api/accounts/', include('accounts.urls')),
    path('api/products/', include('products.urls')),
    path('api/recommendations/', include('recommendations.urls')),

    # Chat
    path('api/v1/chat/', include('chat.urls')),
    # Orders
    path('api/v1/orders/', include('orders.urls')),
    # Analytics
    path('api/v1/analytics/', include('analytics.urls')),
    # Reviews
    path('api/v1/reviews/', include('reviews.urls')),
    # Notifications
    path('api/v1/notifications/', include('notifications.urls')),

    # Add other apps here...
]

if settings.DEBUG:
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', static.serve, {'document_root': settings.MEDIA_ROOT}),
        re_path(r'^static/(?P<path>.*)$', static.serve, {'document_root': settings.STATIC_ROOT}),
    ]
