from django.contrib.auth.models import User
from rest_framework import serializers
from .models import WatchlistItem

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        read_only_fields = ['id']
        extra_kwargs = {'password': {'write_only': True}}

    
    def create(self, validated_data):
        
        # Use the create_user method to ensure the password is properly hashed.
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )

        return user

class WatchlistItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = WatchlistItem
        fields = ['id', 'user', 'movie_id', 'title', 'poster_path', 'added_at']

        # The user should be set automatically based on the logged-in user,
        # not provided manually in the request body.

        read_only_fields = ['user']
        