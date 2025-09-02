import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../services/api';

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // To handle initial auth check

  useEffect(() => {
    // Check if the user is already logged in when the app loads
    const checkAuthStatus = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

 // src/hooks/AuthContext.jsx

// ... inside the AuthProvider component ...

const login = async (credentials) => {
  try {
    console.log("1. Attempting to log in with:", credentials);

    const loginResponse = await loginUser(credentials);
    console.log("2. Login API call successful. Response:", loginResponse);

    console.log("3. Attempting to fetch current user data...");
    const userResponse = await getCurrentUser();
    console.log("4. Fetched user data successfully. Response:", userResponse);

    setUser(userResponse.data);
    setIsAuthenticated(true);
  } catch (error) {
    console.error("--- LOGIN FLOW FAILED ---");
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error request:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
    }
    // Re-throw the error so the component can handle it (e.g., show a message)
    throw error;
  }
};

  const register = async (userData) => {
    // Registration doesn't automatically log the user in,
    // so we don't need to set the user state here.
    return await registerUser(userData);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  // The value provided to the consuming components
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook for easy consumption of the context
export const useAuth = () => {
  return useContext(AuthContext);
};