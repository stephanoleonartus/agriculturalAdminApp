from django.contrib import admin
from .models import AnalyticsEvent, UserAnalytics, SalesAnalytics

class AnalyticsEventAdmin(admin.ModelAdmin):
    list_display = ('id', 'event_type', 'user_display', 'content_object_display', 'ip_address', 'created_at')
    list_filter = ('event_type', 'created_at')
    search_fields = ('user__username', 'ip_address', 'session_id', 'event_data')
    readonly_fields = ('created_at', 'content_type', 'object_id', 'content_object')

    def user_display(self, obj):
        return obj.user.username if obj.user else "Anonymous"
    user_display.short_description = "User"

    def content_object_display(self, obj):
        if obj.content_object:
            return str(obj.content_object)
        return "N/A"
    content_object_display.short_description = "Related Object"

class UserAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_orders', 'total_spent', 'total_reviews', 'last_login_at', 'updated_at')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('created_at', 'updated_at')

class SalesAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('supplier', 'date', 'total_orders', 'total_revenue', 'completed_orders', 'updated_at')
    list_filter = ('date', 'supplier__region')
    search_fields = ('supplier__username', 'supplier__email')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'date'

admin.site.register(AnalyticsEvent, AnalyticsEventAdmin)
admin.site.register(UserAnalytics, UserAnalyticsAdmin)
admin.site.register(SalesAnalytics, SalesAnalyticsAdmin)
