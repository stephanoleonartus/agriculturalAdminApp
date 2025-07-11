from django.contrib import admin
from .models import Order, OrderItem, OrderHistory
from decimal import Decimal # Import Decimal

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0 # Number of empty forms to display
    readonly_fields = ('total_price',)

class OrderHistoryInline(admin.TabularInline):
    model = OrderHistory
    extra = 0
    readonly_fields = ('created_at', 'created_by')
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False # Disable adding history directly through admin inline for Order

class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'customer', 'supplier', 'status', 'payment_status', 'total_amount', 'order_date')
    list_filter = ('status', 'payment_status', 'order_date', 'customer__region', 'supplier__region')
    search_fields = ('order_id', 'customer__username', 'supplier__username', 'customer__email', 'supplier__email')
    readonly_fields = ('order_id', 'order_date', 'created_at', 'updated_at', 'total_amount') # total_amount calculated by items
    inlines = [OrderItemInline, OrderHistoryInline]
    date_hierarchy = 'order_date'
    fieldsets = (
        (None, {
            'fields': ('order_id', ('customer', 'supplier'), ('status', 'payment_status'), 'total_amount')
        }),
        ('Address Information', {
            'fields': ('shipping_address', 'billing_address')
        }),
        ('Dates & Tracking', {
            'fields': ('order_date', 'delivery_date', 'tracking_number')
        }),
        ('Additional Information', {
            'fields': ('notes', 'created_at', 'updated_at')
        }),
    )

    def save_model(self, request, obj, form, change):
        # If OrderHistory is being added implicitly by status change or something
        # This example doesn't do that, but it's a place for such logic
        super().save_model(request, obj, form, change)

    def save_formset(self, request, form, formset, change):
        # Recalculate total_amount when OrderItems are changed
        if formset.model == OrderItem:
            instances = formset.save(commit=False)
            order_total = Decimal('0.00')
            for item in instances:
                if not item.pk: # If new item
                    item.save() # Save to get pk for total_price calculation if any
                order_total += item.total_price

            # Save items after potential calculations
            formset.save()

            order = form.instance
            if order.total_amount != order_total:
                order.total_amount = order_total
                order.save(update_fields=['total_amount'])
        else:
            super().save_formset(request, form, formset, change)


class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product_name', 'quantity', 'unit_price', 'total_price')
    list_filter = ('order__status',)
    search_fields = ('product_name', 'order__order_id')
    readonly_fields = ('total_price',)

class OrderHistoryAdmin(admin.ModelAdmin):
    list_display = ('order', 'status', 'comment_preview', 'created_by', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('order__order_id', 'comment', 'created_by__username')
    readonly_fields = ('created_by', 'created_at')

    def comment_preview(self, obj):
        return obj.comment[:50] + '...' if len(obj.comment) > 50 else obj.comment
    comment_preview.short_description = 'Comment Preview'

admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin) # Usually managed via Order inlines, but can be registered
admin.site.register(OrderHistory, OrderHistoryAdmin)
