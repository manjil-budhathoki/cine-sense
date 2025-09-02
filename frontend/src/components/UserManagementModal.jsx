import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Trash2 } from 'lucide-react';
import { getUserById, updateUserAsAdmin, deleteUserAsAdmin } from '../services/api';
import toast from 'react-hot-toast'; // Make sure toast is imported

const UserManagementModal = ({ userId, onClose, onUpdate }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          const response = await getUserById(userId);
          setUserData(response.data);
        } catch (error) {
          toast.error("Failed to fetch user details.");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserData();
    }
  }, [userId]);

  // --- HANDLER WITH TOAST NOTIFICATIONS ---
  const handleRoleChange = async () => {
    const newIsStaff = !userData.is_staff;
    const actionText = newIsStaff ? 'Granting admin role...' : 'Revoking admin role...';
    
    // 1. Show a loading toast
    const loadingToast = toast.loading(actionText);

    try {
      // 2. Make the API call
      await updateUserAsAdmin(userId, { is_staff: newIsStaff });
      
      // 3. On success, update the toast and the local state
      toast.success('User role updated!', { id: loadingToast });
      setUserData(prev => ({...prev, is_staff: newIsStaff}));
      onUpdate(); // Tell the parent dashboard to refetch the user list
    } catch (error) {
      // 4. On failure, update the toast with an error message
      toast.error('Failed to update role.', { id: loadingToast });
    }
  };

  // --- HANDLER WITH TOAST NOTIFICATIONS ---
  const handleDeleteUser = async () => {
    // A browser confirm dialog for safety
    if (window.confirm(`Are you sure you want to delete user "${userData.username}"? This action cannot be undone.`)) {
      
      // 1. Show a loading toast
      const loadingToast = toast.loading('Deleting user...');
      
      try {
        // 2. Make the API call
        await deleteUserAsAdmin(userId);

        // 3. On success, show success toast, then refetch data and close modal
        toast.success('User deleted successfully.', { id: loadingToast });
        onUpdate(); 
        onClose();
      } catch (error) {
        // 4. On failure, show an error toast
        toast.error('Failed to delete user.', { id: loadingToast });
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative bg-white/80 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200/80 mx-4"
          initial={{ y: "-50vh", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-50vh", opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition cursor-pointer">
            <X size={24} />
          </button>
          
          <div className="p-8">
            {isLoading ? <p className="text-center py-20 text-slate-500">Loading user details...</p> : userData && (
              <div>
                <div className="flex items-center space-x-6 pb-6 border-b border-slate-200">
                    <img src={userData.profile?.profile_picture || `https://ui-avatars.com/api/?name=${userData.username}`} alt={userData.username} className="w-20 h-20 rounded-full object-cover"/>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{userData.username}</h2>
                        <p className="text-slate-500">{userData.email || 'No email'}</p>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <h3 className="font-bold text-slate-700">Admin Actions</h3>
                    <div className="flex items-center justify-between p-4 bg-slate-100/70 rounded-lg">
                        <div>
                            <p className="font-semibold text-slate-800">Admin Role</p>
                            <p className="text-sm text-slate-500">{userData.is_staff ? "This user has admin privileges." : "This is a regular user."}</p>
                        </div>
                        <button onClick={handleRoleChange} className={`px-4 py-2 text-sm font-semibold rounded-md transition ${userData.is_staff ? 'bg-amber-200 text-amber-800 hover:bg-amber-300' : 'bg-cyan-200 text-cyan-800 hover:bg-cyan-300'}`}>
                            {userData.is_staff ? 'Revoke Admin' : 'Make Admin'}
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-100/70 rounded-lg">
                        <div>
                            <p className="font-semibold text-red-800">Delete User</p>
                            <p className="text-sm text-red-600">This action is permanent and cannot be undone.</p>
                        </div>
                        <button onClick={handleDeleteUser} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition flex items-center">
                            <Trash2 size={16} className="mr-2"/> Delete User
                        </button>
                    </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserManagementModal;