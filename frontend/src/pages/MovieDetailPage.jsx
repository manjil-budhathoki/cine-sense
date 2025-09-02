import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieById } from '../services/api';

const MovieDetailPage = () => {
  const { movieId } = useParams(); // Gets the 'movieId' from the URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await getMovieById(movieId);
        setMovie(response.data);
      } catch (err) {
        setError('Could not fetch movie details.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [movieId]); // Refetch if the movieId changes

  if (loading) return <div className="text-center p-10">Loading movie...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!movie) return null;

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div className="container mx-auto p-4">
       <Link to={-1} className="text-indigo-400 hover:underline mb-6 block">&larr; Back</Link>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img src={imageUrl} alt={movie.title} className="rounded-lg shadow-lg w-full" />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-400 mb-4">{movie.tagline}</p>
          <div className="flex items-center mb-4">
            <span className="text-yellow-400 mr-2">⭐</span>
            <span>{movie.vote_average?.toFixed(1)} / 10</span>
            <span className="mx-4">|</span>
            <span>{movie.release_date}</span>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;