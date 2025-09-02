import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { getProfile, updateProfile } from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Camera } from 'lucide-react';

// --- Default User Icon SVG Component (Styled for Light Theme) ---
const UserIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({ email: '', bio: '', favorite_genre: '' });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        setProfileData(response.data);
        setFormData({
            email: response.data.email || '',
            bio: response.data.profile.bio || '',
            favorite_genre: response.data.profile.favorite_genre || '',
        });
        setImagePreview(response.data.profile.profile_picture);
      } catch (error) {
        toast.error("Could not fetch profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Saving profile...');
    
    const submissionData = new FormData();
    submissionData.append('email', formData.email);
    submissionData.append('profile.bio', formData.bio);
    submissionData.append('profile.favorite_genre', formData.favorite_genre);
    if (profilePictureFile) {
      submissionData.append('profile.profile_picture', profilePictureFile);
    }

    try {
      const response = await updateProfile(submissionData);
      updateUser(response.data);
      setProfileData(response.data);
      setImagePreview(response.data.profile.profile_picture);
      setProfilePictureFile(null);
      toast.success('Profile updated successfully!', { id: loadingToast });
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile.', { id: loadingToast });
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      email: profileData.email || '',
      bio: profileData.profile.bio || '',
      favorite_genre: profileData.profile.favorite_genre || '',
    });
    setImagePreview(profileData.profile.profile_picture);
    setProfilePictureFile(null);
    setIsEditing(false);
  };
  
  const handleClose = () => navigate(-1);

  // Animation variants
  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { y: "-50vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { delay: 0.1, duration: 0.4, ease: "easeOut" } },
  };

  return (
    <AnimatePresence>
      {/* --- BACKDROP --- */}
      {/* The background uses the global animated gradient, but this adds a blur layer on top */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={handleClose}
      >
        {/* --- MODAL CARD --- */}
        <motion.div
          className="relative bg-white/80 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200/80 mx-4"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div className="h-96 flex items-center justify-center text-xl text-slate-500">Loading...</div>
          ) : (
            <>
              <button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition cursor-pointer" aria-label="Close profile modal">
                <X size={24} />
              </button>
              
              <div className="p-8">
                {isEditing ? (
                  /* --- EDITING FORM --- */
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold text-center text-slate-800 mb-4">Edit Your Profile</h2>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative w-32 h-32">
                        <div className="w-full h-full rounded-full bg-slate-200 overflow-hidden flex items-center justify-center ring-4 ring-white/50">
                          {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover"/> : <UserIcon className="w-20 h-20 text-slate-400" />}
                        </div>
                        <button type="button" onClick={() => fileInputRef.current.click()} className="absolute -bottom-2 -right-2 bg-cyan-500 rounded-full p-2 hover:bg-cyan-600 transition" title="Change picture">
                          <Camera className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-600 mb-1">Email</label>
                      <input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 bg-slate-100/50 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                    </div>
                    <div>
                      <label htmlFor="bio" className="block text-sm font-semibold text-slate-600 mb-1">Bio</label>
                      <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} className="w-full p-2 bg-slate-100/50 rounded border border-slate-300 h-24 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Your movie tastes..."/>
                    </div>
                    <div>
                      <label htmlFor="favorite_genre" className="block text-sm font-semibold text-slate-600 mb-1">Favorite Genre</label>
                      <input id="favorite_genre" type="text" name="favorite_genre" value={formData.favorite_genre} onChange={handleInputChange} className="w-full p-2 bg-slate-100/50 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                      <button type="button" onClick={handleCancelEdit} className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition">Cancel</button>
                      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition">Save</button>
                    </div>
                  </form>
                ) : (
                  /* --- VIEWING DISPLAY --- */
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center ring-4 ring-white/50 mx-auto">
                      {profileData.profile.profile_picture ? (
                        <img src={profileData.profile.profile_picture} alt="Profile" className="w-full h-full object-cover"/>
                      ) : (
                        <UserIcon className="w-20 h-20 text-slate-400" />
                      )}
                    </div>
                    <h1 className="text-3xl font-bold mt-4 text-slate-800">{profileData.username}</h1>
                    <p className="text-slate-500">{profileData.email || 'No email provided'}</p>
                    <button onClick={() => setIsEditing(true)} className="mt-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-4 rounded-md transition flex items-center mx-auto">
                      <Edit3 size={16} className="mr-2"/> Edit Profile
                    </button>
                    <div className="text-left mt-8 space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg text-cyan-600">Bio</h3>
                        <p className="text-slate-700 mt-1 italic">{profileData.profile.bio || 'No bio provided.'}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-cyan-600">Favorite Genre</h3>
                        <p className="text-slate-700 mt-1">{profileData.profile.favorite_genre || 'No favorite genre set.'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfilePage;