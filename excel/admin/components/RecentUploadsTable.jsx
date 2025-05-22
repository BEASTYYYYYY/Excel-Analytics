// src/admin/components/RecentUploadsTable.jsx
import React, { useState } from 'react';
import { FileText, Calendar, Filter, Download, MoreVertical, Search, Eye, Trash2, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const RecentUploadsTable = ({ uploads: initialUploads }) => {
    const [uploads] = useState(initialUploads || [
        { user: 'alice@example.com', filename: 'report1.xlsx', date: '2025-05-20', size: '2.4 MB', status: 'success', type: 'xlsx' },
        { user: 'bob@example.com', filename: 'data.csv', date: '2025-05-21', size: '1.8 MB', status: 'success', type: 'csv' },
        { user: 'charlie@example.com', filename: 'analysis.xlsx', date: '2025-05-22', size: '3.2 MB', status: 'processing', type: 'xlsx' },
        { user: 'diana@example.com', filename: 'metrics.csv', date: '2025-05-22', size: '1.1 MB', status: 'failed', type: 'csv' },
        { user: 'eve@example.com', filename: 'dashboard.xlsx', date: '2025-05-22', size: '4.7 MB', status: 'success', type: 'xlsx' },
        { user: 'frank@example.com', filename: 'sales_data.csv', date: '2025-05-22', size: '892 KB', status: 'processing', type: 'csv' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
            case 'processing': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
            case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return CheckCircle;
            case 'processing': return Clock;
            case 'failed': return AlertCircle;
            default: return Clock;
        }
    };

    const getFileTypeColor = (type) => {
        switch (type) {
            case 'xlsx': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'csv': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'xls': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const filteredUploads = uploads.filter(upload => {
        const matchesSearch = upload.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
            upload.user.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || upload.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        all: uploads.length,
        success: uploads.filter(u => u.status === 'success').length,
        processing: uploads.filter(u => u.status === 'processing').length,
        failed: uploads.filter(u => u.status === 'failed').length,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Uploads</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage all file uploads across your platform</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Status Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Uploads</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{statusCounts.all}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Successful</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{statusCounts.success}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Processing</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{statusCounts.processing}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{statusCounts.failed}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by filename or user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        />
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white appearance-none"
                            >
                                <option value="all">All Status</option>
                                <option value="success">Success</option>
                                <option value="processing">Processing</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">User</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">File</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Type</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Size</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Date</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUploads.map((upload, index) => {
                                const StatusIcon = getStatusIcon(upload.status);
                                return (
                                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="text-sm text-gray-900 dark:text-white font-medium">{upload.user}</div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-2">
                                                <FileText className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-900 dark:text-white">{upload.filename}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFileTypeColor(upload.type)}`}>
                                                {upload.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{upload.size}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-2">
                                                <StatusIcon className="w-4 h-4" />
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(upload.status)}`}>
                                                    {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">{upload.date}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-2">
                                                <button className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredUploads.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No uploads found</h3>
                        <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentUploadsTable;