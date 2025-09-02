import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getRecommendations } from '../services/api'; // Make sure this is exported from api.js
import MovieCard from '../components/MovieCard';

// A custom hook to easily get URL query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const RecommendationsPage = () => {
  const query = useQuery();
  const mood = query.get('mood'); // Extracts 'happy' from '?mood=happy'

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mood) {
      const fetchMovies = async () => {
        try {
          setLoading(true);
          const response = await getRecommendations(mood);
          setMovies(response.data);
        } catch (err) {
          setError('Failed to fetch recommendations.');
        } finally {
          setLoading(false);
        }
      };
      fetchMovies();
    }
  }, [mood]); // This effect re-runs whenever the 'mood' changes

  if (loading) return <p>Finding movies for your mood...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto">
      <Link to="/" className="text-indigo-400 hover:underline mb-6 block">&larr; Back to Moods</Link>
      <h1 className="text-4xl font-bold mb-8">
        Movies for a <span className="capitalize text-indigo-400">{mood}</span> mood
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPage;