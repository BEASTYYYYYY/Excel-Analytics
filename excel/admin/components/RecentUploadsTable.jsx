import React, { useEffect, useState } from 'react';
import { FileText, Calendar, Trash2, CheckCircle, Download } from 'lucide-react';
import { getAuth } from 'firebase/auth';

const RecentUploadsTable = () => {
    const [uploads, setUploads] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUploads = async () => {
            try {
                const token = await getAuth().currentUser.getIdToken();
                const res = await fetch('/api/users/uploads/recent', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    if (data.success) setUploads(data.uploads);
                } catch {
                    console.error('Non-JSON response:', text);
                }
            } catch (err) {
                console.error('Error fetching uploads:', err);
            }
        };
        fetchUploads();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this upload?')) return;
        try {
            const token = await getAuth().currentUser.getIdToken();
            // FIX: Use the correct backend route for admin delete
            const res = await fetch(`/api/users/admin/uploads/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            // Defensive: handle empty response
            let data = {};
            try {
                data = await res.json();
            } catch {
                data = {};
            }
            if (res.ok && data.success) {
                setUploads(prev => prev.filter(upload => upload._id !== id));
            } else {
                alert('Delete failed: ' + (data.message || res.statusText));
            }
        } catch (err) {
            console.error('Error deleting upload:', err);
            alert('Failed to delete upload');
        }
    };
    

    const filteredUploads = uploads.filter(upload =>
        upload.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.user?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const total = uploads.length;
    const success = uploads.length; // Assuming all uploads shown are successful

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Uploads</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage file uploads</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search by filename or user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white"
                    />
                    <button
                        onClick={() => {
                            const csv = [
                                ['User', 'Filename', 'Size', 'Date'],
                                ...filteredUploads.map(u => [
                                    u.user || '—',
                                    u.filename,
                                    u.size,
                                    new Date(u.createdAt).toLocaleString()
                                ])
                            ]
                                .map(row => row.join(','))
                                .join('\n');
                            const blob = new Blob([csv], { type: 'text/csv' });
                            const a = document.createElement('a');
                            a.href = URL.createObjectURL(blob);
                            a.download = 'uploads.csv';
                            a.click();
                        }}
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm"
                    >
                        <Download className="w-4 h-4 inline-block mr-1" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Status Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Uploads</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{total}</p>
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
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{success}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">User</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">File</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">Size</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">Date</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUploads.map((upload, index) => (
                            <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">{upload.userName || upload.user || upload.name || '—'}</td>

                                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    {upload.filename}
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{upload.fileSize || '—'}</td>

                                <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                                    <Calendar className="w-4 h-4 inline-block mr-1 text-gray-400" />
                                    {new Date(upload.createdAt).toLocaleString()}
                                </td>
                                <td className="py-4 px-4">
                                    <button
                                        onClick={() => handleDelete(upload._id)}
                                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredUploads.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No uploads found</h3>
                        <p className="text-gray-600 dark:text-gray-400">Try adjusting your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentUploadsTable;
