# products/filters.py
from django_filters import rest_framework as filters
from .models import Product

class ProductFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = filters.NumberFilter(field_name="price", lookup_expr='lte')
    category = filters.CharFilter(field_name="category__name", lookup_expr='iexact')
    region = filters.CharFilter(field_name="region__name", lookup_expr='iexact')
    owner = filters.NumberFilter(field_name="owner__id")
    out_of_stock = filters.BooleanFilter(field_name="quantity", lookup_expr='lte', method='filter_out_of_stock')
    
    class Meta:
        model = Product
        fields = ['category', 'region', 'owner', 'min_price', 'max_price']
    
    def filter_out_of_stock(self, queryset, name, value):
        if value:
            return queryset.filter(quantity__lte=0)
        return queryset.filter(quantity__gt=0)