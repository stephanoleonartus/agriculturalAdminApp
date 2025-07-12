from django.contrib import admin
from .models import Category, Product, ProductImage, ProductVideo, ProductView, Wishlist, Cart, CartItem

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(ProductVideo)
admin.site.register(ProductView)
admin.site.register(Wishlist)
admin.site.register(Cart)
admin.site.register(CartItem)
