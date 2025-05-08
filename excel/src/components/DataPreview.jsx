import { Info } from 'lucide-react';

/**
 * Component to display a preview of the uploaded Excel data
 * 
 * @param {Object} props - Component props
 * @param {Array} props.dataPreview - Array of data objects from the first few rows of the Excel file
 * @returns {JSX.Element|null} - The data preview component or null if no data is available
 */
export default function DataPreview({ dataPreview }) {
    // If no data preview or empty array, return null (don't render anything)
    if (!dataPreview || dataPreview.length === 0) return null;

    // Get all column names from the first row
    const columns = Object.keys(dataPreview[0]);

    return (
        <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2 text-indigo-600" />
                Data Preview (first 5 rows)
            </h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 text-sm">
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {dataPreview.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={`${rowIndex}-${colIndex}`}
                                        className="px-3 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300"
                                    >
                                        {row[column] !== undefined ? String(row[column]) : 'N/A'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}