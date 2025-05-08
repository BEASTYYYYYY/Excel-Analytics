import { FileUp, History, Calendar, BarChart2, Trash2 } from 'lucide-react';

export default function HistorySidebar({
    history,
    isLoading,
    selectedHistoryItem,
    onRefreshHistory,
    onSelectFile,
    onDeleteFile,
    onAnalyzeFile
}) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 space-y-4">
            <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900 rounded-lg text-indigo-600 dark:text-indigo-400">
                <div className="flex items-center space-x-3">
                    <History className="h-5 w-5" />
                    <span className="font-medium">Upload History</span>
                </div>
                <button
                    onClick={onRefreshHistory}
                    className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 hover:underline"
                >
                    Refresh
                </button>
            </div>

            {/* Upload History List */}
            <div className="max-h-[600px] overflow-y-auto pr-1">
                {isLoading ? (
                    <div className="flex justify-center py-4">
                        <div className="w-6 h-6 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : history.length > 0 ? (
                    <div className="space-y-5">
                        {history.map(item => (
                            <div
                                key={item.id}
                                className={`bg-gray-50 dark:bg-gray-700 p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-800 transition-colors cursor-pointer ${selectedHistoryItem && selectedHistoryItem.id === item.id ? 'border-l-4 border-indigo-500' : ''}`}
                                onClick={() => onSelectFile(item.id)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                                            <FileUp className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <h3 className="font-medium text-gray-800 dark:text-gray-100 text-sm truncate max-w-[120px]">{item.filename}</h3>
                                    </div>
                                    <button
                                        onClick={(e) => onDeleteFile(item.id, e)}
                                        className="text-red-500 hover:text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded-full"
                                        title="Delete file"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-300 ml-10 mb-2">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {item.uploadDate}
                                </div>
                                <div className="flex space-x-2 mt-2 justify-end">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelectFile(item.id);
                                            onAnalyzeFile(item.id);
                                        }}
                                        className={`text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded-full flex items-center space-x-1  `}
                                    >
                                        <BarChart2 className="h-4 w-4" />
                                        <span>Analyze</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-300 py-4 text-sm">No upload history yet.</p>
                )}
            </div>
        </div>
    );
}