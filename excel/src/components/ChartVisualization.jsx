/* eslint-disable react-hooks/exhaustive-deps */
import { BarChart3, AlertTriangle, Loader, Layers3 } from 'lucide-react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { useEffect, useRef, useState } from 'react';
import ThreeBarChart from './ThreeBarChart';
import ChartOptions from './ChartOptions';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
    ArcElement,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function EnhancedChartVisualization({
    selectedHistoryItem,
    isAnalyzing,
    analysis,
    onAnalyze
}) {
    // Add state to toggle between chart types
    const [chartType, setChartType] = useState('bar');
    const [is3D, setIs3D] = useState(false);

    // Add ref to track chart instance
    const chartRef = useRef(null);

    // Cleanup chart instance when component unmounts or selectedHistoryItem changes
    useEffect(() => {
        return () => {
            // Ensure chart is destroyed when component unmounts or when selected item changes
            if (chartRef.current && chartRef.current.chartInstance) {
                chartRef.current.chartInstance.destroy();
            }
        };
    }, [selectedHistoryItem, chartType]);

    if (!selectedHistoryItem || !selectedHistoryItem.parsedData) return null;

    const parsedData = selectedHistoryItem.parsedData;

    // Validate parsedData is not empty
    if (!parsedData || Object.keys(parsedData).length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center justify-center">
                    <AlertTriangle className="mr-2 h-6 w-6 text-yellow-600" />
                    No Chart Data Available
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    The uploaded file doesn't contain any valid data for visualization.
                    Try uploading a different file or check the file format.
                </p>
            </div>
        );
    }

    // Handle different data structures
    let labels = [];
    let values = [];
    let datasetLabel = 'Data';

    if (Array.isArray(parsedData)) {
        // If parsedData is an array of objects
        if (parsedData.length > 0 && typeof parsedData[0] === 'object') {
            const fields = Object.keys(parsedData[0]);
            if (fields.length >= 2) {
                const labelField = fields[0];
                const valueField = fields[1];

                datasetLabel = valueField; // Use the value field name as dataset label
                labels = parsedData.map(item => String(item[labelField] || 'Undefined'));

                // Handle non-numeric data by counting occurrences
                const valueMap = new Map();
                parsedData.forEach(item => {
                    const label = String(item[labelField] || 'Undefined');
                    const value = item[valueField];

                    if (typeof value === 'number' && !isNaN(value)) {
                        // If it's a number, use it directly
                        valueMap.set(label, (valueMap.get(label) || 0) + value);
                    } else {
                        // For non-numeric, just count occurrences
                        valueMap.set(label, (valueMap.get(label) || 0) + 1);
                    }
                });

                // Convert Map to arrays for Chart.js
                labels = Array.from(valueMap.keys());
                values = Array.from(valueMap.values());
            }
        }
    } else if (typeof parsedData === 'object') {
        // If parsedData is an object with key-value pairs
        labels = Object.keys(parsedData);

        // Convert all values to numbers if possible, otherwise count as 1
        values = labels.map(key => {
            const val = parsedData[key];
            return typeof val === 'number' ? val : 1;
        });
    }

    // If we have no data after processing
    if (labels.length === 0 || values.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center justify-center">
                    <AlertTriangle className="mr-2 h-6 w-6 text-yellow-600" />
                    No Chart Data Available
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Could not extract data suitable for visualization.
                    Try uploading a different file or check the file format.
                </p>
            </div>
        );
    }

    // Generate colors for the chart
    const backgroundColors = labels.map((_, i) => {
        const hue = (i * 137) % 360; // Golden angle approximation for color distribution
        return `hsla(${hue}, 70%, 60%, 0.7)`;
    });

    const borderColors = labels.map((_, i) => {
        const hue = (i * 137) % 360;
        return `hsla(${hue}, 70%, 60%, 1)`;
    });

    // Prepare data based on chart type
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: datasetLabel,
                data: values,
                backgroundColor: chartType === 'line' ? borderColors[0] : backgroundColors,
                borderColor: chartType === 'line' ? borderColors[0] : undefined,
                borderWidth: chartType === 'line' ? 2 : 1,
                borderRadius: chartType === 'bar' ? 6 : undefined,
                tension: chartType === 'line' ? 0.3 : undefined,
                fill: chartType === 'line' ? false : undefined,
                pointBackgroundColor: chartType === 'line' ? borderColors[0] : undefined,
                pointBorderColor: chartType === 'line' ? '#fff' : undefined,
                pointHoverBackgroundColor: chartType === 'line' ? '#fff' : undefined,
                pointHoverBorderColor: chartType === 'line' ? borderColors[0] : undefined,
                pointRadius: chartType === 'line' ? 4 : undefined,
                pointHoverRadius: chartType === 'line' ? 6 : undefined,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: selectedHistoryItem.filename,
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.parsed.y || context.parsed || context.raw;
                        return `${context.dataset.label}: ${value}`;
                    }
                }
            }
        },
        scales: chartType === 'pie' || chartType === 'doughnut' ? undefined : {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Value',
                    font: {
                        weight: 'bold'
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Category',
                    font: {
                        weight: 'bold'
                    }
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        }
    };

    // Handle chart download
    const handleDownload = () => {
        if (chartRef.current) {
            const canvas = chartRef.current.canvas;
            if (canvas) {
                // Create a temporary link element
                const link = document.createElement('a');
                link.download = `${selectedHistoryItem.filename}-${chartType}-chart.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        }
    };

    // Render the appropriate chart based on type
    const renderChart = () => {
        if (is3D) {
            return <ThreeBarChart labels={labels} values={values} />;
        }

        switch (chartType) {
            case 'line':
                return <Line data={chartData} options={chartOptions} ref={chartRef} />;
            case 'pie':
                return <Pie data={chartData} options={chartOptions} ref={chartRef} />;
            case 'doughnut':
                return <Doughnut data={chartData} options={chartOptions} ref={chartRef} />;
            case 'bar':
            default:
                return <Bar data={chartData} options={chartOptions} ref={chartRef} />;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                    <BarChart3 className="mr-2 h-6 w-6 text-indigo-600" />
                    Chart Visualization: {selectedHistoryItem.filename}
                </h2>
                {chartType === 'bar' && (
                    <button
                        onClick={() => setIs3D(prev => !prev)}
                        className="bg-indigo-100 dark:bg-gray-700 text-indigo-600 dark:text-white px-3 py-1 rounded-md text-sm flex items-center"
                    >
                        <Layers3 className="h-4 w-4 mr-1" />
                        {is3D ? '2D View' : '3D View'}
                    </button>
                )}
            </div>

            {/* Chart Type Selection */}
            <ChartOptions
                activeChart={chartType}
                setActiveChart={setChartType}
                onDownload={handleDownload}
            />

            <div className="flex-grow">
                <div className="relative h-80 overflow-hidden">
                    {renderChart()}
                </div>
            </div>

            {!analysis && (
                <div className="mt-4 flex justify-center relative">
                    <button
                        onClick={onAnalyze}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
                        disabled={isAnalyzing}
                    >
                        {isAnalyzing ? (
                            <Loader className="h-5 w-5 animate-spin" />
                        ) : (
                            <BarChart3 className="h-5 w-5" />
                        )}
                        <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Data'}</span>
                    </button>
                </div>
            )}
        </div>
    );
}