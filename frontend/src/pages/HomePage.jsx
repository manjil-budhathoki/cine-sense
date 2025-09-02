import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

// A reusable component for our mood cards
const MoodCard = ({ mood, emoji, onClick }) => (
  <div
    onClick={() => onClick(mood)}
    className="bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transform hover:scale-105 transition-transform duration-200"
  >
    <span className="text-5xl mb-4">{emoji}</span>
    <h3 className="text-xl font-semibold capitalize">{mood}</h3>
  </div>
);

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const moods = [
    { name: 'happy', emoji: '😊' },
    { name: 'sad', emoji: '😢' },
    { name: 'thrilled', emoji: '🤯' },
    { name: 'adventurous', emoji: '🚀' },
  ];

  const handleMoodSelect = (mood) => {
    // Navigate to the recommendations page with the selected mood as a query parameter
    navigate(`/recommendations?mood=${mood}`);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-2">Hello, {user?.username}!</h1>
      <p className="text-xl text-gray-400 mb-8">How are you feeling today?</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {moods.map((mood) => (
          <MoodCard
            key={mood.name}
            mood={mood.name}
            emoji={mood.emoji}
            onClick={handleMoodSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;