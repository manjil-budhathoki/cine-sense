import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import toast from 'react-hot-toast';
import { LogOut, User, ListVideo, Film, ShieldCheck } from 'lucide-react'; // ShieldCheck icon for Admin

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Logic to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You've been logged out!");
      setIsDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  const handleLinkClick = () => setIsDropdownOpen(false);

  // Styles for active NavLink
  const activeLinkStyle = {
    color: '#0e7490', // A darker cyan for active state
    backgroundColor: 'rgba(226, 232, 240, 0.5)', // bg-slate-200 with opacity
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        
        {/* Logo / Home Link */}
        <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-slate-800 tracking-wider">
          <Film className="w-7 h-7 text-cyan-600" />
          <span className="text-cyan-600">Flick</span>Finder
        </NavLink>

        {/* Center Navigation (Visible only when logged in on medium screens and up) */}
        {isAuthenticated && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-6">
            <NavLink 
              to="/watchlist" 
              className="text-slate-600 font-medium hover:text-cyan-600 transition-colors duration-200"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
            >
              My Watchlist
            </NavLink>
            {/* NEW: Admin link in the center for desktop */}
            {user?.is_staff && (
                <NavLink 
                    to="/admin/dashboard"
                    className="text-slate-600 font-medium hover:text-cyan-600 transition-colors duration-200 flex items-center"
                    style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                >
                    <ShieldCheck size={16} className="mr-1.5"/> Admin
                </NavLink>
            )}
          </div>
        )}

        {/* Profile Icon & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className="w-11 h-11 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center ring-2 ring-slate-300/70 hover:ring-cyan-400 focus:outline-none focus:ring-cyan-400 transition-all duration-300 group"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <span className="absolute inset-0 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></span>
            {isAuthenticated && user?.profile?.profile_picture ? (
              <img src={user.profile.profile_picture} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute top-14 right-0 w-60 bg-white/80 backdrop-blur-md rounded-lg shadow-2xl border border-slate-200/80 overflow-hidden animate-fade-in-down">
              {isAuthenticated ? (
                // Authenticated User Menu
                <div>
                  <div className="px-4 py-3 border-b border-slate-200">
                    <p className="text-sm text-slate-500">Signed in as</p>
                    <p className="font-semibold text-slate-800 truncate">{user?.username}</p>
                  </div>
                  <div className="py-1">
                    <NavLink to="/profile" onClick={handleLinkClick} className="flex items-center w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-200/50 hover:text-cyan-600 transition-colors duration-150">
                      <User className="w-4 h-4 mr-3" /> My Profile
                    </NavLink>
                    {/* Watchlist link for mobile */}
                    <NavLink to="/watchlist" onClick={handleLinkClick} className="flex items-center w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-200/50 hover:text-cyan-600 transition-colors duration-150 md:hidden">
                      <ListVideo className="w-4 h-4 mr-3" /> My Watchlist
                    </NavLink>
                    {/* Admin link for mobile */}
                    {user?.is_staff && (
                        <NavLink to="/admin/dashboard" onClick={handleLinkClick} className="flex items-center w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-200/50 hover:text-cyan-600 transition-colors duration-150 md:hidden">
                            <ShieldCheck className="w-4 h-4 mr-3"/> Admin
                        </NavLink>
                    )}
                  </div>
                  <div className="py-1 border-t border-slate-200">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-200/50 hover:text-cyan-600 transition-colors duration-150">
                      <LogOut className="w-4 h-4 mr-3" /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                // Public (Logged Out) Menu
                <div className="py-1">
                  <NavLink to="/login" onClick={handleLinkClick} className="block w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-200/50 hover:text-cyan-600 transition-colors duration-150">
                    Login
                  </NavLink>
                  <NavLink to="/register" onClick={handleLinkClick} className="block w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-200/50 hover:text-cyan-600 transition-colors duration-150">
                    Register
                  </NavLink>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;