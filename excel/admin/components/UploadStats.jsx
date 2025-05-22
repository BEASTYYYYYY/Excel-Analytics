import React from 'react';
import { Upload, Users, TrendingUp, Activity } from 'lucide-react';

const UploadStats = ({ totalUploads, activeUsers }) => {
    const stats = [
        {
            title: 'Total Uploads',
            value: totalUploads,
            change: '+12.5%',
            icon: Upload,
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            textColor: 'text-blue-600 dark:text-blue-400'
        },
        {
            title: 'Active Users',
            value: activeUsers,
            change: '+8.2%',
            icon: Users,
            color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
            textColor: 'text-emerald-600 dark:text-emerald-400'
        },
        {
            title: 'Upload Rate',
            value: '94.2%',
            change: '+2.1%',
            icon: TrendingUp,
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            textColor: 'text-purple-600 dark:text-purple-400'
        },
        {
            title: 'Success Rate',
            value: '98.7%',
            change: '+0.5%',
            icon: Activity,
            color: 'bg-gradient-to-br from-amber-500 to-amber-600',
            bgColor: 'bg-amber-50 dark:bg-amber-900/20',
            textColor: 'text-amber-600 dark:text-amber-400'
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Statistics</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of file upload metrics and performance</p>
                </div>
                <div className="flex items-center space-x-2">
                    <select className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-sm font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                                {stat.change}
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
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Trends</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">XLSX Files</span>
                            <div className="flex items-center space-x-2">
                                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">75%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">CSV Files</span>
                            <div className="flex items-center space-x-2">
                                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">60%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">XLS Files</span>
                            <div className="flex items-center space-x-2">
                                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">45%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900 dark:text-white">New user registration</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900 dark:text-white">Large file upload completed</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">5 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900 dark:text-white">System backup initiated</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">15 minutes ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadStats;