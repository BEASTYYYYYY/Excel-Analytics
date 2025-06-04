import React, { useEffect, useState } from 'react';
import { Upload, Users } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import moment from 'moment';

const UploadStats = () => {
    const [totalUploads, setTotalUploads] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentUploads, setRecentUploads] = useState([]);
    const [uploadTrends, setUploadTrends] = useState([]);

    useEffect(() => {
        const fetchStatsAndActivity = async () => {
            try {
                const token = await getAuth().currentUser.getIdToken();

                // Fetch upload stats
                const statsRes = await fetch('/api/users/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const statsData = await statsRes.json();
                if (statsData.success) {
                    setTotalUploads(statsData.stats.totalUploads);
                    setActiveUsers(statsData.stats.activeUsers);
                }

                // Fetch recent activity
                const recentRes = await fetch('/api/users/recent-activities', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const recentData = await recentRes.json();
                if (recentData.success) {
                    setRecentUsers(recentData.recentUsers || []);
                    setRecentUploads(recentData.recentUploads || []);

                    // Prepare trend data (last 7 days)
                    const today = moment().startOf('day');
                    const trend = Array.from({ length: 7 }, (_, i) => {
                        const date = today.clone().subtract(i, 'days');
                        const count = recentData.recentUploads.filter(upload =>
                            moment(upload.createdAt).isSame(date, 'day')
                        ).length;
                        return { day: date.format('ddd'), count };
                    }).reverse();
                    setUploadTrends(trend);
                }
            } catch (err) {
                console.error('Error fetching stats/activity:', err);
            }
        };

        fetchStatsAndActivity();
    }, []);

    const stats = [
        {
            title: 'Total Uploads',
            value: totalUploads,
            icon: Upload,
            color: 'bg-gradient-to-br from-blue-500 to-blue-600'
        },
        {
            title: 'Active Users',
            value: activeUsers,
            icon: Users,
            color: 'bg-gradient-to-br from-emerald-500 to-emerald-600'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Statistics</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of file upload metrics and activity</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Upload Trends */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Trends (Last 7 Days)</h3>
                    <div className="space-y-4">
                        {uploadTrends.map((entry, i) => (
                            <div className="flex items-center justify-between" key={i}>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{entry.day}</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${Math.min(100, entry.count * 15)}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{entry.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {recentUsers.slice(0, 2).map((user, i) => (
                            <div key={`user-${i}`} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 dark:text-white">New user registration</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{moment(user.createdAt).fromNow()}</p>
                                </div>
                            </div>
                        ))}
                        {recentUploads.slice(0, 2).map((upload, i) => (
                            <div key={`upload-${i}`} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 dark:text-white">File uploaded</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{moment(upload.createdAt).fromNow()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadStats;
