import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State to hold the user's typed mood
  const [moodText, setMoodText] = useState('');

  const handleMoodSubmit = (e) => {
    // Prevent the form from doing a full page reload
    e.preventDefault(); 

    if (moodText.trim()) {
      // Navigate to the recommendations page, making sure to encode the user's text
      // so spaces and special characters are handled correctly in the URL.
      navigate(`/recommendations?mood=${encodeURIComponent(moodText.trim())}`);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center text-center h-[70vh]">
      
      {/* Sassy Welcome Message */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Alright, <span className="text-indigo-400">{user?.username}</span>. Spill the tea.
      </h1>
      <p className="text-xl text-gray-400 mb-10">
        What's the vibe today? Don't be shy.
      </p>

      {/* Mood Input Form */}
      <form onSubmit={handleMoodSubmit} className="w-full max-w-lg">
        <div className="relative">
          <input
            type="text"
            value={moodText}
            onChange={(e) => setMoodText(e.target.value)}
            placeholder="e.g., 'something to watch after a long day' or 'epic space battle!'"
            className="w-full px-6 py-4 text-lg text-white bg-gray-800 border-2 border-gray-700 rounded-full focus:outline-none focus:border-indigo-500 transition-colors duration-200"
            autoFocus // Automatically focus the input field when the page loads
          />
          <button
            type="submit"
            className="absolute top-0 right-0 mt-2 mr-2 px-6 py-2 font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none transition-colors duration-200"
          >
            Find Flicks
          </button>
        </div>
      </form>
      
      <p className="mt-6 text-sm text-gray-500">
        The more you tell me, the better the recommendations. Try things like "a sad movie that will make me cry" or "a funny action movie".
      </p>

    </div>
  );
};

export default HomePage;