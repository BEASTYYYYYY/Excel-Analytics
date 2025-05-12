import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function ExcelAxisSelector({ data, xAxis, yAxis, onXAxisChange, onYAxisChange }) {
    const [xDropdownOpen, setXDropdownOpen] = useState(false);
    const [yDropdownOpen, setYDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Extract columns from data
    const getColumnHeaders = () => {
        // Check if data is an array of objects (properly parsed Excel file)
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
            return Object.keys(data[0] || {});
        }

        // If data is an object (like in the parsedData format in FileUploadHistory)
        if (data && typeof data === 'object' && !Array.isArray(data)) {
            return ["Category", "Value"]; // Default headers for object-style data
        }

        return [];
    };

    const columnHeaders = getColumnHeaders();

    // Determine data type for each column (for better rendering)
    const getColumnType = (columnName) => {
        // For array-style data
        if (Array.isArray(data) && data.length > 0) {
            for (const item of data) {
                if (item[columnName] !== undefined && item[columnName] !== null) {
                    const value = item[columnName];
                    if (typeof value === 'number') return 'number';
                    if (typeof value === 'string') {
                        // Check if it might be a date
                        if (!isNaN(Date.parse(value))) return 'date';
                    }
                    return typeof value;
                }
            }
        }

        // For object-style data
        if (columnName === "Category") return "text";
        if (columnName === "Value") return "number";

        return 'text';
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setXDropdownOpen(false);
                setYDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg" ref={dropdownRef}>
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    X-Axis (Categories)
                </label>
                <div className="relative">
                    <button
                        onClick={() => {
                            setXDropdownOpen(!xDropdownOpen);
                            setYDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <span>{xAxis || 'Select column'}</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>

                    {xDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                            <ul className="py-1">
                                {columnHeaders.map((header) => (
                                    <li
                                        key={header}
                                        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center justify-between"
                                        onClick={() => {
                                            onXAxisChange(header);
                                            setXDropdownOpen(false);
                                        }}
                                    >
                                        <span>{header}</span>
                                        <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                                            {getColumnType(header)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Choose categories for the horizontal axis
                </p>
            </div>

            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Y-Axis (Values)
                </label>
                <div className="relative">
                    <button
                        onClick={() => {
                            setYDropdownOpen(!yDropdownOpen);
                            setXDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <span>{yAxis || 'Select column'}</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>

                    {yDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                            <ul className="py-1">
                                {columnHeaders.map((header) => (
                                    <li
                                        key={header}
                                        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center justify-between"
                                        onClick={() => {
                                            onYAxisChange(header);
                                            setYDropdownOpen(false);
                                        }}
                                    >
                                        <span>{header}</span>
                                        <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                                            {getColumnType(header)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Choose numeric values for the vertical axis
                </p>
            </div>
        </div>
    );
}