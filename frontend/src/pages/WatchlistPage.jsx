import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext'; // Import the context
import MovieCard from '../components/MovieCard';
import { motion } from 'framer-motion';
import { Film } from 'lucide-react';

const WatchlistPage = () => {
  // --- KEY LOGIC CHANGE ---
  // Get the global watchlist array and the global loading state directly from the context.
  // There is no need for local useState or useEffect for data fetching anymore.
  const { watchlist, loading } = useAuth();

  // Show a loading state that is consistent with the global app loading
  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8">My Watchlist</h1>
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-cyan-500"></div>
        </div>
      </div>
    );
  }
  
  // Animation variants for the container and grid items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div 
      className="container mx-auto px-4 sm:px-6 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 
        className="text-4xl md:text-5xl font-bold text-slate-800 mb-12"
        variants={itemVariants}
      >
        My Watchlist
      </motion.h1>
      
      {watchlist.length > 0 ? (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8"
          variants={containerVariants}
        >
          {watchlist.map(item => (
            <motion.div
              key={item.movie_id}
              variants={itemVariants}
              layout // This animates the grid when an item is removed
              exit={{ opacity: 0, scale: 0.8 }} // Animate item removal
            >
              {/* 
                The MovieCard now handles its own remove logic internally by calling the context.
                We just need to pass it the correct movie data.
                We map 'movie_id' to 'id' to keep the MovieCard's prop consistent.
              */}
              <MovieCard 
                movie={{ ...item, id: item.movie_id }} 
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // "Empty State" - shown when the watchlist array is empty
        <motion.div 
          className="text-center py-20 px-6 bg-slate-100/50 rounded-xl border-2 border-dashed border-slate-300"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Film size={48} className="mx-auto text-slate-400 mb-4" />
          <h2 className="text-2xl font-semibold text-slate-700">Your watchlist is a blank canvas!</h2>
          <p className="text-slate-500 mt-2">Go find some movies you're in the mood for.</p>
          <Link 
            to="/" 
            className="mt-6 inline-block px-6 py-2 font-semibold text-white bg-slate-800 rounded-full hover:bg-slate-900"
          >
            Find Flicks
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WatchlistPage;