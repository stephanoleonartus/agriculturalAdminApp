# orders/permissions.py
from rest_framework import permissions

class IsBuyer(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.buyer == request.user

class CanChangeOrderStatus(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Only farmer can change status after creation
        return obj.product.owner == request.user