/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { FileUp, Trash2, Eye, BarChart2, Calendar } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { fetchUploadHistory, deleteFile } from "./utils/api";
import Notification from "./Notification";

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [authChecked, setAuthChecked] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthChecked(true);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (authChecked && user) {
            loadHistory();
        }
    }, [authChecked, user]);

    const loadHistory = async () => {
        setIsLoading(true);
        try {
            const data = await fetchUploadHistory();
            setHistory(data);
        } catch (error) {
            showNotification(error, "Failed to fetch upload history.");
        } finally {
            setIsLoading(false);
        }
    };

    const showNotification = (type, message, duration = 5000) => {
        setNotification({ type, message });
        setTimeout(() => setNotification({ type: '', message: '' }), duration);
    };

    const handleAnalyzeFile = (fileId) => {
        navigate(`/dashboard?fileId=${fileId}&analyze=true`);
    };

    const handleDeleteFile = async (fileId, e) => {
        e.stopPropagation();
        try {
            const res = await deleteFile(fileId);
            if (res.success) {
                setHistory(history.filter((f) => f.id !== fileId));
                showNotification("success", "File deleted successfully");
            }
        } catch (error) {
            showNotification(error, "Error deleting file");
        }
    };
    //
    if (!authChecked) return <p className="p-4">Checking auth...</p>;

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12 ml-[20rem] mr-5">
            <Notification notification={notification} onClose={() => setNotification({ type: '', message: '' })} />
            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                <div className="relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-[#252525] to-[#3a3a3a] text-white shadow-gray-900/20 shadow-lg -mt-6 mb-8 p-6">
                    <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">
                        Upload History
                    </h6>
                </div>
                <div className="p-6 overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                <th className="border-b py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400">Filename</th>
                                <th className="border-b py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400">Date</th>
                                <th className="border-b py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="3" className="text-center py-6">Loading...</td></tr>
                            ) : history.length === 0 ? (
                                <tr><td colSpan="3" className="text-center py-6">No upload history found</td></tr>
                            ) : (
                                history.map(item => (
                                    <tr key={item.id}>
                                        <td className="py-3 px-5 border-b">
                                            <div className="flex items-center gap-4">
                                                <FileUp className="h-5 w-5 text-indigo-500" />
                                                <span className="text-sm font-medium text-blue-gray-900">{item.filename}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-5 border-b">
                                            <div className="flex items-center text-sm text-blue-gray-600">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {item.uploadDate}
                                            </div>
                                        </td>
                                        <td className="py-3 px-5 border-b">
                                            <div className="flex gap-3">
                                               
                                                <button onClick={() => handleAnalyzeFile(item.id)} title="Analyze" className="text-sm text-white bg-indigo-600 px-3 py-1.5 rounded-md flex items-center gap-1">
                                                    <BarChart2 className="w-4 h-4" /> Analyze
                                                </button>
                                                <button onClick={(e) => handleDeleteFile(item.id, e)} title="Delete" className="text-sm text-white bg-red-600 px-3 py-1.5 rounded-md flex items-center gap-1">
                                                    <Trash2 className="w-4 h-4" /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
