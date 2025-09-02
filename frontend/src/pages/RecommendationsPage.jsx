import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getRecommendations } from '../services/api';
import MovieCard from '../components/MovieCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// A custom hook to easily get URL query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// A simple, stylish loading spinner component for the light theme
const Spinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-cyan-500"></div>
    <p className="ml-4 text-lg text-slate-500">Finding the perfect flicks...</p>
  </div>
);

const RecommendationsPage = () => {
  const query = useQuery();
  const mood = query.get('mood');

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    setLoading(true);
    setResults(null);
    setVisibleCount(10);

    if (mood) {
      const fetchMovies = async () => {
        try {
          const response = await getRecommendations(mood);
          setResults(response.data);
        } catch (err) {
          setError('Oops! Couldn\'t find flicks for that vibe. Try another one.');
        } finally {
          setLoading(false);
        }
      };
      fetchMovies();
    }
  }, [mood]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!results || !results.recommendations || results.recommendations.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-slate-700">No Movies Found</h2>
        <p className="text-slate-500 mt-2">Our AI couldn't find a match for that mood. Try being more specific!</p>
        <Link to="/" className="mt-6 inline-block px-6 py-2 font-semibold text-white bg-slate-800 rounded-full hover:bg-slate-900">
          Try Again
        </Link>
      </div>
    );
  }

  const { detected_emotion_profile, recommendations } = results;
  const visibleMovies = recommendations.slice(0, visibleCount);

  // Get the top 3 emotions for a quick summary
  const topEmotions = Object.entries(detected_emotion_profile)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(e => e[0]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <Link to="/" className="text-slate-600 hover:text-cyan-600 transition-colors duration-200 mb-8 inline-flex items-center">
        <ArrowLeft size={18} className="mr-2"/> Back & Try a Different Mood
      </Link>

      {/* --- Header Section --- */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12">
        {/* --- Left Side: Title --- */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-slate-500">Based on your mood...</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight mt-2">
            "{results.user_mood_text}"
          </h1>
          <p className="mt-4 text-slate-600">
            We found these movies with vibes of <span className="font-semibold text-cyan-600">{topEmotions.join(', ')}</span>, and more.
          </p>
        </motion.div>

        {/* --- Right Side: AI Analysis Card --- */}
        <motion.div 
          className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-slate-200/80"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-bold text-slate-700 mb-3">AI Emotion Analysis</h2>
          <div className="space-y-2">
            {Object.entries(detected_emotion_profile).sort(([,a],[,b]) => b-a).map(([emotion, score]) => (
              <div key={emotion} className="w-full">
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize font-medium text-slate-600">{emotion}</span>
                  <span className="text-slate-500">{(score * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-200/70 rounded-full h-2">
                  <motion.div 
                    className="bg-cyan-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${score * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* --- Movie Grid --- */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        <AnimatePresence>
          {visibleMovies.map((movie) => (
             <motion.div
              key={movie.id}
              variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
              exit={{ opacity: 0, scale: 0.8 }}
              layout
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* --- Load More Button --- */}
      {visibleCount < recommendations.length && (
        <div className="text-center mt-12">
          <button
            onClick={() => setVisibleCount(prevCount => prevCount + 10)}
            className="px-8 py-3 bg-slate-800 text-white font-semibold rounded-full hover:bg-slate-900 transition-all duration-200 transform hover:scale-105"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;