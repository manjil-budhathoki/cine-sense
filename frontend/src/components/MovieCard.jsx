import React from 'react';
import { Link } from 'react-router-dom';
import { addToWatchlist, removeFromWatchlist } from '../services/api';
import toast from 'react-hot-toast';

const MovieCard = ({ movie, onRemove }) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  // --- HANDLER TO ADD A MOVIE TO THE WATCHLIST ---
  const handleAddToWatchlist = async (e) => {
    // Prevent the click from navigating to the movie detail page
    e.preventDefault();
    e.stopPropagation();

    const movieData = {
      movie_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path || '',
    };

    try {
      await addToWatchlist(movieData);
      toast.success(`${movie.title} added to your watchlist!`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(`${movie.title} is already in your watchlist.`);
      } else {
        toast.error('Could not add to watchlist.');
        console.error("Failed to add to watchlist", error);
      }
    }
  };

  // --- HANDLER TO REMOVE A MOVIE FROM THE WATCHLIST ---
  const handleRemoveFromWatchlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await removeFromWatchlist(movie.id);
      toast.success(`${movie.title} removed from your watchlist.`);
      // Call the function passed down from the parent (WatchlistPage)
      // to update the UI instantly.
      if (onRemove) {
        onRemove(movie.id);
      }
    } catch (error) {
      toast.error('Could not remove from watchlist.');
      console.error("Failed to remove from watchlist", error);
    }
  };

  return (
    // 'group' class enables the hover effect for the button inside
    <div className="relative group">
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="bg-gray-800 rounded-lg overflow-hidden transform transition-transform duration-300 group-hover:scale-105 shadow-lg">
          <img src={imageUrl} alt={movie.title} className="w-full h-auto object-cover aspect-[2/3]" />
          <div className="p-3">
            <h3 className="font-bold text-base truncate text-white" title={movie.title}>
              {movie.title}
            </h3>
          </div>
        </div>
      </Link>
      
      {/* 
        This is a conditional render. 
        If the 'onRemove' prop is provided, it shows the 'Remove' button.
        Otherwise, it shows the 'Add' button.
      */}
      {onRemove ? (
        // --- REMOVE BUTTON ---
        <button
          onClick={handleRemoveFromWatchlist}
          className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 focus:outline-none"
          title="Remove from Watchlist"
        >
          {/* Minus Icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      ) : (
        // --- ADD BUTTON ---
        <button
          onClick={handleAddToWatchlist}
          className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-indigo-600 focus:outline-none"
          title="Add to Watchlist"
        >
          {/* Plus Icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default MovieCard;