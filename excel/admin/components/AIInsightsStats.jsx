// src/admin/components/AIInsightsStats.jsx
import React from 'react';

const AIInsightsStats = ({ insightsRequested, failedRequests }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">AI Insights Requested</h3>
            <p className="text-2xl text-gray-900 dark:text-white">{insightsRequested}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Failed Insight Attempts</h3>
            <p className="text-2xl text-gray-900 dark:text-white">{failedRequests}</p>
        </div>
    </div>
);

export default AIInsightsStats;
