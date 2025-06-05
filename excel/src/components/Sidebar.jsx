/* eslint-disable no-unused-vars */
import { NavLink } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
    HomeIcon,
    UserCircleIcon,
    TableCellsIcon,
    BellIcon,
    ShieldCheckIcon
} from "@heroicons/react/24/solid";
import {
    ArrowLeftEndOnRectangleIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    ChevronUpIcon
} from "@heroicons/react/24/outline";

const Sidebar = ({ activeColorClass, sidebarStyle = "bg-white text-gray-900" }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setDropdownOpen(prev => !prev);

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            dispatch(logout());
            navigate("/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const handleEditProfile = () => {
        navigate("/profile");
        setDropdownOpen(false);
    };

    const handleAccountSettings = () => {
        navigate("/settings");
        setDropdownOpen(false);
    };

    const handleSupport = () => {
        navigate("/support");
        setDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const resolvedActiveColorClass = activeColorClass || "from-[#1f1f1f] to-[#3a3a3a]";

    const getTextColorForBackground = (gradientClass) => {
        return gradientClass.includes("gray-100") ? "text-black" : "text-white";
    };

    const navItems = [
        { to: "/dashboard", icon: HomeIcon, label: "Dashboard" },
        { to: "/UploadHistory", icon: TableCellsIcon, label: "Upload History" },
        { to: "/playground", icon: BellIcon, label: "Playground" },
        { to: "/admin", icon: ShieldCheckIcon, label: "Admin Dashboard" },

    ];

    const isDarkSidebar = !sidebarStyle.includes("bg-white") && !sidebarStyle.includes("bg-transparent");

    return (
        <aside
            className={`${sidebarStyle} fixed inset-0 z-40 my-6 ml-6 h-[calc(100vh-48px)] w-72 rounded-2xl transition-all duration-300 xl:translate-x-0 backdrop-blur-xl border border-gray-200/20 shadow-2xl hover:shadow-3xl`}
            style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
        >
            {/* Header */}
            <div className="px-6 py-8 border-b border-gray-200/10">
                <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
                    Excelwiz
                </h2>
            </div>

            {/* Navigation */}
            <nav className="px-4 py-6 space-y-2 flex-1 overflow-y-auto">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={label}
                        to={to}
                        className={({ isActive }) => {
                            const base = `group flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm relative overflow-hidden`;
                            if (isActive) {
                                const textColor = getTextColorForBackground(resolvedActiveColorClass);
                                return `${base} bg-gradient-to-r ${resolvedActiveColorClass} ${textColor} shadow-lg transform scale-[1.02] ring-2 ring-white/20`;
                            }
                            return `${base} ${isDarkSidebar ? "text-gray-400 hover:text-white" : "text-gray-700 hover:text-gray-900"} hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:scale-[1.01] hover:shadow-md`;
                        }}
                    >
                        <Icon className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
                        <span className="flex-1">{label}</span>
                        {/* Subtle glow effect for active items */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </NavLink>
                ))}
            </nav>

            {/* User Profile Section - Improved */}
            {user && (
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="relative" ref={dropdownRef}>
                        {/* Enhanced Dropdown */}
                        {dropdownOpen && (
                            <div className="absolute bottom-full left-0 right-0 mb-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/20 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
                                {/* User Info Header */}
                                <div className="px-4 py-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-700/50 dark:to-gray-600/50 border-b border-gray-200/20">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-white/30 shadow-lg">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <UserCircleIcon className="h-6 w-6 text-white" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">
                                                {user.displayName || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="py-2">
                                    <button
                                        onClick={handleEditProfile}
                                        className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-blue-50/70 dark:hover:bg-gray-700/70 transition-colors duration-150 group"
                                    >
                                        <UserCircleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white font-medium">
                                            Edit Profile
                                        </span>
                                    </button>

                                    <button
                                        onClick={handleAccountSettings}
                                        className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-blue-50/70 dark:hover:bg-gray-700/70 transition-colors duration-150 group"
                                    >
                                        <Cog6ToothIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white font-medium">
                                            Account Settings
                                        </span>
                                    </button>

                                    <button
                                        onClick={handleSupport}
                                        className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-blue-50/70 dark:hover:bg-gray-700/70 transition-colors duration-150 group"
                                    >
                                        <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white font-medium">
                                            Help & Support
                                        </span>
                                    </button>
                                </div>

                                {/* Logout Section */}
                                <div className="border-t border-gray-200/20 pt-2 pb-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-red-50/70 dark:hover:bg-red-900/20 transition-colors duration-150 group"
                                    >
                                        <ArrowLeftEndOnRectangleIcon className="h-5 w-5 text-red-500 group-hover:text-red-600 transition-colors flex-shrink-0" />
                                        <span className="text-sm text-red-500 group-hover:text-red-600 font-medium">
                                            Sign Out
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Improved Profile Button */}
                        <button
                            onClick={toggleDropdown}
                            className={`w-full flex items-center p-4 rounded-xl transition-all duration-200 hover:shadow-lg backdrop-blur-sm border group ${isDarkSidebar
                                    ? 'bg-gray-800/50 hover:bg-gray-700/70 border-gray-700/50 hover:border-gray-600/50'
                                    : 'bg-gray-50/80 hover:bg-gray-100/90 border-gray-200/50 hover:border-gray-300/50'
                                }`}
                        >
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-white/20 shadow-lg flex-shrink-0">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserCircleIcon className="h-7 w-7 text-white" />
                                )}
                            </div>
                            <div className="ml-3 flex-1 text-left min-w-0">
                                <div className={`block font-semibold text-sm truncate ${isDarkSidebar ? "text-white" : "text-gray-900"}`}>
                                    {user.displayName?.split(' ')[0] || 'User'}
                                </div>
                                <div className={`block text-xs truncate mt-0.5 ${isDarkSidebar ? "text-gray-300" : "text-gray-600"}`}>
                                    {user.email}
                                </div>
                            </div>
                            <div className={`transition-transform duration-200 flex-shrink-0 ml-2 ${dropdownOpen ? 'rotate-180' : ''}`}>
                                <ChevronUpIcon className={`w-5 h-5 ${isDarkSidebar ? "text-gray-400 group-hover:text-gray-300" : "text-gray-500 group-hover:text-gray-700"}`} />
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;