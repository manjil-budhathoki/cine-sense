import React, { useState, useEffect, useMemo } from 'react';
import { getAdminStats, getAllUsers } from '../services/api';
import { motion } from 'framer-motion';
import { Users, Heart, Crown, Search, UserPlus } from 'lucide-react';
import UserManagementModal from '../components/UserManagementModal'; // Import the modal

// Reusable Stat Card component
const StatCard = ({ title, value, icon, delay }) => (
    <motion.div 
        className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-slate-200/80 shadow-sm"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-4xl font-bold text-slate-800 mt-2">{value}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg">
                {icon}
            </div>
        </div>
    </motion.div>
);

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // State to manage the modal's visibility and which user is selected
    const [selectedUserId, setSelectedUserId] = useState(null);

    // Function to fetch all necessary data for the dashboard
    const fetchAllAdminData = async () => {
        try {
            // Fetch stats and user list in parallel for better performance
            const [statsResponse, usersResponse] = await Promise.all([
                getAdminStats(),
                getAllUsers()
            ]);
            setStats(statsResponse.data);
            setUsers(usersResponse.data);
        } catch (err) {
            setError('Could not load dashboard data. Please try again later.');
            console.error("Failed to fetch admin data", err);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchAllAdminData().finally(() => setLoading(false));
    }, []);

    // Memoized filtering for the user table to optimize performance
    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        return users.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [users, searchTerm]);
    
    // This function is passed to the modal. When the modal performs an action
    // (like deleting or updating a user), it calls this function to trigger a data refresh.
    const handleDataRefresh = () => {
        fetchAllAdminData();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-cyan-500"></div>
            </div>
        );
    }

    if (error || !stats) {
        return <div className="text-center p-10 text-red-500">{error || 'Could not load admin stats.'}</div>;
    }

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    return (
        // Use a React Fragment <> to return multiple top-level elements (the page and the modal)
        <>
            <motion.div 
              className="container mx-auto px-4 sm:px-6 py-8"
              initial="hidden" animate="visible" variants={containerVariants}
            >
                <div className="flex items-center mb-12">
                    <Crown size={32} className="text-cyan-600 mr-4"/>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800">Admin Dashboard</h1>
                </div>

                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={{hidden: {}, visible: {transition: {staggerChildren: 0.1}}}}>
                    <StatCard title="Total Users" value={stats.total_users} icon={<Users size={22} className="text-cyan-600"/>} delay={1} />
                    <StatCard title="New Users (Last 7 Days)" value={stats.new_users_last_week} icon={<UserPlus size={22} className="text-green-600"/>} delay={2} />
                    <StatCard title="Total Watchlist Items" value={stats.total_watchlist_items} icon={<Heart size={22} className="text-violet-600"/>} delay={3} />
                </motion.div>

                <motion.div 
                    className="mt-12"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                        <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search users..."
                                className="pl-10 pr-4 py-2 text-sm text-slate-900 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/80 shadow-sm overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-200/80">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600 text-sm">User</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm hidden sm:table-cell">Status</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm hidden md:table-cell">Date Joined</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-100/50 transition-colors duration-200">
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <img src={user.profile?.profile_picture || `https://ui-avatars.com/api/?name=${user.username}&background=random`} alt={user.username} className="w-10 h-10 rounded-full object-cover mr-4"/>
                                                <div>
                                                    <p className="font-semibold text-slate-800">{user.username}</p>
                                                    <p className="text-sm text-slate-500 truncate">{user.email || 'No email'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">
                                            {user.is_staff ? (
                                                <span className="px-2 py-1 font-semibold leading-tight text-cyan-700 bg-cyan-100 rounded-full">Admin</span>
                                            ) : (
                                                <span className="px-2 py-1 font-semibold leading-tight text-slate-700 bg-slate-100 rounded-full">User</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 hidden md:table-cell">
                                            {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            <button onClick={() => setSelectedUserId(user.id)} className="text-cyan-600 hover:underline text-sm font-semibold">
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>

            {/* This will render the modal only when a user ID is selected */}
            {selectedUserId && (
                <UserManagementModal 
                    userId={selectedUserId} 
                    onClose={() => setSelectedUserId(null)}
                    onUpdate={handleDataRefresh}
                />
            )}
        </>
    );
};

export default AdminDashboardPage;