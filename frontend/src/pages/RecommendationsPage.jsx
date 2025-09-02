import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getRecommendations } from '../services/api';
import MovieCard from '../components/MovieCard';
import { motion, AnimatePresence } from 'framer-motion'; // For animations

// A custom hook to easily get URL query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// A simple, stylish loading spinner component
const Spinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
    <p className="ml-4 text-xl text-gray-400">Consulting the cinematic cosmos...</p>
  </div>
);

const RecommendationsPage = () => {
  const query = useQuery();
  const mood = query.get('mood');

  const [results, setResults] = useState(null); // Will hold the entire API response object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the "Load More" functionality
  const [visibleCount, setVisibleCount] = useState(10); // Show 10 movies initially

  useEffect(() => {
    // Reset state when the mood changes to show loading spinner again
    setLoading(true);
    setResults(null);
    setVisibleCount(10);

    if (mood) {
      const fetchMovies = async () => {
        try {
          const response = await getRecommendations(mood);
          setResults(response.data);
        } catch (err) {
          console.error("Failed to fetch recommendations:", err);
          setError('Oops! Couldn\'t find flicks for that vibe. Try another one.');
        } finally {
          setLoading(false);
        }
      };
      fetchMovies();
    }
  }, [mood]); // This effect re-runs whenever the 'mood' in the URL changes

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!results || !results.recommendations) return <p>No results found.</p>;

  const { detected_emotion_profile, recommendations } = results;

  // Slice the recommendations array based on the visibleCount
  const visibleMovies = recommendations.slice(0, visibleCount);

  return (
    <div className="container mx-auto">
      {/* Back Link */}
      <Link to="/" className="text-indigo-400 hover:underline mb-8 inline-block">&larr; Try a Different Mood</Link>

      {/* Header and Explanation Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <p className="text-gray-400 mb-2">You're feeling:</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-indigo-400 italic">"{results.user_mood_text}"</h1>
        
        {/* Detected Emotions - Explainability Feature */}
        <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Our AI thinks this means you want movies with a hint of...</h2>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {Object.entries(detected_emotion_profile)
              .sort(([, a], [, b]) => b - a) // Sort by score, descending
              .filter(([, score]) => score > 0.1) // Only show significant emotions
              .map(([emotion, score]) => (
                <div key={emotion} className="text-sm bg-gray-700 rounded-full px-3 py-1 capitalize">
                  {emotion}
                </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Movie Grid with Animation */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05, // Each child animates 0.05s after the previous one
            },
          },
        }}
      >
        <AnimatePresence>
          {visibleMovies.map((movie) => (
             <motion.div
              key={movie.id}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              layout // This makes the grid animate nicely when items are added/removed
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button */}
      {visibleCount < recommendations.length && (
        <div className="text-center mt-12">
          <button
            onClick={() => setVisibleCount(prevCount => prevCount + 10)}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
          >
            Load More Flicks
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;