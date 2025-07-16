# products/permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the owner of the product
        return obj.owner == request.user

class IsFarmerOrSupplier(permissions.BasePermission):
    """
    Custom permission to only allow farmers or suppliers to create/modify products
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['farmer', 'supplier']

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions require farmer/supplier role and ownership
        return request.user.role in ['farmer', 'supplier'] and obj.owner == request.user

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to perform any action.
    Regular users have read-only access.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff