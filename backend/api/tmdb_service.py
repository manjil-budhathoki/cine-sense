# backend/api/tmdb_service.py

import os
import requests

def get_movie_details(movie_id):
    """
    Fetches details for a single movie from the TMDb API.
    """
    api_key = os.getenv('TMDB_API_KEY')
    if not api_key:
        print("ERROR: TMDB_API_KEY not found in environment variables.")
        return None

    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}&language=en-US"

    try:
        response = requests.get(url)
        response.raise_for_status() # Raise an exception for bad status codes
        data = response.json()
        
        # We only need a few key pieces of information
        details = {
            'id': data.get('id'),
            'title': data.get('title'),
            'overview': data.get('overview'),
            'poster_path': data.get('poster_path'),
            'release_date': data.get('release_date'),
            'vote_average': data.get('vote_average'),
        }
        return details
    except requests.RequestException as e:
        print(f"Error fetching details for movie_id {movie_id}: {e}")
        return None