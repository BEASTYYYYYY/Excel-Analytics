import React, { useState } from 'react';
import { BarChart3, Users, Upload, Activity, Brain, FileText, Calendar, Filter, Download, MoreVertical, Eye, EyeOff, RefreshCw, Key } from 'lucide-react';

const AdminDashboard = () => {
    const [showAdminKey, setShowAdminKey] = useState(false);

    const totalUploads = 1500;
    const activeUsers = 120;
    const insightsRequested = 300;
    const failedRequests = 5;
    const adminKey = 'abc123xyz789';

    const uploads = [
        { user: 'alice@example.com', filename: 'report1.xlsx', date: '2025-05-20', size: '2.4 MB', status: 'success' },
        { user: 'bob@example.com', filename: 'data.csv', date: '2025-05-21', size: '1.8 MB', status: 'success' },
        { user: 'charlie@example.com', filename: 'analysis.xlsx', date: '2025-05-22', size: '3.2 MB', status: 'processing' },
        { user: 'diana@example.com', filename: 'metrics.csv', date: '2025-05-22', size: '1.1 MB', status: 'failed' },
    ];

    const stats = [
        {
            title: 'Total Uploads',
            value: totalUploads.toLocaleString(),
            change: '+12%',
            icon: Upload,
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
            trend: 'up'
        },
        {
            title: 'Active Users',
            value: activeUsers.toLocaleString(),
            change: '+8%',
            icon: Users,
            color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            trend: 'up'
        },
        {
            title: 'AI Insights',
            value: insightsRequested.toLocaleString(),
            change: '+24%',
            icon: Brain,
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
            trend: 'up'
        },
        {
            title: 'Failed Requests',
            value: failedRequests.toLocaleString(),
            change: '-15%',
            icon: Activity,
            color: 'bg-gradient-to-br from-red-500 to-red-600',
            trend: 'down'
        },
    ];

    const handleRegenerate = () => {
        alert('Admin key regenerated!');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
            case 'processing': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
            case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
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
                            <BarChart3 className="w-16 h-16 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className={`text-sm font-medium px-2 py-1 rounded-full ${stat.trend === 'up'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                }`}>
                                {stat.change}
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Uploads Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Uploads</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Latest file uploads and their status</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <Filter className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <Download className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">File</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {uploads.map((upload, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">{upload.user.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{upload.user}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FileText className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-900 dark:text-white">{upload.filename}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {upload.size}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {upload.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(upload.status)}`}>
                                            {upload.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                                            <MoreVertical className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Admin Key Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                            <Key className="w-5 h-5 mr-2 text-blue-500" />
                            Admin API Key
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your administrative access key</p>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="font-mono text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border">
                                {showAdminKey ? adminKey : '••••••••••••••••'}
                            </div>
                            <button
                                onClick={() => setShowAdminKey(!showAdminKey)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                {showAdminKey ? (
                                    <EyeOff className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <Eye className="w-4 h-4 text-gray-500" />
                                )}
                            </button>
                        </div>
                        <button
                            onClick={handleRegenerate}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Regenerate</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 