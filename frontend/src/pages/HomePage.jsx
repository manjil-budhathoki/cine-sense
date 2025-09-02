import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { motion } from 'framer-motion';
import { Wand2 } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [moodText, setMoodText] = useState('');

  // --- NEW: Effect to control page scrolling ---
  useEffect(() => {
    // When this component mounts (appears on screen), add 'overflow-hidden' to the body
    document.body.classList.add('overflow-hidden');

    // When the component unmounts (user navigates away), remove the class
    // This is the "cleanup" function.
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount and cleanup on unmount

  const handleMoodSubmit = (e) => {
    e.preventDefault();
    if (moodText.trim()) {
      navigate(`/recommendations?mood=${encodeURIComponent(moodText.trim())}`);
    }
  };

  const handleIdeaStarterClick = (text) => {
    setMoodText(text);
    navigate(`/recommendations?mood=${encodeURIComponent(text)}`);
  };

  const ideaStarters = [
    'A mind-bending thriller',
    'A feel-good comedy',
    'An epic sci-fi adventure',
    'A heartbreaking romance'
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    // --- KEY CHANGE ---
    // This container now takes up the full screen height minus the navbar height.
    // It uses flex to perfectly center its content.
    <div className="h-[calc(100vh-68px)] w-full flex items-center justify-center">
      
      <motion.div 
        className="relative z-10 container mx-auto flex flex-col items-center justify-center text-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        <motion.h1 
          className="text-4xl md:text-6xl font-black text-slate-800 mb-3 leading-tight"
          variants={itemVariants}
        >
          Hey, <span className="text-cyan-600">{user?.username}</span>.
          <br />
          What's the mood?
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl"
          variants={itemVariants}
        >
          Describe the kind of movie you want to see, and let the magic happen.
        </motion.p>

        <motion.form 
          onSubmit={handleMoodSubmit} 
          className="w-full max-w-xl"
          variants={itemVariants}
        >
          <div className="relative">
            <input
              type="text"
              value={moodText}
              onChange={(e) => setMoodText(e.target.value)}
              placeholder="e.g., 'a stylish heist movie with a clever twist'"
              className="w-full pl-6 pr-28 py-4 text-base text-slate-900 bg-white/60 backdrop-blur-sm border-2 border-slate-300/70 rounded-full focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/50 transition-all duration-300 placeholder-slate-500"
              autoFocus
            />
            <button
              type="submit"
              className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center justify-center h-11 px-6 font-semibold text-white bg-slate-800 rounded-full hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all duration-300 disabled:opacity-50 disabled:bg-slate-600 disabled:cursor-not-allowed"
              disabled={!moodText.trim()}
              aria-label="Find Movies"
            >
              Find
              <Wand2 size={16} className="ml-2" />
            </button>
          </div>
        </motion.form>

        <motion.div 
          className="mt-12"
          variants={itemVariants}
        >
          <p className="text-slate-600 mb-4">Or try one of these ideas:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {ideaStarters.map(idea => (
              <button 
                key={idea}
                onClick={() => handleIdeaStarterClick(idea)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white/60 backdrop-blur-sm rounded-full border border-slate-300 hover:bg-white hover:border-cyan-400 hover:text-cyan-600 transition-all duration-200 transform hover:scale-105"
              >
                {idea}
              </button>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default HomePage;