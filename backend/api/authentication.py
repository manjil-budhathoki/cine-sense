# api/authentication.py

from rest_framework.authentication import SessionAuthentication

class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    SessionAuthentication customized to ignore CSRF checks.
    This is necessary for our API-only backend where the frontend
    (running on a different domain) cannot easily handle CSRF tokens.
    """
    def enforce_csrf(self, request):
        print("--- CSRF CHECK SKIPPED BY CUSTOM AUTH CLASS ---")
        return
    