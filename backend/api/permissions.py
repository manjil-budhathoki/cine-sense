# backend/api/permissions.py

from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    """
    Custom permission to only allow users with is_staff=True to access an endpoint.
    """
    
    # The 'has_permission' method is automatically called by DRF on every request
    # to a view that uses this permission class.
    def has_permission(self, request, view):
        # The logic is simple:
        # 1. Is there a user associated with the request? (Are they logged in?)
        # 2. If so, is their 'is_staff' attribute True?
        # The 'and' ensures both conditions must be met.
        # `request.user` will be an authenticated User object if they are logged in,
        # otherwise it will be an AnonymousUser object which doesn't have is_staff=True.
        return request.user and request.user.is_staff