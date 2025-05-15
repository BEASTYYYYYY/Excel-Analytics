import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    UserCircleIcon,
    TableCellsIcon,
    BellIcon,
    ArrowUpTrayIcon,
    ChartBarIcon,
    BoltIcon
} from '@heroicons/react/24/solid';

const Sidebar = () => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(() => {
        // Set active item based on current path
        const path = location.pathname.toLowerCase();
        if (path.includes('profile')) return 'profile';
        if (path.includes('uploadhistory')) return 'uploadhistory';
        if (path.includes('chartvisualization')) return 'chartvisualization';
        if (path.includes('notifications')) return 'notifications';
        if (path.includes('aiinsights')) return 'aiinsights';
        return 'dashboard';
    });

    const navItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: <HomeIcon className="h-5 w-5" />,
            id: 'dashboard'
        },
        {
            name: 'Upload History',
            path: '/uploadhistory',
            icon: <ArrowUpTrayIcon className="h-5 w-5" />,
            id: 'uploadhistory'
        },
        {
            name: 'Chart Visualization',
            path: '/chartvisualization',
            icon: <ChartBarIcon className="h-5 w-5" />,
            id: 'chartvisualization'
        },
        {
            name: 'Profile',
            path: '/profile',
            icon: <UserCircleIcon className="h-5 w-5" />,
            id: 'profile'
        },
        {
            name: 'AI Insights',
            path: '/aiinsights',
            icon: <BoltIcon className="h-5 w-5" />,
            id: 'aiinsights'
        }
    ];

    const authPages = [
        {
            name: 'Sign In',
            path: '/login',
            icon: <UserCircleIcon className="h-5 w-5" />
        },
        {
            name: 'Sign Up',
            path: '/signup',
            icon: <UserCircleIcon className="h-5 w-5" />
        }
    ];

    return (
        <div className="h-full bg-white dark:bg-gray-900 w-64 shadow-lg flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Material Tailwind React</h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={`flex items-center p-3 rounded-lg transition-colors duration-200 
              ${activeItem === item.id
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        onClick={() => setActiveItem(item.id)}
                    >
                        <span className={`mr-3 ${activeItem === item.id ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            {item.icon}
                        </span>
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                    AUTH PAGES
                </h2>
                <div className="space-y-1">
                    {authPages.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className="flex items-center p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                        >
                            <span className="mr-3 text-gray-500 dark:text-gray-400">{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;