import { FileText, BarChart3, LineChart, PieChart } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { useEffect, useRef } from 'react';

export default function AnalysisResults({ analysis }) {
    // Add ref to track chart instance
    const chartRef = useRef(null);

    // Cleanup chart instance when component unmounts or analysis changes
    useEffect(() => {
        return () => {
            // Ensure chart is destroyed when component unmounts or when analysis changes
            if (chartRef.current && chartRef.current.chartInstance) {
                chartRef.current.chartInstance.destroy();
            }
        };
    }, [analysis]);

    if (!analysis) return null;

    // Prepare data for chart
    const labels = Object.keys(analysis.summary);
    const values = Object.values(analysis.summary).map(v => Number(v));

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Analysis Results',
                data: values,
                backgroundColor: 'rgba(79, 70, 229, 0.7)',
                borderRadius: 6,
            },
        ],
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                <FileText className="mr-2 h-6 w-6 text-indigo-600" />
                Data Analysis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg">
                    <h3 className="text-indigo-600 dark:text-indigo-300 font-medium mb-2 flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Total Entries
                    </h3>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{analysis.totalEntries}</p>
                </div>

                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                    <h3 className="text-green-600 dark:text-green-300 font-medium mb-2 flex items-center">
                        <LineChart className="h-4 w-4 mr-2" />
                        Average Value
                    </h3>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{analysis.average}</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                    <h3 className="text-purple-600 dark:text-purple-300 font-medium mb-2 flex items-center">
                        <PieChart className="h-4 w-4 mr-2" />
                        Highest Value
                    </h3>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {analysis.highestValue.value}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                            ({analysis.highestValue.key || 'N/A'})
                        </span>
                    </p>
                </div>
            </div>

            {/* Bar Chart for Analysis Data */}
            

            {/* Summary table */}
            <div className="mt-6">
                <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-100">Summary</h3>
                {/* Check if summary exists and has keys */}
                {analysis.summary && Object.keys(analysis.summary).length > 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg max-h-60 overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-600">
                                    <th className="text-left py-2 text-gray-600 dark:text-gray-300">Key</th>
                                    <th className="text-right py-2 text-gray-600 dark:text-gray-300">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(analysis.summary).map(([key, value]) => (
                                    <tr key={key} className="border-b border-gray-200 dark:border-gray-600">
                                        <td className="py-2 text-gray-800 dark:text-gray-200">{key}</td>
                                        <td className="py-2 text-right text-gray-800 dark:text-gray-200">{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                        <p className="text-gray-500 dark:text-gray-400">No summary data available</p>
                    </div>
                )}
            </div>
        </div>
    );
}