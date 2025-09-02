from django.db import models
from django.contrib.auth.models import User


# --- NEW: Helper function for upload path ---
# This will save images to a path like: media/profile_pics/username/image.jpg
def user_directory_path(instance, filename):
    return f'profile_pics/{instance.user.username}/{filename}'



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
    


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, default='')
    favorite_genre = models.CharField(max_length=100, blank=True)
    
    # --- THIS IS THE KEY CHANGE ---
    # Changed from URLField to ImageField.
    # `upload_to` calls our helper function to create a unique path.
    # `null=True` and `blank=True` make the picture optional.
    profile_picture = models.ImageField(upload_to=user_directory_path, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"