# Generated by Django 5.2.4 on 2025-07-16 04:47

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserAnalytics',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_orders', models.PositiveIntegerField(default=0)),
                ('total_spent', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('total_reviews', models.PositiveIntegerField(default=0)),
                ('avg_rating_given', models.DecimalField(decimal_places=2, default=0, max_digits=3)),
                ('avg_rating_received', models.DecimalField(decimal_places=2, default=0, max_digits=3)),
                ('last_login_at', models.DateTimeField(blank=True, null=True)),
                ('total_login_count', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='analytics', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='AnalyticsEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event_type', models.CharField(choices=[('page_view', 'Page View'), ('order_created', 'Order Created'), ('order_completed', 'Order Completed'), ('review_created', 'Review Created'), ('user_registration', 'User Registration'), ('product_view', 'Product View'), ('search', 'Search'), ('click', 'Click'), ('download', 'Download')], max_length=50)),
                ('event_data', models.JSONField(default=dict)),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True)),
                ('user_agent', models.TextField(blank=True)),
                ('referrer', models.URLField(blank=True)),
                ('session_id', models.CharField(blank=True, max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('object_id', models.PositiveIntegerField(blank=True, null=True)),
                ('content_type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
                'indexes': [models.Index(fields=['user', 'event_type'], name='analytics_a_user_id_7df679_idx'), models.Index(fields=['created_at'], name='analytics_a_created_546677_idx')],
            },
        ),
        migrations.CreateModel(
            name='SalesAnalytics',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('total_orders', models.PositiveIntegerField(default=0)),
                ('total_revenue', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('completed_orders', models.PositiveIntegerField(default=0)),
                ('cancelled_orders', models.PositiveIntegerField(default=0)),
                ('avg_order_value', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('supplier', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sales_analytics', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-date'],
                'unique_together': {('supplier', 'date')},
            },
        ),
    ]
