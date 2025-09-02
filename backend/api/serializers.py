# backend/api/serializers.py

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import WatchlistItem, Profile

# ==============================================================================
#  SERIALIZER #1: For Registering New Users (NO CHANGE)
# ==============================================================================
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'], 
            password = validated_data['password']
        )
        return user

# ==============================================================================
#  SERIALIZER #2: For Displaying User & Profile Data (GET requests)
#  - This is NOW strictly for reading data.
# ==============================================================================
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'favorite_genre', 'profile_picture']

class UserSerializer(serializers.ModelSerializer):
    # 'read_only=True' is important. It tells DRF this field is for display only.
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        # NOTE: 'password' is removed, and there is NO create/update method here.
        fields = ['id', 'username', 'email', 'is_staff', 'is_superuser', 'date_joined', 'profile']


# ==============================================================================
#  SERIALIZER #3: For Updating User & Profile Data (PUT requests)
#  - This is ONLY for writing/updating data.
# ==============================================================================
class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'favorite_genre', 'profile_picture']

class UserUpdateSerializer(serializers.ModelSerializer):
    profile = ProfileUpdateSerializer()

    class Meta:
        model = User
        fields = ('email', 'profile') # Only these fields are expected for an update

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')
        profile = instance.profile

        instance.email = validated_data.get('email', instance.email)
        instance.save()

        profile.bio = profile_data.get('bio', profile.bio)
        profile.favorite_genre = profile_data.get('favorite_genre', profile.favorite_genre)

        profile.profile_picture = profile_data.get('profile_picture', profile.profile_picture)
        profile.save()

        return instance

# ==============================================================================
#  SERIALIZER #4: For the Watchlist (NO CHANGE)
# ==============================================================================
class WatchlistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchlistItem
        fields = ['id', 'user', 'movie_id', 'title', 'poster_path', 'added_at']
        read_only_fields = ['user']

# --- NEW: Admin serializer for updating a user's roles ---
class AdminUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Define the fields an admin is allowed to change
        fields = ['username', 'email', 'is_staff', 'is_active']