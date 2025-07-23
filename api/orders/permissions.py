from rest_framework import permissions

class OrderPermission(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_staff or obj.buyer == request.user

        # Write permissions are only allowed to the owner of the order.
        return request.user.is_staff or obj.buyer == request.user