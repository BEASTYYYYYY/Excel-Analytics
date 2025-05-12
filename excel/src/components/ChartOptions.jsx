import React from 'react';
import { BarChart3, LineChart, PieChart, Download } from 'lucide-react';

export default function ChartOptions({ activeChart, setActiveChart, onDownload, is3D }) {
    const chartTypes = [
        { id: 'bar', label: 'Bar Chart', icon: <BarChart3 className="h-4 w-4" /> },
        { id: 'line', label: 'Line Chart', icon: <LineChart className="h-4 w-4" /> },
        { id: 'pie', label: 'Pie Chart', icon: <PieChart className="h-4 w-4" /> },
    ];

    return (
        <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
            <div className="flex flex-wrap gap-2">
                {chartTypes.map((chart) => (
                    <button
                        key={chart.id}
                        onClick={() => setActiveChart(chart.id)}
                        className={`flex items-center px-3 py-1.5 text-sm rounded-md ${activeChart === chart.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        disabled={is3D && (chart.id === 'doughnut' && activeChart === 'pie' || chart.id === 'pie' && activeChart === 'doughnut')}
                    >
                        {chart.icon}
                        <span className="ml-1">{chart.label}</span>
                    </button>
                ))}
            </div>
            <button
                onClick={onDownload}
                className="flex items-center bg-indigo-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 rounded-md text-sm hover:bg-indigo-200 dark:hover:bg-gray-600"
                title="Download chart as PNG"
            >
                <Download className="h-4 w-4 mr-1" />
                Download
            </button>
        </div>
    );
}