# products/filters.py
import django_filters
from django.db.models import Q
from .models import Product, Category

class ProductFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    category = django_filters.ModelChoiceFilter(queryset=Category.objects.all())
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    region = django_filters.CharFilter(field_name='region__name', lookup_expr='icontains')
    owner = django_filters.CharFilter(method='filter_owner')
    available_only = django_filters.BooleanFilter(method='filter_available')
    search = django_filters.CharFilter(method='filter_search')
    
    class Meta:
        model = Product
        fields = ['name', 'category', 'min_price', 'max_price', 'region']
    
    def filter_owner(self, queryset, name, value):
        return queryset.filter(
            Q(owner__first_name__icontains=value) | 
            Q(owner__last_name__icontains=value) |
            Q(owner__username__icontains=value)
        )
    
    def filter_available(self, queryset, name, value):
        if value:
            return queryset.filter(quantity__gt=0)
        return queryset
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) |
            Q(description__icontains=value) |
            Q(category__name__icontains=value)
        )