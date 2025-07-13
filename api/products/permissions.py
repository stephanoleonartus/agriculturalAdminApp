from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    Assumes the model instance has a `farmer` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the product.
        return obj.farmer == request.user

class IsFarmerOrSupplier(permissions.BasePermission):
    """
    Custom permission to only allow users with user_type 'farmer' or 'supplier'
    to create, update, or delete objects.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.user_type in ['farmer', 'supplier']

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed if the user is a farmer/supplier
        # AND they are the owner of the product.
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.user_type not in ['farmer', 'supplier']:
            return False

        # Check if the user is the owner of the product
        # Assumes the object `obj` has a `farmer` attribute.
        return obj.farmer == request.user

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to perform any action.
    Regular users have read-only access.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff
