/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import FileUpload from './FileUpload';
import {ChartVisualization} from './ChartVisualization';
import Notification from './Notification';
import { loadFileData, analyzeFile } from './utils/api';

export default function Dashboard() {
    const [file, setFile] = useState(null);
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
    const location = useLocation();

    // Check for fileId in URL query params
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const fileId = queryParams.get('fileId');
        const shouldAnalyze = queryParams.get('analyze') === 'true';

        if (fileId && user) {
            handleLoadFileData(fileId, shouldAnalyze);
        }
    }, [location.search, user]);

    // First check authentication status
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthChecked(true); // Mark that we've checked auth status
            setIsLoading(false);
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    // Then check if user is authenticated
    useEffect(() => {
        if (authChecked && !user) {
            navigate('/login');
            // Show notification
            showNotification('error', 'Please log in to view your files');
        }
    }, [authChecked, user, navigate]);

    // Function to show notifications
    const showNotification = (type, message, duration = 5000) => {
        setNotification({ type, message });
        setTimeout(() => setNotification({ type: '', message: '' }), duration);
    };

    const handleFileSelect = (selectedFile, preview) => {
        setFile(selectedFile);
        setDataPreview(preview);
    };

    const handleUploadSuccess = () => {
        setUploadSuccess(true);
        showNotification('success', "File uploaded and processed successfully!");

        setTimeout(() => {
            setUploadSuccess(false);
            setFile(null);
            setDataPreview(null);
        }, 3000);
    };

    const handleLoadFileData = async (fileId, shouldAnalyze = false) => {
        setIsLoading(true);
        try {
            if (!user) {
                throw new Error("Please log in to access files");
            }

            const fileData = await loadFileData(fileId);

            // ✅ Prevent duplicate re-analysis
            if (!fileData._analyzed) {
                fileData._analyzed = false;
            }

            setSelectedHistoryItem(fileData);
            setAnalysis(null);

            if (shouldAnalyze && !fileData._analyzed) {
                await handleAnalyzeFile(fileId);
                fileData._analyzed = true; // ✅ Mark as analyzed
            }
        } catch (error) {
            showNotification('error', error.message || "Failed to load file data");
        } finally {
            setIsLoading(false);
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
                <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Dashboard</h1>

                {/* Main Content */}
                <div className="space-y-6">
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
                        <ChartVisualization
                            selectedHistoryItem={selectedHistoryItem}
                            isAnalyzing={isAnalyzing}
                            analysis={analysis}
                            onAnalyze={() => handleAnalyzeFile(selectedHistoryItem.id)}
                        />
                    )}

                    {/* Analysis Results */}

                    {/* Display message when no file is selected */}
                    {!selectedHistoryItem && !file && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center py-16">
                            <BarChart3 className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">No Data Selected</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                                Upload a file or go to Upload History to select a previously uploaded file
                            </p>
                            <button
                                onClick={() => navigate('/UploadHistory')}
                                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors duration-300"
                            >
                                View Upload History
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}