import React from 'react';
import { BarChart3, LayoutDashboard, Users, Settings, Upload, Key, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
    // const location = useLocation();

    const sidebarItems = [
        { name: 'Dashboard', to: '/admin', icon: LayoutDashboard },
        { name: 'Upload Stats', to: '/admin/upload-stats', icon: BarChart3 },
        { name: 'Recent Uploads', to: '/admin/uploads', icon: Upload },
        { name: 'API Keys', to: '/admin/api-keys', icon: Key },
        { name: 'Settings', to: '/admin/settings', icon: Settings },
    ];

    return (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin</h2>
                </div>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <nav className="p-4 space-y-2">
                {sidebarItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.to}
                        end={item.to === '/admin'}
                        className={({ isActive }) => `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                                <span className="font-medium">{item.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default AdminSidebar;