import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';

// Register ChartJS components once at the application level
// This prevents multiple registrations and helps with cleanup
ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Configure Chart.js global defaults
ChartJS.defaults.font.family = "'Inter', sans-serif";
ChartJS.defaults.color = '#6B7280'; // text color
ChartJS.defaults.borderColor = 'rgba(209, 213, 219, 0.5)'; // grid lines

// Explicitly unregister all chart types and components when needed
export const unregisterChartComponents = () => {
    // This can be called when needed to reset Chart.js global state
    // For example, you might call this in your app's cleanup or hot reload handling
    ChartJS.unregister( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
};

// Optional function to destroy all chart instances 
// Useful for cleaning up in development with hot reloading or in testing
export const destroyAllChartInstances = () => {
    // Find all Chart instances that might still be in memory
    const chartInstances = ChartJS.instances;
    Object.keys(chartInstances).forEach(key => {
        const instance = chartInstances[key];
        if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
        }
    });
};