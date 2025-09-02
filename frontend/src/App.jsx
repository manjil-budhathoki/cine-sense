import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Import Toaster for notifications

// Core Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecommendationsPage from './pages/RecommendationsPage';
import MovieDetailPage from './pages/MovieDetailPage'; // <-- New import
import WatchlistPage from './pages/WatchlistPage';     // <-- New import

function App() {
  return (
    // The main container for the entire application
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      
      {/* 
        The Toaster component is from react-hot-toast. 
        It allows any component in your app to show pop-up notifications.
        We place it here at the top level.
      */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#334155', // bg-slate-700
            color: '#ffffff',
          },
        }}
      />
      
      {/* The Navbar will be visible on all pages */}
      <Navbar />

      {/* The main content area where pages will be rendered */}
      <main className="p-4 md:p-8">
        <Routes>
          {/* --- Public Routes --- */}
          {/* These routes are accessible to everyone, logged in or not. */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* --- Protected Routes --- */}
          {/* 
            These routes are wrapped with our ProtectedRoute component.
            If a user is not logged in, they will be redirected to /login.
          */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <RecommendationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchlist" // <-- New route for the watchlist page
            element={
              <ProtectedRoute>
                <WatchlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movie/:movieId" // <-- New route for a single movie's detail page
            element={
              <ProtectedRoute>
                <MovieDetailPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;