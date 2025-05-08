import { useState } from 'react';
import { ChevronRight, BarChart2, FileSpreadsheet, Download, History, Brain, Check } from 'lucide-react';

export default function AboutPage() {
    const [activeFeature, setActiveFeature] = useState(0);

    // This would normally use react-router, but we're using simple functions for demo
    const navigateToDashboard = () => {
        window.location.href = "/Dashboard"; // This is a placeholder for navigation
        // In a real app: window.location.href = "/dashboard"; or use router
    };

    const navigateToContact = () => {
        window.location.href = "/ContactPage"; // This is a placeholder for navigation
        // In a real app: window.location.href = "/contact"; or use router
    };

    const features = [
        {
            icon: <FileSpreadsheet className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />,
            title: "Excel File Upload",
            description: "Upload and parse Excel files (.xls, .xlsx) with ease. Our powerful parsing engine handles large files efficiently."
        },
        {
            icon: <BarChart2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />,
            title: "Dynamic Charts",
            description: "Create interactive 2D and 3D visualizations. Choose from bar, line, pie, scatter plots and advanced 3D column charts."
        },
        {
            icon: <Download className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />,
            title: "Export Anywhere",
            description: "Download your created charts as PNG or PDF files to use in presentations, reports, or share with colleagues."
        },
        {
            icon: <History className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />,
            title: "Analysis History",
            description: "Access your complete history of uploaded files and generated visualizations from your personal dashboard."
        },
        {
            icon: <Brain className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />,
            title: "AI Insights",
            description: "Get intelligent summaries and insights from your data through our integrated AI tools."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10 dark:opacity-20"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full opacity-10 blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-3xl"></div>

                <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="w-full md:w-1/2 md:pr-12">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                Excel Analytics Platform
                            </h1>
                            <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300">
                                Transform your Excel data into powerful interactive visualizations. Analyze, chart, and share insights from your spreadsheets with just a few clicks.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={navigateToDashboard}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 dark:shadow-indigo-500/30 transition-all group"
                                >
                                    Go to Dashboard
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={navigateToContact}
                                    className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg flex items-center justify-center gap-2 transition-all"
                                >
                                    Contact Us
                                </button>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 mt-12 md:mt-0">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-20 rounded-2xl blur-md"></div>
                                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                                    <div className="h-10 bg-gray-100 dark:bg-gray-700 flex items-center px-4">
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg animate-pulse flex items-center justify-center">
                                            <BarChart2 className="w-16 h-16 text-indigo-600/50 dark:text-indigo-400/50" />
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full animate-pulse"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Our Excel Analytics Platform offers everything you need to transform your data into meaningful insights
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-lg">
                            <div className="h-64 overflow-hidden">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className={`transition-all duration-500 ${activeFeature === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute'}`}
                                        style={{ display: activeFeature === index ? 'block' : 'none' }}
                                    >
                                        <div className="flex justify-center mb-6">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-center mb-4">{feature.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-center">{feature.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center gap-2 mt-6">
                                {features.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveFeature(index)}
                                        className={`w-3 h-3 rounded-full transition-all ${activeFeature === index ? 'bg-indigo-600 dark:bg-indigo-400 w-6' : 'bg-gray-300 dark:bg-gray-700'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                "Upload any Excel file and transform it into interactive visualizations",
                                "Choose X and Y axes dynamically from your data columns",
                                "Generate multiple chart types from the same dataset",
                                "Access your upload history and previously created charts",
                                "Save and download your visualizations for reports and presentations"
                            ].map((item, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your data?</h2>
                    <p className="text-lg text-indigo-100 mb-10 max-w-2xl mx-auto">
                        Start creating beautiful visualizations from your Excel data today. No complex setup required.
                    </p>

                    <button
                        onClick={navigateToDashboard}
                        className="px-8 py-4 bg-white text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg flex items-center justify-center gap-2 mx-auto shadow-lg transition-all group"
                    >
                        Get Started Now
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}