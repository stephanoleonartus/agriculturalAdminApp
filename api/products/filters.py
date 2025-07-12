# products/filters.py
import django_filters
from django.db.models import Q
from .models import Product, Category

class ProductFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    category = django_filters.ModelChoiceFilter(queryset=Category.objects.all())
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    is_organic = django_filters.BooleanFilter()
    region = django_filters.CharFilter(field_name='farmer__region', lookup_expr='icontains')
    farmer = django_filters.CharFilter(method='filter_farmer')
    available_only = django_filters.BooleanFilter(method='filter_available')
    
    class Meta:
        model = Product
        fields = ['name', 'category', 'min_price', 'max_price', 'is_organic', 'region', 'status']
    
    def filter_farmer(self, queryset, name, value):
        return queryset.filter(
            Q(farmer__first_name__icontains=value) | 
            Q(farmer__last_name__icontains=value)
        )
    
    def filter_available(self, queryset, name, value):
        if value:
            return queryset.filter(status='available', quantity_available__gt=0)
        return queryset