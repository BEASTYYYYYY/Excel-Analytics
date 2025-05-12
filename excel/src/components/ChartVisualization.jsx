/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Download, BarChart, LineChart, PieChart } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export const ChartVisualization = ({ selectedHistoryItem }) => {
    const [selectedXAxis, setSelectedXAxis] = useState('');
    const [selectedYAxis, setSelectedYAxis] = useState('');
    const [chartType, setChartType] = useState('bar');
    const [availableColumns, setAvailableColumns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [chartData, setChartData] = useState(null);
    const [parsedData, setParsedData] = useState(null);
    const [colorScheme, setColorScheme] = useState('default'); // 'default', 'cool', 'warm', 'rainbow'

    const chartRef = useRef(null);

    // Process data when selectedHistoryItem changes
    useEffect(() => {
        if (selectedHistoryItem) {
            let dataToProcess = selectedHistoryItem.parsedData || selectedHistoryItem.data;
            console.log("selectedHistoryItem:", selectedHistoryItem);
            console.log("dataToProcess:", dataToProcess);

            if (dataToProcess) {
                // Ensure data is in array format for consistent processing
                if (!Array.isArray(dataToProcess)) {
                    // Check if it's a collection of records
                    if (typeof dataToProcess === 'object' && dataToProcess !== null) {
                        // Check if this is a nested data structure we need to extract from
                        if (dataToProcess.data && Array.isArray(dataToProcess.data)) {
                            dataToProcess = dataToProcess.data;
                        } else {
                            // Convert object to array while preserving original properties
                            const objKeys = Object.keys(dataToProcess);
                            if (objKeys.length > 0 && typeof dataToProcess[objKeys[0]] === 'object') {
                                // Object of objects, convert to array of objects
                                dataToProcess = objKeys.map(key => ({
                                    id: key,
                                    ...dataToProcess[key]
                                }));
                            } else {
                                // Simple key-value object
                                // dataToProcess = Object.entries(dataToProcess).map(([key, value]) => ({ key, value }));
                            }
                        }
                    } else {
                        setError('Invalid data format for visualization');
                        return;
                    }
                }

                if (dataToProcess.length > 0) {
                    processDataColumns(dataToProcess);
                } else {
                    setError('No data found in the selected file');
                }
            } else {
                setError('No valid data found in the selected file');
            }
        }
    }, [selectedHistoryItem]);

    // Effect for updating chart data when selections change
    useEffect(() => {
        if (selectedXAxis && selectedYAxis && parsedData) {
            prepareChartData();
        }
    }, [selectedXAxis, selectedYAxis, chartType, parsedData, colorScheme]);

    // Get columns from parsed data
    const processDataColumns = (data) => {
        console.log(data);

        try {
            setIsLoading(true);
            setParsedData(data);

            // Extract column names from the first data item
            if (Array.isArray(data) && data.length > 0) {
                const firstItem = data[0];

                // Extract all unique columns across the dataset
                const columnSet = new Set();
                data.forEach(item => {
                    Object.keys(item).forEach(key => columnSet.add(key));
                });

                const columns = Array.from(columnSet);
                setAvailableColumns(columns);

                // Auto-select first two columns that seem most appropriate
                if (columns.length >= 2) {
                    // Try to find columns that might be good for X and Y axes
                    const possibleXColumns = columns.filter(col =>
                        col.toLowerCase().includes('name') ||
                        col.toLowerCase().includes('category') ||
                        col.toLowerCase().includes('date') ||
                        col.toLowerCase().includes('label') ||
                        col.toLowerCase() === 'key' ||
                        col.toLowerCase() === 'id'
                    );

                    const possibleYColumns = columns.filter(col => {
                        // Try to determine numeric columns
                        const sampleValue = data.find(item => item[col] !== undefined)?.[col];
                        return (
                            col.toLowerCase().includes('value') ||
                            col.toLowerCase().includes('count') ||
                            col.toLowerCase().includes('amount') ||
                            col.toLowerCase().includes('total') ||
                            (sampleValue !== undefined && !isNaN(Number(sampleValue)))
                        );
                    });

                    // Set X-axis
                    if (possibleXColumns.length > 0) {
                        setSelectedXAxis(possibleXColumns[0]);
                    } else {
                        setSelectedXAxis(columns[0]);
                    }

                    // Set Y-axis
                    if (possibleYColumns.length > 0) {
                        setSelectedYAxis(possibleYColumns[0]);
                    } else {
                        // If no obvious Y column, pick the second column, or the first if only one exists
                        setSelectedYAxis(columns.length > 1 ? columns[1] : columns[0]);
                    }
                } else if (columns.length === 1) {
                    setSelectedXAxis(columns[0]);
                    setSelectedYAxis(columns[0]);
                }
            }
        } catch (err) {
            console.error('Error processing data columns:', err);
            setError('Failed to process data columns');
        } finally {
            setIsLoading(false);
        }
    };
    // console.log(availableColumns);
    console.log(parsedData);
    // Convert parsed data to the format needed for charts
    const prepareChartData = () => {
        try {
            setIsLoading(true);
            setError('');

            if (!parsedData || parsedData.length === 0) {
                setError('No data available for visualization');
                setIsLoading(false);
                return;
            }

            let labels = [];
            let datasets = [];
            let values = [];

            // Extract data for the selected axes
            labels = parsedData.map(item => {
                const value = item[selectedXAxis];
                // Handle undefined/null values
                if (value === undefined || value === null) return 'N/A';

                // Convert dates to readable format if it looks like a date
                if (value instanceof Date) {
                    return value.toLocaleDateString();
                }

                // Handle other types
                return String(value);
            });

            // Extract numeric values for Y-axis
            values = parsedData.map(item => {
                const val = item[selectedYAxis];
                if (val === undefined || val === null) return 0;
                if (typeof val === 'number') return val;

                const numVal = Number(val);
                return isNaN(numVal) ? 0 : numVal;
            });

            // Generate colors based on the selected scheme
            const colors = generateChartColors(labels.length, colorScheme);

            datasets = [{
                label: selectedYAxis,
                data: values,
                backgroundColor: chartType === 'line' ? colors.border : colors.bg,
                borderColor: colors.border,
                borderWidth: 1,
                tension: chartType === 'line' ? 0.4 : 0, // Add some smoothing to line charts
                fill: chartType === 'line' ? false : true,
            }];

            setChartData({
                labels,
                datasets
            });

        } catch (err) {
            console.error('Error preparing chart data:', err);
            setError('Failed to prepare chart data: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Generate colors for chart elements based on selected scheme
    const generateChartColors = (count, scheme) => {
        const bgColors = [];
        const borderColors = [];

        for (let i = 0; i < count; i++) {
            let hue, saturation, lightness;

            switch (scheme) {
                case 'cool':
                    hue = 180 + (i * 60) % 180; // Blues to greens (180-360)
                    saturation = 70;
                    lightness = 60;
                    break;
                case 'warm':
                    hue = (i * 30) % 90; // Reds to yellows (0-90)
                    saturation = 80;
                    lightness = 55;
                    break;
                case 'rainbow':
                    hue = (i * 40) % 360; // Full rainbow
                    saturation = 80;
                    lightness = 60;
                    break;
                default: // 'default'
                    hue = (i * 137.5) % 360; // Golden angle for nice distribution
                    saturation = 70;
                    lightness = 60;
            }

            bgColors.push(`hsla(${hue}, ${saturation}%, ${lightness}%, 0.7)`);
            borderColors.push(`hsla(${hue}, ${saturation}%, ${lightness - 10}%, 0.9)`);
        }

        return { bg: bgColors, border: borderColors };
    };

    // Handle download as PNG
    const downloadAsPng = () => {
        if (!chartRef.current) return;

        import('html2canvas').then(html2canvasModule => {
            const html2canvas = html2canvasModule.default;
            const element = chartRef.current.canvas;

            if (!element) return;

            html2canvas(element).then(canvas => {
                const link = document.createElement('a');
                link.download = `${selectedHistoryItem?.filename || 'chart'}-${new Date().toISOString()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        });
    };

    // Get chart options based on chart type
    const getChartOptions = () => {
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: chartType === 'pie' ? 'right' : 'top',
                },
                title: {
                    display: true,
                    text: `${selectedXAxis} vs ${selectedYAxis}`,
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                }
            }
        };

        if (chartType !== 'pie') {
            return {
                ...baseOptions,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: selectedXAxis
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 0
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: selectedYAxis
                        },
                        beginAtZero: true
                    }
                }
            };
        }

        return baseOptions;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Chart Visualization
                </h2>
                {chartData && (
                    <button
                        onClick={downloadAsPng}
                        className="flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm transition-colors"
                    >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                    </button>
                )}
            </div>

            {/* Chart Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* X-Axis Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        X-Axis
                    </label>
                    <select
                        value={selectedXAxis}
                        onChange={(e) => setSelectedXAxis(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        disabled={isLoading || !availableColumns.length}
                    >
                        {availableColumns.map((column) => (
                            <option key={column} value={column}>
                                {column}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Y-Axis Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Y-Axis
                    </label>
                    <select
                        value={selectedYAxis}
                        onChange={(e) => setSelectedYAxis(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        disabled={isLoading || !availableColumns.length}
                    >
                        {availableColumns.map((column) => (
                            <option key={column} value={column}>
                                {column}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Chart Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Chart Type
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                        <button
                            type="button"
                            onClick={() => setChartType('bar')}
                            className={`flex items-center justify-center px-2 py-2 rounded-md ${chartType === 'bar'
                                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <BarChart className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setChartType('line')}
                            className={`flex items-center justify-center px-2 py-2 rounded-md ${chartType === 'line'
                                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <LineChart className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setChartType('pie')}
                            className={`flex items-center justify-center px-2 py-2 rounded-md ${chartType === 'pie'
                                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <PieChart className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Color Scheme Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Color Scheme
                    </label>
                    <select
                        value={colorScheme}
                        onChange={(e) => setColorScheme(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                        <option value="default">Default</option>
                        <option value="cool">Cool</option>
                        <option value="warm">Warm</option>
                        <option value="rainbow">Rainbow</option>
                    </select>
                </div>
            </div>

            {/* Chart Display Area */}
            <div className="w-full mt-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64 text-red-500">
                        <p>{error}</p>
                    </div>
                ) : chartData ? (
                    <div className="w-full h-64 md:h-96">
                        {chartType === 'bar' && (
                            <Bar
                                ref={chartRef}
                                data={chartData}
                                options={getChartOptions()}
                            />
                        )}
                        {chartType === 'line' && (
                            <Line
                                ref={chartRef}
                                data={chartData}
                                options={getChartOptions()}
                            />
                        )}
                        {chartType === 'pie' && (
                            <Pie
                                ref={chartRef}
                                data={chartData}
                                options={getChartOptions()}
                            />
                        )}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
                        <p>Select a file and configure chart options to visualize data</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChartVisualization;