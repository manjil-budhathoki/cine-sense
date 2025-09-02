# api/tmdb_service.py
import os
import requests

# TMDb Genre IDs. You can find the full list on the TMDb website.
# https://developer.themoviedb.org/reference/genre-movie-list

GENRE_IDS = {
    'action': 28,
    'comedy': 35,
    'drama': 18,
    'horror': 27,
    'romance': 10749,
    'thriller': 53,
    'sci-fi': 878,
}

# This is the "brain" of our recommendation engine.
# It maps a mood to a combination of TMDb genres.

MOOD_MAP = {
    'happy': [GENRE_IDS['comedy'], GENRE_IDS['romance']],
    'sad': [GENRE_IDS['drama']],
    'thrilled': [GENRE_IDS['action'], GENRE_IDS['thriller'], GENRE_IDS['horror']],
    'adventurous': [GENRE_IDS['action'], GENRE_IDS['sci-fi']],
}

def get_movies_by_mood(mood):
    api_key = os.getenv('TMDB_API_KEY')
    if not api_key:
        # Handle case where API key is not set
        return []

    # Find the corresponding genre IDs for the given mood
    genre_ids = MOOD_MAP.get(mood.lower())
    if not genre_ids:
        return []

    # Convert the list of genre IDs to a comma-separated string for the API
    genres_str = ",".join(map(str, genre_ids))

    # Construct the URL for the TMDb Discover API
    url = (
        f"https://api.themoviedb.org/3/discover/movie?"
        f"api_key={api_key}&"
        f"with_genres={genres_str}&"
        f"sort_by=popularity.desc&"  # Get the most popular movies
        f"include_adult=false&"
        f"language=en-US&"
        f"page=1"
    )

    try:
        response = requests.get(url)
        response.raise_for_status()  # Raises an exception for bad status codes (4xx or 5xx)
        data = response.json()

        # Format the data to be cleaner for our frontend
        formatted_movies = []
        for movie in data.get('results', []):
            formatted_movies.append({
                'id': movie.get('id'),
                'title': movie.get('title'),
                'overview': movie.get('overview'),
                'poster_path': movie.get('poster_path')
            })
        return formatted_movies
    except requests.RequestException as e:
        # Handle potential network errors or bad responses
        print(f"Error fetching from TMDb: {e}")
        return []