from django.contrib.auth import login, logout, authenticate
from .serializers import WatchlistItemSerializer

from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer, WatchlistItem
from .tmdb_service import get_movies_by_mood



class RegisterView(APIView):
    # Allow any user (authenticated or not) to access this endpoint

    permission_classes = [AllowAny]


    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)


        if user is not None:
            login(request, user)
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    # The user must be authenticated to log out.
    # DRF's default permission (IsAuthenticated) will be used here.

    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

class CurrentUserView(APIView):

    # Also uses the default IsAuthenticated permission
    
    def get(self, request):

        # request.user is automatically populated by Django/DRF
        # if the session cookie is valid.
        serializer = UserSerializer(request.user)
        return Response(serializer.data)



class WatchlistListCreateView(generics.ListCreateAPIView):

    serializer_class = WatchlistItemSerializer

    def get_queryset(self):
        # This is crucial: only return watchlist items for the current user.
        return WatchlistItem.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # This is also crucial: associate the new item with the current user.
        serializer.save(user=self.request.user)


class WatchlistDestroyView(generics.DestroyAPIView):

    serializer_class = WatchlistItemSerializer

    # We will look up the movie by it's TMDb ID from the URl
    lookup_field = "movie_id"

    def get_queryset(self):

        # Ensure a user can only delete Their Own Watchlist Items
        return WatchlistItem.objects.filter(user=self.request.user)


class RecommendationView(APIView):
    # This will use the default IsAuthenticated permission class
    def get(self, request):
        mood = request.query_params.get('mood')

        if not mood:
            return Response(
                {"error": "A 'mood' query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        movies = get_movies_by_mood(mood)
        return Response(movies)