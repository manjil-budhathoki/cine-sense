import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // We show a loading message while the initial auth check is happening.
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // If the auth check is done and the user is not authenticated, redirect.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the child component.
  return children;
};

export default ProtectedRoute;