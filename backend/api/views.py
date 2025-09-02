from django.contrib.auth import login, logout, authenticate
from django.conf import settings
import os


from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from .serializers import UserSerializer, WatchlistItemSerializer
from .models import WatchlistItem
from .tmdb_service import get_movie_details

import pickle
import numpy as np
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from torch.nn.functional import sigmoid
from sklearn.metrics.pairwise import cosine_similarity

# ==============================================================================
#  LOAD ALL ML ASSETS (runs once when the server starts)
# ==============================================================================
try:
    print("--- Loading ML Model and Pre-computed Assets ---")
    
    # --- 1. Load the pre-computed movie data and emotion matrix ---
    # settings.BASE_DIR points to your 'backend' folder
    movies_data_path = os.path.join(settings.BASE_DIR, 'api/ml_model/movies_data.pkl')
    emotion_matrix_path = os.path.join(settings.BASE_DIR, 'api/ml_model/movie_emotion_matrix.pkl')

    with open(movies_data_path, 'rb') as f:
        movies_df = pickle.load(f)
    
    with open(emotion_matrix_path, 'rb') as f:
        movie_emotion_matrix = pickle.load(f)
    
    # --- 2. Load the Hugging Face GoEmotions model for live prediction ---
    MODEL_NAME = "TuhinG/distilbert-goemotions"
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    live_model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
    live_model.eval()

    # --- 3. Precompute the emotion mappings ---
    goemotions_labels = [
        "admiration", "amusement", "anger", "annoyance", "approval", "caring", "confusion",
        "curiosity", "desire", "disappointment", "disapproval", "disgust", "embarrassment",
        "excitement", "fear", "gratitude", "grief", "joy", "love", "nervousness", "optimism",
        "pride", "realization", "relief", "remorse", "sadness", "surprise", "neutral"
    ]
    mapping_7_emotions = {
        "joy": ["amusement", "excitement", "gratitude", "joy", "optimism", "pride", "relief"],
        "love": ["admiration", "desire", "love", "caring", "approval"],
        "sadness": ["disappointment", "grief", "remorse", "sadness"],
        "fear": ["nervousness", "fear"],
        "anger": ["anger", "annoyance", "disapproval"],
        "surprise": ["surprise", "realization", "curiosity"],
        "disgust": ["disgust", "embarrassment", "confusion"]
    }
    emotion_to_indices = {
        k: [goemotions_labels.index(lbl) for lbl in v if lbl in goemotions_labels]
        for k, v in mapping_7_emotions.items()
    }
    print("--- ML Assets loaded successfully! ---")

except Exception as e:
    print(f"--- FATAL ERROR loading ML assets: {e} ---")
    live_model = None



# ==============================================================================
#  HELPER FUNCTION FOR LIVE MOOD ANALYSIS
# ==============================================================================
def extract_user_emotion_vector(text):
    if live_model is None: return np.zeros(7)
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = live_model(**inputs)
        probs = torch.sigmoid(outputs.logits).cpu().numpy()[0]
    mapped_vec = [np.mean([probs[j] for j in idxs]) for emo, idxs in emotion_to_indices.items()]
    mapped_vec = np.array(mapped_vec)
    if mapped_vec.sum() > 0:
        mapped_vec /= mapped_vec.sum()
    return mapped_vec


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
    def get(self, request):
        mood_text = request.query_params.get('mood')
        if not mood_text:
            return Response({"error": "A 'mood' query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        if live_model is None:
            return Response({"error": "Recommendation model is unavailable."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # --- Step 1: Analyze user's mood text ---
        user_vec = extract_user_emotion_vector(mood_text)
        
        # --- Step 2: Find similar movies ---
        sims = cosine_similarity(user_vec.reshape(1, -1), movie_emotion_matrix)[0]
        top_indices = sims.argsort()[::-1][:10]
        
        # This gives us a DataFrame with 'id' and 'title'
        recommended_movies_base = movies_df.iloc[top_indices]
        
        # --- Step 3: Enrich the recommendations with live API data ---
        enriched_recommendations = []
        for i, movie_id in enumerate(recommended_movies_base['id']):
            details = get_movie_details(movie_id)
            if details:
                # *** NEW: Add the similarity score to each movie's details ***
                details['similarity_score'] = float(sims[top_indices[i]])
                enriched_recommendations.append(details)

        # --- Step 4: Prepare the new, detailed response payload ---
        # *** NEW: Create the user's emotion profile for the response ***
        emotion_labels = ["joy", "love", "sadness", "fear", "anger", "surprise", "disgust"]
        user_emotion_profile = {label: float(score) for label, score in zip(emotion_labels, user_vec)}
        
        # *** NEW: Combine everything into the final response object ***
        final_response = {
            "user_mood_text": mood_text,
            "detected_emotion_profile": user_emotion_profile,
            "recommendations": enriched_recommendations
        }
            
        return Response(final_response)
