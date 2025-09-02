import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext'; // Import our powerful context
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const MovieCard = ({ movie }) => {
  // Get everything we need from the global AuthContext
  const { watchlist, addToWatchlist, removeFromWatchlist } = useAuth();
  
  // --- KEY LOGIC CHANGE ---
  // We now check if an ITEM with this movie's ID exists in the watchlist ARRAY.
  // This is how the card knows whether to show a filled or empty heart.
  const isInWatchlist = watchlist.some(item => item.movie_id === movie.id);

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  // This single handler now toggles the watchlist status by calling the appropriate context function.
  const handleWatchlistToggle = (e) => {
    e.preventDefault(); // Stop the Link navigation
    e.stopPropagation();

    if (isInWatchlist) {
      // Pass the full movie object so the context has the title for the toast notification
      removeFromWatchlist(movie); 
    } else {
      // Pass the data required by the backend API
      addToWatchlist({
        movie_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path || '',
      });
    }
  };

  return (
    <motion.div 
      className="relative group text-slate-800"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-slate-200/80 h-full flex flex-col">
          <img 
            src={imageUrl} 
            alt={movie.title} 
            className="w-full h-auto object-cover aspect-[2/3]" 
          />
          <div className="p-3 mt-auto">
            <h3 className="font-bold text-base truncate" title={movie.title}>
              {movie.title}
            </h3>
          </div>
        </div>
      </Link>
      
      {/* The button's appearance is driven by the 'isInWatchlist' boolean */}
      <button
        onClick={handleWatchlistToggle}
        className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm rounded-full p-2 text-white transition-all duration-300 transform scale-0 group-hover:scale-100 hover:!scale-110"
        title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
      >
        <Heart 
          size={20} 
          // The fill and color change instantly when 'isInWatchlist' changes
          className={`transition-colors duration-300 ${isInWatchlist ? 'text-cyan-400 fill-current' : 'text-white'}`} 
        />
      </button>
    </motion.div>
  );
};

export default MovieCard;