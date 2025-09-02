import React from 'react';

const MovieCard = ({ movie }) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <img src={imageUrl} alt={movie.title} className="w-full h-auto" />
      <div className="p-4">
        <h3 className="font-bold text-lg">{movie.title}</h3>
        <p className="text-gray-400 text-sm mt-2 truncate">{movie.overview}</p>
      </div>
    </div>
  );
};

export default MovieCard;