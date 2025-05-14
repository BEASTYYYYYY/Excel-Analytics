import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { fetchFileContent } from './utils/api';
import * as XLSX from 'xlsx';

export default function ExcelFileViewerModal({ isOpen, onClose, fileId, fileName }) {
    const [fileContent, setFileContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSheet, setActiveSheet] = useState(0);

    useEffect(() => {
        if (isOpen && fileId) {
            loadFileContent();
        }
    }, [isOpen, fileId]);

    const loadFileContent = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Fetch the file content as an ArrayBuffer
            const content = await fetchFileContent(fileId);
            // Parse the Excel file
            const workbook = XLSX.read(content, { type: 'array' });
            // Process all sheets
            const sheets = workbook.SheetNames.map(sheetName => {
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                return { name: sheetName, data };
            });
            setFileContent(sheets);
            setActiveSheet(0); // Set first sheet as active by default
        } catch (err) {
            console.error('Error fetching file content:', err);
            setError(err.message || 'Failed to load file content');
        } finally {
            setIsLoading(false);
        }
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {fileName || 'Excel File Content'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {/* Sheet Tabs */}
                {fileContent && fileContent.length > 1 && (
                    <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
                        {fileContent.map((sheet, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 text-sm font-medium ${activeSheet === index
                                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                                        : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                                onClick={() => setActiveSheet(index)}
                            >
                                {sheet.name}
                            </button>
                        ))}
                    </div>
                )}
                {/* Content */}
                <div className="flex-1 overflow-auto p-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center p-4">
                            {error}
                        </div>
                    ) : fileContent && fileContent.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {fileContent[activeSheet].data.map((row, rowIndex) => (
                                        <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}>
                                            {row.map((cell, cellIndex) => {
                                                // Determine if this is a header cell
                                                const isHeader = rowIndex === 0;
                                                const CellTag = isHeader ? 'th' : 'td';

                                                return (
                                                    <CellTag
                                                        key={cellIndex}
                                                        className={`px-6 py-4 text-sm ${isHeader
                                                                ? 'font-medium text-gray-900 dark:text-white'
                                                                : 'text-gray-700 dark:text-gray-300'
                                                            } border-r last:border-r-0 border-gray-200 dark:border-gray-700`}
                                                    >
                                                        {cell !== null && cell !== undefined ? cell.toString() : ''}
                                                    </CellTag>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                            No data found in the Excel file.
                        </div>
                    )}
                </div>
                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}