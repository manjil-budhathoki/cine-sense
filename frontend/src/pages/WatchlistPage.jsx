import React, { useState, useEffect } from 'react';
import { getWatchlist } from '../services/api';
import MovieCard from '../components/MovieCard';
import { motion } from 'framer-motion';

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the initial watchlist when the component mounts
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const response = await getWatchlist();
        // The API returns 'movie_id', but our MovieCard expects 'id'.
        // We adapt the data here to make the component reusable.
        const adaptedWatchlist = response.data.map(item => ({ ...item, id: item.movie_id }));
        setWatchlist(adaptedWatchlist);
      } catch (error) {
        console.error("Failed to fetch watchlist", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []); // The empty array ensures this runs only once on mount

  // This function will be passed down to the MovieCard.
  // When a movie is removed, the card calls this function to update the list in this component's state.
  const handleRemoveFromState = (movieIdToRemove) => {
    setWatchlist(currentWatchlist => 
      currentWatchlist.filter(movie => movie.id !== movieIdToRemove)
    );
  };
  
  if (loading) {
    return <div className="text-center p-10">Loading your watchlist...</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8">My Watchlist</h1>
      
      {watchlist.length > 0 ? (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.05 },
            },
          }}
        >
          {watchlist.map(movie => (
            <motion.div
              key={movie.id}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
              layout // Animate position changes when an item is removed
            >
              <MovieCard 
                movie={movie} 
                onRemove={handleRemoveFromState} // Pass the handler as a prop
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 px-6 bg-gray-800/50 rounded-lg">
          <p className="text-2xl font-semibold text-gray-300">Your watchlist is a blank canvas!</p>
          <p className="text-gray-400 mt-2">Go find some movies you're in the mood for.</p>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;