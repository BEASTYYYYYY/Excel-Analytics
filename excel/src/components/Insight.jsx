/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAIInsight } from './utils/api'; // adjust if path differs

export default function Insight() {
    const { fileId } = useParams();
    const [rawInsight, setRawInsight] = useState('');
    const [processedInsights, setProcessedInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    // Process the raw insight data into a structured format
    const processInsightData = (data) => {
        try {
            // Try to parse as JSON if it's a JSON string
            let insightData = typeof data === 'string' ?
                (data.trim().startsWith('{') || data.trim().startsWith('[') ? JSON.parse(data) : data) :
                data;

            // If data is still a string (not JSON), try to extract insights using patterns
            if (typeof insightData === 'string') {
                // Convert string insights into structured format using regex or string parsing
                const insights = [];

                // Example pattern detection - looking for key-value patterns
                // This is a simple example - you'd adapt this to your actual data format
                const lines = insightData.split('\n').filter(line => line.trim() !== '');

                let currentCategory = 'General';

                lines.forEach(line => {
                    // Clean up line from asterisks first
                    const cleanLine = line.trim();

                    // Check if line looks like a category/header
                    if (cleanLine.endsWith(':') && !cleanLine.includes(':', 1)) {
                        currentCategory = cleanLine.replace(':', '');
                        return;
                    }

                    // Check if line starts with a number or asterisks and numbers (likely a heading)
                    // Matches patterns like: "**1. Heading", "*1. Heading", "1. Heading"
                    const headingMatch = cleanLine.match(/^(\*+)?\s*(\d+)\.\s+(.+)$/);
                    if (headingMatch) {
                        const headingText = headingMatch[3].replace(/\*+/g, '').trim();
                        insights.push({
                            category: currentCategory,
                            key: headingText,
                            value: '',
                            importance: 'heading',
                            isHeading: true
                        });
                        return;
                    }

                    // Check for subheadings with asterisks like "* **Uniform Salary"
                    const subheadingMatch = cleanLine.match(/^(\*+\s+)?\*+([^:]+)\*+$/);
                    if (subheadingMatch) {
                        const subheadingText = subheadingMatch[2].trim();
                        insights.push({
                            category: currentCategory,
                            key: subheadingText,
                            value: '',
                            importance: 'medium',
                            isHeading: true,
                            isSubheading: true
                        });
                        return;
                    }

                    // Try to identify key-value pairs, ignoring asterisks in the key
                    const keyValueMatch = cleanLine.match(/^(\*+\s+)?([^:]+):\s*(.+)$/);
                    if (keyValueMatch) {
                        // Remove any asterisks from the key
                        const key = keyValueMatch[2].replace(/\*+/g, '').trim();
                        const value = keyValueMatch[3].trim();

                        // Check if it looks like a subheading with value
                        if (key.startsWith('*') || (keyValueMatch[1] && keyValueMatch[1].includes('*'))) {
                            const cleanKey = key.replace(/\*/g, '').trim();
                            insights.push({
                                category: currentCategory,
                                key: cleanKey,
                                value: value,
                                importance: determineImportance(cleanKey, value),
                                isHeading: false,
                                isSubheading: true
                            });
                        } else {
                            insights.push({
                                category: currentCategory,
                                key: key,
                                value: value,
                                importance: determineImportance(key, value),
                                isHeading: false
                            });
                        }
                    } else if (cleanLine) {
                        // If not a key-value pair but has content, add as observation
                        // Remove asterisks from the value
                        const cleanValue = cleanLine.replace(/\*+/g, '').trim();
                        insights.push({
                            category: currentCategory,
                            key: 'Observation',
                            value: cleanValue,
                            importance: 'medium',
                            isHeading: false
                        });
                    }
                });

                return insights.length > 0 ? insights : [{
                    category: 'Raw Data',
                    key: 'Content',
                    value: insightData,
                    importance: 'medium',
                    isHeading: false
                }];
            }

            // If data is already an object or array
            if (Array.isArray(insightData)) {
                return insightData.map(item => {
                    // Ensure each item has the expected structure
                    return {
                        category: item.category || 'Uncategorized',
                        key: item.key || item.name || 'Item',
                        value: item.value || item.description || JSON.stringify(item),
                        importance: item.importance || determineImportance(item.key, item.value),
                        isHeading: !!item.isHeading
                    };
                });
            } else if (typeof insightData === 'object') {
                // Convert object to array of insights
                return Object.entries(insightData).map(([key, value]) => ({
                    category: 'Main Insights',
                    key,
                    value: typeof value === 'object' ? JSON.stringify(value) : String(value),
                    importance: determineImportance(key, value),
                    isHeading: false
                }));
            }

            // Fallback for unknown data format
            return [{
                category: 'Raw Data',
                key: 'Content',
                value: typeof insightData === 'object' ? JSON.stringify(insightData) : String(insightData),
                importance: 'medium',
                isHeading: false
            }];
        } catch (err) {
            console.error('Error processing insight data:', err);
            // Return the raw data as a single insight if processing fails
            return [{
                category: 'Raw Data',
                key: 'Content',
                value: String(data),
                importance: 'medium',
                isHeading: false
            }];
        }
    };

    // Helper function to determine importance level
    const determineImportance = (key, value) => {
        const keyLower = typeof key === 'string' ? key.toLowerCase() : '';
        const valueLower = typeof value === 'string' ? value.toLowerCase() : '';

        // Keywords that might indicate high importance
        if (
            keyLower.includes('critical') ||
            keyLower.includes('important') ||
            keyLower.includes('key') ||
            keyLower.includes('main') ||
            keyLower.includes('priority') ||
            (valueLower.includes('high') && (
                keyLower.includes('risk') ||
                keyLower.includes('impact')
            ))
        ) {
            return 'high';
        }

        // Keywords that might indicate low importance
        if (
            keyLower.includes('minor') ||
            keyLower.includes('additional') ||
            keyLower.includes('optional') ||
            valueLower.includes('low')
        ) {
            return 'low';
        }

        // Default importance
        return 'medium';
    };

    useEffect(() => {
        const loadInsight = async () => {
            try {
                const result = await fetchAIInsight(fileId);
                setRawInsight(result);
                const processed = processInsightData(result);
                setProcessedInsights(processed);
            } catch (err) {
                console.error(err);
                setError('Failed to load AI insight. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadInsight();
    }, [fileId]);

    // Get unique categories for filtering
    const categories = [
        'all',
        ...new Set(processedInsights.map(insight => insight.category))
    ];

    // Filter insights based on active tab
    const filteredInsights = activeTab === 'all'
        ? processedInsights
        : processedInsights.filter(insight => insight.category === activeTab);

    // Get importance color class
    const getImportanceColor = (importance) => {
        switch (importance) {
            case 'high': return 'text-red-700 dark:text-red-400';
            case 'low': return 'text-blue-700 dark:text-blue-400';
            case 'heading': return 'text-green-700 dark:text-green-400';
            default: return 'text-yellow-700 dark:text-yellow-400';
        }
    };

    // <div className="text-sm">
    //     File: <span className="bg-gray-700 px-2 py-1 rounded">{fileId}</span>
    // </div>

    return (
        <div className="relative ml-[20rem] mr-5 mt-15 flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
            <div className="relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-[#1f1f1f] to-[#3a3a3a] text-white shadow-gray-900/20 shadow-lg -mt-6 mb-8 p-6">
                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">
                   AI Insights
                </h6>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow">
                {loading && (
                    <div className="flex justify-center items-center p-12">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-16 w-16 mb-4 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin"></div>
                            <p className="text-gray-500 dark:text-gray-400">Generating insights...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-6">
                        <div className="flex items-center bg-red-100 text-red-700 p-4 rounded-lg">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* Category tabs */}
                        {categories.length > 1 && (
                            <div className="border-b border-gray-200 dark:border-gray-700">
                                <nav className="flex overflow-x-auto px-4">
                                    {categories.map(category => (
                                        <button
                                            key={category}
                                            onClick={() => setActiveTab(category)}
                                            className={`py-3 px-4 font-medium text-sm whitespace-nowrap ${activeTab === category
                                                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                                }`}
                                        >
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                            {category === 'all' && (
                                                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                    {processedInsights.length}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        )}

                        {/* Summary section for key metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Insights</p>
                                <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{processedInsights.length}</p>
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">High Importance</p>
                                <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">
                                    {processedInsights.filter(i => i.importance === 'high').length}
                                </p>
                            </div>
                        </div>

                        {/* Insights table */}
                        <div className="p-4">
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium">
                                    <div className="col-span-4">KEY</div>
                                    <div className="col-span-6">VALUE</div>
                                    <div className="col-span-2">IMPORTANCE</div>
                                </div>

                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredInsights.length > 0 ? (
                                        filteredInsights.map((insight, index) => (
                                            <div key={index} className={`grid grid-cols-12 gap-4 p-4 text-sm hover:bg-gray-50 dark:hover:bg-gray-750 ${insight.isHeading ? 'bg-gray-100 dark:bg-gray-700/50 font-semibold' : ''
                                                }`}>
                                                <div className={`${insight.isHeading ? 'col-span-12 text-lg text-blue-600 dark:text-blue-400' : 'col-span-4'} font-medium text-gray-800 dark:text-gray-200`}>
                                                    {insight.isHeading && (insight.isSubheading ? '• ' : '🔹 ')}{insight.key}
                                                </div>
                                                {!insight.isHeading && (
                                                    <>
                                                        <div className="col-span-6 text-gray-600 dark:text-gray-300">
                                                            {/* Remove any asterisks from the value display */}
                                                            {insight.value.replace(/\*+/g, '')}
                                                        </div>
                                                        <div className={`col-span-2 ${getImportanceColor(insight.importance)} capitalize`}>
                                                            {insight.importance !== 'heading' ? insight.importance : ''}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                            No insights found in this category
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Fallback to raw data if needed */}
                        {processedInsights.length === 0 && rawInsight && (
                            <div className="p-4">
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Raw Insight Data:</h3>
                                    <pre className="whitespace-pre-wrap text-xs text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
                                        {rawInsight}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}