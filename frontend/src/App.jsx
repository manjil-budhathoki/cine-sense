import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Core Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute'; // Make sure this is imported

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecommendationsPage from './pages/RecommendationsPage';
import MovieDetailPage from './pages/MovieDetailPage';
import WatchlistPage from './pages/WatchlistPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <div className="relative min-h-screen font-sans">
      
      <div className="animated-background-light"></div>

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#ffffff',
          },
        }}
      />
      
      <Navbar />

      <main>
        <Routes>
          {/* --- Public Routes --- */}
          {/* These are accessible to anyone, logged in or not. */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* --- Regular User Protected Routes --- */}
          {/* These require a user to be logged in. */}
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
          <Route path="/watchlist" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
          <Route path="/movie/:movieId" element={<ProtectedRoute><MovieDetailPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          
          {/* --- Admin Protected Route --- */}
          {/* 
            This route is double-protected.
            1. <ProtectedRoute> ensures the user is logged in.
            2. <AdminRoute> ensures the logged-in user is a staff member.
            This resolves the race condition and prevents the blank page.
          */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;