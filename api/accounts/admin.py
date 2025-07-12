from django.contrib import admin
from .models import User, UserProfile, FarmerProfile, SupplierProfile

admin.site.register(User)
admin.site.register(UserProfile)
admin.site.register(FarmerProfile)
admin.site.register(SupplierProfile)
