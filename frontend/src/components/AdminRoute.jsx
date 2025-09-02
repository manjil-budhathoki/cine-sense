// frontend/src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

// Change the component to accept 'children' as a prop
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-10">Verifying permissions...</div>;
  }

  // The logic remains the same: check for auth and staff status
  if (isAuthenticated && user?.is_staff) {
    return children; // If admin, render the actual page component
  }

  // If not an admin, redirect to the homepage
  return <Navigate to="/" replace />;
};

export default AdminRoute;