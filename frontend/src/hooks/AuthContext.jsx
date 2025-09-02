import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getCurrentUser, 
  loginUser, 
  logoutUser, 
  registerUser, 
  getWatchlist, 
  addToWatchlist, 
  removeFromWatchlist 
} from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // --- KEY CHANGE: Store the full movie objects in an array, not just IDs in a Set ---
  const [watchlist, setWatchlist] = useState([]);

  // This is a single, robust function to fetch all data for a logged-in user
  const fetchAllUserData = async () => {
    try {
      const [userResponse, watchlistResponse] = await Promise.all([
        getCurrentUser(),
        getWatchlist()
      ]);

      setUser(userResponse.data);
      // Store the full array of watchlist item objects from the API
      setWatchlist(watchlistResponse.data);
      setIsAuthenticated(true);

    } catch (error) {
      // If fetching fails, clear all user-related state
      setUser(null);
      setIsAuthenticated(false);
      setWatchlist([]);
    }
  };

  useEffect(() => {
    const checkInitialAuth = async () => {
      setLoading(true);
      await fetchAllUserData();
      setLoading(false);
    };
    checkInitialAuth();
  }, []);

  const login = async (credentials) => {
    await loginUser(credentials);
    // After logging in, refetch all user data including the watchlist
    const userResponse = await fetchAllUserData();
    return userResponse;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    setWatchlist([]);
  };
  
  // --- UPDATED: Watchlist Add Handler ---
  const handleAddToWatchlist = async (movieData) => {
    try {
      // The API call to the backend
      const response = await addToWatchlist(movieData);
      
      // Optimistically update the local state with the new item returned from the backend
      setWatchlist(prev => [...prev, response.data]);
      
      toast.success(`${movieData.title} added to watchlist!`);
    } catch (error) {
      const errorMessage = error.response?.data?.movie_id?.[0] || 'Already in watchlist.';
      toast.error(errorMessage);
    }
  };

  // --- UPDATED: Watchlist Remove Handler ---
  const handleRemoveFromWatchlist = async (movie) => {
    try {
      await removeFromWatchlist(movie.id);
      
      // Optimistically update the local state by filtering out the removed item
      setWatchlist(prev => prev.filter(item => item.movie_id !== movie.id));

      toast.success(`${movie.title} removed from watchlist.`);
    } catch (error) {
      toast.error('Could not remove from watchlist.');
    }
  };
  
  // ... (register and updateUser functions are correct and remain the same) ...
  const register = async (userData) => { /* ... */ };
  const updateUser = (newUserData) => { /* ... */ };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    watchlist, // Export the full array
    addToWatchlist: handleAddToWatchlist,
    removeFromWatchlist: handleRemoveFromWatchlist,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};