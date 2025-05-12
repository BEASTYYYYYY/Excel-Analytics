/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { FileUp, History, Calendar, BarChart2, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { fetchUploadHistory, loadFileData, analyzeFile, deleteFile } from './utils/api';
import Notification from './Notification';

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [authChecked, setAuthChecked] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Check authentication status
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthChecked(true);
        });

        return () => unsubscribe();
    }, []);

    // Fetch data once auth is checked
    useEffect(() => {
        if (authChecked) {
            if (user) {
                fetchUploadHistoryData();
            } else {
                navigate('/login');
                showNotification('error', 'Please log in to view your files');
                setIsLoading(false);
            }
        }
    }, [authChecked, user, navigate]);

    // Function to show notifications
    const showNotification = (type, message, duration = 5000) => {
        setNotification({ type, message });
        setTimeout(() => setNotification({ type: '', message: '' }), duration);
    };

    const fetchUploadHistoryData = async () => {
        setIsLoading(true);
        try {
            if (!user) {
                throw new Error("User not authenticated");
            }

            const processedHistory = await fetchUploadHistory();
            setHistory(processedHistory);
        } catch (err) {
            console.error("Error fetching history:", err);
            showNotification('error', err.message || "Failed to fetch upload history. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewFile = (fileId) => {
        navigate(`/dashboard?fileId=${fileId}`);
    };

    const handleDeleteFile = async (fileId, event) => {
        event.stopPropagation();
        try {
            if (!user) {
                throw new Error("Please log in to delete files");
            }

            const result = await deleteFile(fileId);
            if (result.success) {
                showNotification('success', "File deleted successfully!");
                setHistory(history.filter(item => item.id !== fileId));
            }
        } catch (error) {
            showNotification('error', error.message || "Failed to delete file");
        }
    };

    const handleAnalyzeFile = (fileId) => {
        navigate(`/dashboard?fileId=${fileId}&analyze=true`);
    };

    // If we haven't checked auth status yet, show a loading indicator
    if (!authChecked) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Loading account information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans dark:bg-gray-900 dark:text-gray-100">
            {/* Notification */}
            <Notification notification={notification} onClose={() => setNotification({ type: '', message: '' })} />

            <main className="container mx-auto p-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <History className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Upload History</h1>
                        </div>
                        <button
                            onClick={fetchUploadHistoryData}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-300"
                        >
                            <span>Refresh</span>
                        </button>
                    </div>

                    {/* Upload History List */}
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        </div>
                    ) : history.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {history.map(item => (
                                <div
                                    key={item.id}
                                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                                                <FileUp className="h-6 w-6 text-indigo-600" />
                                            </div>
                                            <h3 className="font-medium text-gray-800 dark:text-gray-100">{item.filename}</h3>
                                        </div>
                                        <button
                                            onClick={(e) => handleDeleteFile(item.id, e)}
                                            className="text-red-500 hover:text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded-full"
                                            title="Delete file"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-300 mb-4">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        {item.uploadDate}
                                    </div>
                                    <div className="flex space-x-3 mt-4 justify-end">
                                        <button
                                            onClick={() => handleViewFile(item.id)}
                                            className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-4 rounded-lg flex items-center space-x-1"
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            <span>View</span>
                                        </button>
                                        <button
                                            onClick={() => handleAnalyzeFile(item.id)}
                                            className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-4 rounded-lg flex items-center space-x-1"
                                        >
                                            <BarChart2 className="h-4 w-4 mr-1" />
                                            <span>Analyze</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-12 text-center">
                            <FileUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">No Upload History</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                                You haven't uploaded any files yet. Go to the Dashboard to upload your first file.
                            </p>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors duration-300"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}