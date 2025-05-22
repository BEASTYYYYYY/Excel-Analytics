// src/admin/components/AdminKeySection.jsx
import React, { useState } from 'react';
import { Key, Eye, EyeOff, RefreshCw, Copy, Shield } from 'lucide-react';

const AdminKeySection = ({ adminKey }) => {
    const [showKey, setShowKey] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRegenerate = async () => {
        setIsRegenerating(true);
        // Simulate API call
        setTimeout(() => {
            setIsRegenerating(false);
            alert('Admin key regenerated successfully!');
        }, 2000);
    };

    const handleCopyKey = async () => {
        try {
            await navigator.clipboard.writeText(adminKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy key:', err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Key Management</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Secure API key for administrative access</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                            <Key className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Key</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Used for administrative operations</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-sm font-medium rounded-full">
                            Active
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                {showKey ? (
                                    <div className="font-mono text-sm text-gray-900 dark:text-white break-all select-all">
                                        {adminKey}
                                    </div>
                                ) : (
                                    <div className="font-mono text-sm text-gray-500 dark:text-gray-400">
                                        {'•'.repeat(32)}...{adminKey?.slice(-4) || '••••'}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                    title={showKey ? 'Hide key' : 'Show key'}
                                >
                                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                {showKey && (
                                    <button
                                        onClick={handleCopyKey}
                                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                        title={copied ? 'Copied!' : 'Copy key'}
                                    >
                                        <Copy className={`w-4 h-4 ${copied ? 'text-green-500' : ''}`} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Last regenerated</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">3 days ago</p>
                        </div>
                        <button
                            onClick={handleRegenerate}
                            disabled={isRegenerating}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                            <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Key'}</span>
                        </button>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">Security Warning</h4>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                Keep this key secure and never share it publicly. Regenerating will invalidate the current key immediately.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminKeySection;