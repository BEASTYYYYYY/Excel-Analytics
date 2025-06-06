/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import FileUpload from './FileUpload';
import { ChartVisualization } from './ChartVisualization';
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

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const fileId = queryParams.get('fileId');
        const shouldAnalyze = queryParams.get('analyze') === 'true';

        if (fileId && user) {
            handleLoadFileData(fileId, shouldAnalyze);
        }
    }, [location.search, user]);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthChecked(true);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);
    useEffect(() => {
        const fetchProfile = async () => {
            const token = await getAuth().currentUser.getIdToken();
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.notification) {
                setNotification(data.notification);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        if (authChecked && !user) {
            navigate('/login');
            showNotification('error', 'Please log in to view your files');
        }
    }, [authChecked, user, navigate]);

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
            if (!fileData._analyzed) {
                fileData._analyzed = false;
            }
            setSelectedHistoryItem(fileData);
            setAnalysis(null);
            if (shouldAnalyze && !fileData._analyzed) {
                await handleAnalyzeFile(fileId);
                fileData._analyzed = true;
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
        <div className="flex-1 p-6">
            <Notification notification={notification} onClose={() => setNotification({ type: '', message: '' })} />
            <main className="container flex-1 mx-auto">
                <div className="space-y-6">
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
                    {selectedHistoryItem && (
                        <button
                            onClick={() => navigate('/insight/' + selectedHistoryItem.id)}
                            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors duration-300">
                            View Ai Insights
                        </button>
                    )}
                    {selectedHistoryItem && (
                        <ChartVisualization
                            selectedHistoryItem={selectedHistoryItem}
                            isAnalyzing={isAnalyzing}
                            analysis={analysis}
                            onAnalyze={() => handleAnalyzeFile(selectedHistoryItem.id)}
                        />
                    )}
                    {!selectedHistoryItem && !file && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center py-16">
                            <BarChart3 className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">No Data Selected</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                                Upload a file or go to Upload History to select a previously uploaded file
                            </p>
                            <button
                                onClick={() => navigate('/UploadHistory')}
                                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors duration-300">
                                View Upload History
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}