import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import toast from 'react-hot-toast'; // Import toast for logout notification

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You've been logged out!");
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };
  
  // Custom style for active NavLink
  const activeLinkStyle = {
    color: '#818cf8', // indigo-400
    textDecoration: 'underline',
  };

  return (
    // Sticky position to keep it at the top, with backdrop blur for a modern look
    <header className="sticky top-0 z-50 w-full bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        
        {/* Logo / Home Link */}
        <Link to="/" className="text-2xl font-bold text-white tracking-wider">
          <span className="text-indigo-400">Flick</span>Finder
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            // --- Authenticated User Links ---
            <>
              {/* Using NavLink to style the active link */}
              <NavLink 
                to="/watchlist" 
                className="text-gray-300 hover:text-indigo-400 transition-colors duration-200"
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              >
                My Watchlist
              </NavLink>

              <div className="flex items-center space-x-3">
                <span className="text-gray-400 hidden sm:inline">Welcome, {user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            // --- Public Links ---
            <>
              <NavLink 
                to="/login" 
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              >
                Login
              </NavLink>
              <NavLink 
                to="/register" 
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors duration-200"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;