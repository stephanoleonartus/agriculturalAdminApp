from django.db import models
from django.conf import settings
from products.models import Product

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
    ]

    order_id = models.CharField(max_length=120, unique=True, editable=False)
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders_as_buyer', default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    order_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    shipping_address = models.TextField(blank=True)
    billing_address = models.TextField(blank=True)
    tracking_number = models.CharField(max_length=120, blank=True, null=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return self.order_id

    def save(self, *args, **kwargs):
        if not self.order_id:
            # Generate a unique order_id, e.g., using timestamp and user id
            self.order_id = f"ORD-{self.order_date.strftime('%Y%m%d%H%M%S')}-{self.buyer.id}"

        # Recalculate total amount from items if they exist
        if self.pk: # If order is saved and has items
            self.total_amount = sum(item.total_price for item in self.items.all())

        super().save(*args, **kwargs)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='order_items')
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2) # Price per unit at the time of order

    @property
    def total_price(self):
        return self.quantity * self.price

    def __str__(self):
        return f'{self.quantity} x {self.product.name} for Order #{self.order.id}'


class OrderHistory(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='history')
    status = models.CharField(max_length=20, choices=Order.STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    comment = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Order histories"

    def __str__(self):
        return f'Order #{self.order.id} changed to {self.status} at {self.created_at}'

