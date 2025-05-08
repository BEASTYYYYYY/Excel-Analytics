/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { History, FileUp, BarChart3 } from 'lucide-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import FileUpload from './FileUpload';
import HistorySidebar from './HistorySidebar';
import EnhancedChartVisualization from './ChartVisualization';
import ThreeLineChart from './ThreeLineChart';
import AnalysisResults from './AnalysisResults';
import Notification from './Notification';
import { fetchUploadHistory, loadFileData, analyzeFile, deleteFile, isAuthenticated } from './utils/api';
import ThreeDonutChart from './ThreeDonutChart';

export default function Dashboard() {
    const [file, setFile] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [dataPreview, setDataPreview] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // First check authentication status
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthChecked(true); // Mark that we've checked auth status
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    // Then fetch data once auth is checked
    useEffect(() => {
        if (authChecked) {
            if (user) {
                fetchUploadHistoryData();
            } else {
                // If not authenticated, redirect to login
                navigate('/login');
                // Show notification
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
            // Only fetch if user is authenticated
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

    const handleFileSelect = (selectedFile, preview) => {
        setFile(selectedFile);
        setDataPreview(preview);
    };

    const handleUploadSuccess = () => {
        setUploadSuccess(true);
        showNotification('success', "File uploaded and processed successfully!");
        fetchUploadHistoryData();

        setTimeout(() => {
            setUploadSuccess(false);
            setFile(null);
            setDataPreview(null);
        }, 3000);
    };

    const handleLoadFileData = async (fileId) => {
        try {
            if (!user) {
                throw new Error("Please log in to access files");
            }

            const fileData = await loadFileData(fileId);
            setSelectedHistoryItem(fileData);
            setAnalysis(null);
        } catch (error) {
            showNotification('error', error.message || "Failed to load file data");
        }
    };

    const handleDeleteFile = async (fileId, event) => {
        try {
            if (!user) {
                throw new Error("Please log in to delete files");
            }

            const result = await deleteFile(fileId, event);
            if (result.success) {
                showNotification('success', "File deleted successfully!");
                setHistory(history.filter(item => item.id !== fileId));

                if (selectedHistoryItem && selectedHistoryItem.id === fileId) {
                    setSelectedHistoryItem(null);
                    setAnalysis(null);
                }
            }
        } catch (error) {
            showNotification('error', error.message || "Failed to delete file");
        }
    };

    const handleAnalyzeFile = async (fileId) => {
        setIsAnalyzing(true);
        try {
            if (!user) {
                throw new Error("Please log in to analyze files");
            }

            const analysisResult = await analyzeFile(fileId);
            setAnalysis(analysisResult);
            showNotification('success', "Analysis completed successfully!");
        } catch (error) {
            showNotification('error', "Failed to analyze file: " + error.message);
        } finally {
            setIsAnalyzing(false);
        }
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Sidebar with Upload History */}
                    <div className="lg:col-span-3">
                        <HistorySidebar
                            history={history}
                            isLoading={isLoading}
                            selectedHistoryItem={selectedHistoryItem}
                            onRefreshHistory={fetchUploadHistoryData}
                            onSelectFile={handleLoadFileData}
                            onDeleteFile={handleDeleteFile}
                            onAnalyzeFile={handleAnalyzeFile}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* File Upload */}
                        <FileUpload
                            file={file}
                            uploadSuccess={uploadSuccess}
                            dataPreview={dataPreview}
                            error={error}
                            onFileSelect={handleFileSelect}
                            onUploadSuccess={handleUploadSuccess}
                            onError={setError}
                            showNotification={showNotification}
                        />

                        {/* Selected File Visualization Section */}
                        {selectedHistoryItem && (
                            <EnhancedChartVisualization
                                selectedHistoryItem={selectedHistoryItem}
                                isAnalyzing={isAnalyzing}
                                analysis={analysis}
                                onAnalyze={() => handleAnalyzeFile(selectedHistoryItem.id)}
                            />
                        )}

                        {/* Analysis Results */}
                        {analysis && <AnalysisResults analysis={analysis} />}

                        {/* Display message when no file is selected */}
                        {!selectedHistoryItem && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center py-16">
                                <BarChart3 className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                                <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">No Data Selected</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                                    Upload a file or select one from your history to view analysis
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}