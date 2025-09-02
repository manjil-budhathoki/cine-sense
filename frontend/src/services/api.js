// src/services/api.js

import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // NEW AND CORRECT for the proxy
  withCredentials: true,
});

// --- AUTHENTICATION ---
export const registerUser = (userData) => {
  // Use apiClient
  return apiClient.post('/register/', userData);
};

export const loginUser = (credentials) => {
  // Use apiClient
  return apiClient.post('/login/', credentials);
};

export const logoutUser = () => {
  // Use apiClient
  return apiClient.post('/logout/');
};

export const getCurrentUser = () => {
  // Use apiClient
  return apiClient.get('/user/');
};

// --- MOVIES ---
export const getRecommendations = (mood) => {
  // Use apiClient
  return apiClient.get(`/recommendations/?mood=${mood}`);
};

// --- WATCHLIST ---
export const getWatchlist = () => {
  // Use apiClient
  return apiClient.get('/watchlist/');
};

export const addToWatchlist = (movieData) => {
  // Use apiClient
  return apiClient.post('/watchlist/', movieData);
};

export const removeFromWatchlist = (movieId) => {
  // Use apiClient
  return apiClient.delete(`/watchlist/${movieId}/`);
};