from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, CurrentUserView,
    WatchlistListCreateView, WatchlistDestroyView,
    RecommendationView
)

urlpatterns = [
    # Auth URLS
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', CurrentUserView.as_view(), name='current-user'),

    # Watchlist URLS
    path('watchlist/', WatchlistListCreateView.as_view(), name='watchlist-list-create'),
    path('watchlist/<int:movie_id>/', WatchlistDestroyView.as_view(), name='watchlist-destroy'),

    # Recommendation URLS
    path('recommendations/', RecommendationView.as_view(), name='recommendations'),
]