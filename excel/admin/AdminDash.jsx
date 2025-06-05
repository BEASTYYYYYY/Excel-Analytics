/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Upload, Activity, Brain, FileText, Calendar, Filter, Download, MoreVertical, Eye, EyeOff, RefreshCw, Key } from 'lucide-react';
import { getAuth } from 'firebase/auth';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [unblockRequests, setUnblockRequests] = useState([]);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [userFetchError, setUserFetchError] = useState('');
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalUploads: 0
    });

    useEffect(() => {
        const fetchRequests = async () => {
            const token = await getAuth().currentUser.getIdToken();
            const res = await fetch("/unblock-requests", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setUnblockRequests(data.requests);
        };
        fetchRequests();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = await getAuth().currentUser.getIdToken();
                const res = await fetch('/api/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (!data.success) {
                    setUserFetchError(data.message);
                } else {
                    setUsers(data.users);
                }
                const profileRes = await fetch('/api/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const profileData = await profileRes.json();
                if (profileData.success) {
                    setCurrentUserRole(profileData.user.role);

                    // if (profileData.notification) {
                    //     alert(profileData.notification);
                    // }
                }
                console.log("Current role:", profileData.user.role);

                const statsRes = await fetch('/api/users/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const statsData = await statsRes.json();
                if (statsData.success) {
                    setStats(statsData.stats);
                }

            } catch (err) {
                console.error('User fetch failed:', err);
                setUserFetchError('Failed to load user data');
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const targetUid = localStorage.getItem("highlightUser");
        if (targetUid) {
            setTimeout(() => {
                const el = document.getElementById(`user-${targetUid}`);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                    el.classList.add("ring-2", "ring-blue-500");

                    setTimeout(() => {
                        el.classList.remove("ring-2", "ring-blue-500");
                    }, 3000);
                }
                localStorage.removeItem("highlightUser");
            }, 300);
        }
    }, []);


    const handleRoleChange = async (uid, newRole) => {
        try {
            const token = await getAuth().currentUser.getIdToken();
            const res = await fetch(`/api/users/${uid}/role`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });
            const data = await res.json();
            if (data.success) {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.uid === uid ? { ...user, role: newRole } : user
                    )
                );
            } else {
                alert('Failed to change role: ' + data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Server error while changing role');
        }
    };

    const handleBlockToggle = async (uid) => {
        try {
            const token = await getAuth().currentUser.getIdToken();
            const res = await fetch(`/api/users/${uid}/block`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setUsers(prev =>
                    prev.map(user =>
                        user.uid === uid ? { ...user, isActive: data.user.isActive } : user
                    )
                );
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Error blocking/unblocking user.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
                        <p className="text-blue-100 text-lg">Here's what's happening with your platform today.</p>
                    </div>
                    <div className="hidden lg:block">
                        <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                            <BarChart3 className="w-16 h-16 text-black" />
                        </div>
                    </div>
                </div>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Total Users */}
                <div className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    <div className="p-4 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 mr-4">
                        <Users></Users>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                    </div>
                </div>
                {/* Active Users */}
                <div className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    <div className="p-4 rounded-full bg-green-100 text-emerald-600 dark:bg-green-900 dark:text-emerald-300 mr-4">
                        <Brain></Brain>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</h3>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.activeUsers}</p>
                    </div>
                </div>

                {/* Total Uploads */}
                <div className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    <div className="p-4 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300 mr-4">
                        <Upload></Upload>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Uploads</h3>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.totalUploads}</p>
                    </div>
                </div>
            </div>

            {/* Registered Users Table (was: Recent Uploads) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Registered Users</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage platform users and roles</p>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Login</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user, index) => (
                                <tr id={`user-${user.uid}`} key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.name || '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize text-gray-500 dark:text-gray-400">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {user.isActive ? (
                                            <span className="text-emerald-600 font-medium">Active</span>
                                        ) : (
                                            <span className="text-gray-500">Inactive</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {currentUserRole === 'superadmin' && user.role !== 'superadmin' && (
                                            user.role === 'user' ? (
                                                <button
                                                    onClick={() => handleRoleChange(user.uid, 'admin')}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    Promote to Admin
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleRoleChange(user.uid, 'user')}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Demote to User
                                                </button>
                                            )
                                        )}
                                        {currentUserRole !== 'user' && user.role !== 'superadmin' && (
                                            <button
                                                onClick={() => handleBlockToggle(user.uid)}
                                                className={`ml-4 ${user.isActive ? 'text-red-600' : 'text-green-600'} hover:underline`}
                                            >
                                                {user.isActive ? 'Block User' : 'Unblock User'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
                            
        </div>
    );
};

export default AdminDashboard; 