import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMovieById, getSimilarMovies } from '../services/api';
import { useAuth } from '../hooks/AuthContext';
import { motion } from 'framer-motion';
import { Star, Clock, Calendar, Heart, ArrowLeft } from 'lucide-react';

// A smaller, reusable card for the "You Might Also Like" section
const SimilarMovieCard = ({ movie }) => {
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=N/A';
  return (
    <Link to={`/movie/${movie.id}`} className="block flex-shrink-0 w-36 md:w-40 text-center">
      <div className="rounded-lg overflow-hidden shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <img src={posterUrl} alt={movie.title} className="w-full h-auto object-cover aspect-[2/3]" />
      </div>
      <p className="mt-2 text-sm text-slate-700 font-semibold truncate" title={movie.title}>{movie.title}</p>
    </Link>
  );
};


const MovieDetailPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { watchlist, addToWatchlist, removeFromWatchlist } = useAuth();

  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- THIS IS THE FIX ---
  // Check if the current movie's ID is in the global watchlist array
  const isInWatchlist = movie ? watchlist.some(item => item.movie_id === movie.id) : false;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [movieResponse, similarResponse] = await Promise.all([
          getMovieById(movieId),
          getSimilarMovies(movieId)
        ]);
        setMovie(movieResponse.data);
        setSimilarMovies(similarResponse.data.results.slice(0, 8)); // Get top 8 similar
      } catch (err) {
        setError('Could not fetch movie details.');
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo(0, 0); // Scroll to top when the page (or movie ID) changes
    fetchAllData();
  }, [movieId]); // Re-run this effect if the movieId in the URL changes

  // This handler calls the correct function from the global context
  const handleWatchlistToggle = (e) => {
    e.preventDefault();
    if (isInWatchlist) {
      removeFromWatchlist(movie);
    } else {
      addToWatchlist({
        movie_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path || '',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-68px)]">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-cyan-500"></div>
      </div>
    );
  }

  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!movie) return null; // Don't render anything if the movie data is not available

  const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : '';
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';

  const formatRuntime = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="pb-24">
      <div className="relative w-full h-80 md:h-[50vh]">
        {backdropUrl && (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backdropUrl})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-slate-100/80 to-transparent"></div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 -mt-32 md:-mt-48 relative z-10">
        <button onClick={() => navigate(-1)} className="text-slate-700 bg-white/70 backdrop-blur-sm hover:bg-white transition-colors duration-200 mb-8 inline-flex items-center px-4 py-2 rounded-full shadow-md border border-slate-200/80">
          <ArrowLeft size={18} className="mr-2"/> Back
        </button>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <motion.div 
            className="md:w-1/3 lg:w-1/4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img src={posterUrl} alt={movie.title} className="rounded-lg shadow-2xl w-full" />
            <button 
              onClick={handleWatchlistToggle}
              className={`w-full mt-4 py-3 px-6 font-semibold rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${isInWatchlist ? 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg' : 'bg-white/80 backdrop-blur-sm hover:bg-white text-slate-800'}`}
            >
              <Heart size={20} className={`mr-3 transition-all ${isInWatchlist ? 'fill-current' : ''}`} />
              {isInWatchlist ? 'In Your Watchlist' : 'Add to Watchlist'}
            </button>
          </motion.div>

          <motion.div 
            className="md:w-2/3 lg:w-3/4 text-slate-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-2">{movie.title}</h1>
            {movie.tagline && <p className="text-slate-500 text-lg mb-6 italic">"{movie.tagline}"</p>}
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-600 mb-8">
              <span className="flex items-center"><Star size={16} className="mr-2 text-yellow-400 fill-current" /> {movie.vote_average?.toFixed(1)} / 10</span>
              <span className="flex items-center"><Calendar size={16} className="mr-2" /> {movie.release_date?.substring(0, 4)}</span>
              {movie.runtime > 0 && <span className="flex items-center"><Clock size={16} className="mr-2" /> {formatRuntime(movie.runtime)}</span>}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {movie.genres.map(genre => (
                <span key={genre.id} className="text-xs font-semibold text-slate-700 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1 border border-slate-300 transition-colors duration-200 hover:bg-white hover:border-cyan-400 cursor-pointer">
                  {genre.name}
                </span>
              ))}
            </div>

            <h2 className="text-2xl font-semibold mb-3">Overview</h2>
            <p className="text-slate-700 leading-relaxed text-base">{movie.overview}</p>
          </motion.div>
        </div>

        {similarMovies.length > 0 && (
          <div className="mt-20 pt-8 border-t border-slate-200/80">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-6 gap-y-8">
              {similarMovies.map(simMovie => (
                <SimilarMovieCard key={simMovie.id} movie={simMovie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MovieDetailPage;