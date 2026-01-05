from rest_framework import permissions


class IsSellerOrReadOnly(permissions.BasePermission):
    """Allow edits only for the user who created the item."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if hasattr(obj, 'seller'):
            return obj.seller == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False

