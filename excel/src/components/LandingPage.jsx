/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import man from "../assets/man.png";

const LandingPage = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    const isAuthenticated = !!user;

    useEffect(() => {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            setIsDarkMode(true);
        }
        // Save theme preference to localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
        } else if (savedTheme === 'light') {
            setIsDarkMode(false);
        }
    }, []);

    // Apply the theme to the document element
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-sans">
            {/* Main Content Section */}
            <main className="relative pt-10">
                {/* Abstract Shapes (using divs and Tailwind) */}
                <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-purple-500 to-purple-800 opacity-50 blur-3xl -translate-x-1/4 -translate-y-1/4 dark:from-purple-700 dark:to-purple-900"></div>
                <div className="absolute top-1/4 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-pink-500 to-violet-500 opacity-50 blur-3xl translate-x-1/4 -translate-y-1/4 dark:from-pink-600 dark:to-violet-600"></div>
                <div className="absolute bottom-0 right-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 opacity-50 blur-3xl translate-x-1/2 translate-y-1/4 dark:from-yellow-500 dark:to-yellow-700"></div>

                <div className="container mx-auto px-10 md:px-20 py-20 flex flex-col md:flex-row items-center justify-between">
                    {/* Text Content */}
                    <div className="md:w-1/2 text-center md:text-left space-y-4 md:space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl md:text-6xl font-bold text-gray-800 bg-clip-text bg-gradient-to-r from-gray-800 to-black dark:text-white dark:from-gray-100 dark:to-gray-300">
                            Welcome to <span className="text-blue-500 dark:text-blue-400">ExcelWiz</span>
                        </motion.h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Excelwiz is a modern Excel analytics platform that lets you upload spreadsheets, choose data fields, and instantly generate stunning 2D/3D charts.
                            With secure user authentication, upload history, and export options, it's built for productivity and clarity.
                            Powered by the MERN stack and SheetJS, Excelwiz supports dynamic axis selection, interactive dashboards, and optional AI insights.
                        </p>
                        <button
                            onClick={handleGetStarted}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl dark:bg-blue-400 dark:hover:bg-blue-500">
                            Get Started <ArrowRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                    {/* Placeholder Image/Content */}
                    <div className="md:w-1/3 mt-10 md:mt-0 flex justify-center">
                        {/* You can replace this with an actual image or component */}
                        <div className="w-[320px] h-[450px] bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <img src={man} alt="Placeholder" className="w-full h-full object-cover rounded-full"></img>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;