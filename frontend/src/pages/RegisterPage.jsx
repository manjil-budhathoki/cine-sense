import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Lock, ArrowRight, Mail } from 'lucide-react'; // Mail icon can be used if you add an email field

// Reusable Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.596 44 30.032 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Creating your account...');

    try {
      await register({ username, password });
      toast.success('Account created! Please log in.', { id: loadingToast });
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.username?.[0] || 'Registration failed. Please try again.';
      toast.error(errorMsg, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.error("Google Sign-Up is not implemented yet!");
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <motion.div 
        className="relative bg-white/70 backdrop-blur-sm w-full max-w-md p-8 md:p-10 rounded-2xl shadow-lg border border-slate-200/80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Create an Account</h1>
          <p className="text-slate-500 mt-2">Join FlickFinder to get personalized recommendations.</p>
        </div>
        
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 font-semibold text-slate-700 bg-white rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all cursor-pointer"
        >
          <GoogleIcon />
          Sign up with Google
        </button>
        
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-slate-300"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-sm uppercase">Or</span>
          <div className="flex-grow border-t border-slate-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute top-1/2 left-4 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a Username"
              className="w-full pl-12 pr-4 py-3 text-slate-900 bg-slate-100/50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
              autoComplete="username"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute top-1/2 left-4 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a Password"
              className="w-full pl-12 pr-4 py-3 text-slate-900 bg-slate-100/50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
              autoComplete="new-password"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Register'}
              {!loading && <ArrowRight size={18} className="ml-2" />}
            </button>
          </div>
          
          <p className="text-sm text-center text-slate-500 pt-4">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-cyan-600 hover:text-cyan-700 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;