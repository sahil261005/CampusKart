from rest_framework import permissions


class IsPosterOrReadOnly(permissions.BasePermission):
    """Allow edits only for the user who created the gig."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.poster == request.user
