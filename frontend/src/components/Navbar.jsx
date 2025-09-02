import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="p-4 bg-gray-800 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-white">MovieRecs</Link>
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          // If user is logged in, show their name and a logout button
          <>
            <span className="text-white">Welcome, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          // If user is not logged in, show login/register links
          <>
            <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
            <Link to="/register" className="text-white hover:text-gray-300">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;