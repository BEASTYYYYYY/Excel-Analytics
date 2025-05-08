import { BarChart3, LineChart, PieChart, Download } from 'lucide-react';

export default function ChartOptions({ activeChart, setActiveChart, onDownload }) {
    const chartTypes = [
        { id: 'bar', icon: BarChart3, label: 'Bar Chart' },
        { id: 'line', icon: LineChart, label: 'Line Chart' },
        { id: 'pie', icon: PieChart, label: 'Pie Chart' },
        { id: 'doughnut', icon: PieChart, label: 'Doughnut Chart' },
    ];

    return (
        <div className="flex items-center space-x-2 mb-4">
            <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                {chartTypes.map((chart) => (
                    <button
                        key={chart.id}
                        onClick={() => setActiveChart(chart.id)}
                        className={`px-3 py-1 rounded-md text-sm flex items-center ${activeChart === chart.id
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        <chart.icon className="h-4 w-4 mr-1" />
                        <span>{chart.label}</span>
                    </button>
                ))}
            </div>

            <button
                onClick={onDownload}
                className="ml-auto bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-sm flex items-center"
            >
                <Download className="h-4 w-4 mr-1" />
                Download
            </button>
        </div>
    );
}