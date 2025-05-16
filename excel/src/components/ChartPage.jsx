import React from 'react';
import { useHistory } from '../context/HistoryContext';
import ChartVisualization from './ChartVisualization';
import { useNavigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';


export default function ChartVisualizationPage() {
    const { selectedHistoryItem } = useHistory();
    const navigate = useNavigate();
    return (
        <div className='ml-[21rem]'>
            {selectedHistoryItem && (
                <ChartVisualization
                    selectedHistoryItem={selectedHistoryItem}
                // isAnalyzing={isAnalyzing}
                // analysis={analysis}
                // onAnalyze={() => handleAnalyzeFile(selectedHistoryItem.id)}
                />
            )}
            {!selectedHistoryItem &&  (
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
    )
}