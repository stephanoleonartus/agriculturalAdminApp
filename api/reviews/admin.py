from django.contrib import admin
from .models import Review, ReviewResponse, ReviewHelpful

class ReviewResponseInline(admin.StackedInline): # Or TabularInline
    model = ReviewResponse
    extra = 0
    readonly_fields = ('created_at', 'created_by')
    can_delete = False # Typically responses are not deleted, but edited or the review itself is handled

class ReviewHelpfulAdmin(admin.ModelAdmin):
    list_display = ('review_id_display', 'user', 'is_helpful', 'created_at')
    list_filter = ('is_helpful', 'created_at')
    search_fields = ('review__id', 'user__username')

    def review_id_display(self, obj):
        return obj.review.id
    review_id_display.short_description = 'Review ID'

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'reviewer', 'reviewee', 'review_type', 'rating', 'title_preview', 'is_approved', 'helpful_count', 'created_at')
    list_filter = ('review_type', 'rating', 'is_approved', 'is_verified', 'created_at')
    search_fields = ('reviewer__username', 'reviewee__username', 'title', 'comment', 'order_reference')
    readonly_fields = ('created_at', 'updated_at', 'helpful_count')
    actions = ['approve_reviews', 'disapprove_reviews']
    inlines = [ReviewResponseInline]
    fieldsets = (
        (None, {
            'fields': (('reviewer', 'reviewee'), ('review_type', 'rating'), 'title', 'comment')
        }),
        ('Status & Moderation', {
            'fields': (('is_verified', 'is_approved'), 'helpful_count', 'order_reference')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',) # Collapsible section
        }),
    )

    def title_preview(self, obj):
        return obj.title[:30] + '...' if len(obj.title) > 30 else obj.title
    title_preview.short_description = 'Title Preview'

    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)
    approve_reviews.short_description = "Approve selected reviews"

    def disapprove_reviews(self, request, queryset):
        queryset.update(is_approved=False)
    disapprove_reviews.short_description = "Disapprove selected reviews"

class ReviewResponseAdmin(admin.ModelAdmin):
    list_display = ('review_id_display', 'response_preview', 'created_by', 'created_at')
    search_fields = ('review__id', 'response_text', 'created_by__username')
    readonly_fields = ('created_at', 'created_by')

    def review_id_display(self, obj):
        return obj.review.id
    review_id_display.short_description = 'Review ID'

    def response_preview(self, obj):
        return obj.response_text[:50] + '...' if len(obj.response_text) > 50 else obj.response_text
    response_preview.short_description = 'Response Preview'


admin.site.register(Review, ReviewAdmin)
admin.site.register(ReviewResponse, ReviewResponseAdmin) # Can be managed via Review inlines too
admin.site.register(ReviewHelpful, ReviewHelpfulAdmin)
