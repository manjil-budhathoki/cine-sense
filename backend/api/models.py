from django.db import models
from django.contrib.auth.models import User

class WatchlistItem(models.Model):
    # Link to the user who saved the item
    # If the user is deleted, delete their watchlists items too.
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # Store movie information from the TMDb API
    movie_id = models.IntegerField()
    title = models.CharField(max_length=200)
    poster_path = models.CharField(max_length=200)

    # Automatically record the data and time when an item is added
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Enforce that a user can only add a specific movie_id once.
        unique_together = ('user', 'movie_id')
    

    def __str__(self):
        return f"{self.user.username}'s watchlist: {self.title}"