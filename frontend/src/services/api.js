// frontend/src/services/api.js
import axios from 'axios';

// This is our configured client that uses the Vite proxy
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// --- AUTHENTICATION ---
export const registerUser = (userData) => {
  return apiClient.post('/register/', userData);
};

export const loginUser = (credentials) => {
  return apiClient.post('/login/', credentials);
};

export const logoutUser = () => {
  return apiClient.post('/logout/');
};

export const getCurrentUser = () => {
  return apiClient.get('/user/');
};


// --- RECOMMENDATIONS ---
export const getRecommendations = (mood) => {
  // Use encodeURIComponent to safely pass the mood text in the URL
  return apiClient.get(`/recommendations/?mood=${encodeURIComponent(mood)}`);
};


// --- NEW: MOVIE DETAILS ---
// This function gets details for ONE movie. It calls TMDb directly.
export const getMovieById = (movieId) => {
  // We need to get the API key from our environment variables
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  if (!TMDB_API_KEY) {
    console.error("VITE_TMDB_API_KEY is not set in your .env file!");
    return Promise.reject("API Key for TMDb is not configured.");
  }
  // We use the original axios here because we're calling an external domain, not our proxied backend
  return axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits`);
};


// --- WATCHLIST ---
export const getWatchlist = () => {
  return apiClient.get('/watchlist/');
};

export const addToWatchlist = (movieData) => {
  return apiClient.post('/watchlist/', movieData);
};

export const removeFromWatchlist = (movieId) => {
  return apiClient.delete(`/watchlist/${movieId}/`);
};

export const getProfile = () => {
  return apiClient.get('/profile/');
};

export const updateProfile = (formData) => {
  // 'formData' will now be a FormData object, not a plain JSON object.
  // Axios will automatically set the correct headers when it detects FormData.
  return apiClient.put('/profile/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getSimilarMovies = (movieId) => {
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  if (!TMDB_API_KEY) {
    return Promise.reject("API Key for TMDb is not configured.");
  }
  // The 'recommendations' endpoint in TMDb is their version of "similar movies"
  return axios.get(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}&language=en-US`);
};

export const getAdminStats = () => {
  return apiClient.get('/admin/stats/');
};

export const getAllUsers = () => {
  return apiClient.get('/admin/users/');
};

export const getUserById = (userId) => {
  return apiClient.get(`/admin/users/${userId}/`);
};

export const updateUserAsAdmin = (userId, userData) => {
  return apiClient.patch(`/admin/users/${userId}/`, userData);
};

export const deleteUserAsAdmin = (userId) => {
  return apiClient.delete(`/admin/users/${userId}/`);
};