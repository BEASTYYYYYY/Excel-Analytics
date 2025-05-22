/* eslint-disable no-unused-vars */
// ✅ FINAL FIXED FILE: Sidebar.jsx
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
} from "@heroicons/react/24/solid";
import { ArrowLeftEndOnRectangleIcon, Cog6ToothIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

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

    return (
        <aside className={`${sidebarStyle} shadow-sm fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-gray-800`}>
            <h2 className="text-xl font-semibold text-center pb-8 m-6">Excelwiz</h2>

            <nav className="space-y-2 m-4">
                {[
                    { to: "/dashboard", icon: HomeIcon, label: "Dashboard" },
                    { to: "/UploadHistory", icon: TableCellsIcon, label: "Upload History" },
                    { to: "/playground", icon: BellIcon, label: "Playground" },
                ].map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={label}
                        to={to}
                        className={({ isActive }) => {
                            const base = `flex items-center align-middle px-4 rounded-lg py-3 transition-all font-medium text-md`;
                            if (isActive) {
                                const textColor = getTextColorForBackground(resolvedActiveColorClass);
                                return `${base} bg-gradient-to-r ${resolvedActiveColorClass} ${textColor} shadow-md hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize`;
                            }
                            return `${base}${sidebarStyle.includes("bg-white") || sidebarStyle.includes("bg-transparent") ? "text-gray-900" : "text-gray-400"} hover:bg-gray-300 hover:text-gray-900 dark:hover:bg-gray-800`;
                        }}
                    >
                        <Icon className="w-5 h-5 mr-3" /> {label}
                    </NavLink>
                ))}

                {user && (
                    <div className="relative mt-70" ref={dropdownRef}>
                        <button onClick={toggleDropdown} className="flex items-center space-x-1">
                            <div className="w-12 h-12 ml-4 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={<UserCircleIcon className="h-7 w-7 text-white" />} className="w-full h-full object-cover" />
                                ) : (
                                    <UserCircleIcon className="h-7 w-7 text-white" />
                                )}
                            </div>
                            <span className={`ml-1 font-medium text-lg hidden md:inline-block ${sidebarStyle.includes("bg-white") || sidebarStyle.includes("bg-transparent") ? "text-gray-900" : "text-white"}`}>
                                {user.displayName?.split(' ')[0] || 'User'}
                            </span>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 left-0 bottom-15 mt-2 w-60 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                    <p className="font-medium text-lg text-gray-800 dark:text-white">{user.displayName || 'User'}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                </div>

                                <div className="py-1">
                                    <button onClick={handleEditProfile} className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <div className="w-4 h-4 ml-4 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt={<UserCircleIcon className="h-4 w-4 text-white" />} className="h-4 w-4 object-cover" />
                                            ) : (
                                                    <UserCircleIcon className={`h-7 w-7 ${sidebarStyle.includes('bg-white') || sidebarStyle.includes('bg-transparent') ? 'text-gray-800' : 'text-gray-500'}`} />
                                            )}
                                        </div>
                                        
                                        <span className="text-gray-700 dark:text-gray-300">Edit profile</span>
                                    </button>

                                    <button onClick={handleAccountSettings} className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <Cog6ToothIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <span className="text-gray-700 dark:text-gray-300">Account settings</span>
                                    </button>

                                    <button onClick={handleSupport} className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <span className="text-gray-700 dark:text-gray-300">Support</span>
                                    </button>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 mt-1">
                                    <button onClick={handleLogout} className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 dark:text-red-400">
                                        <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />
                                        <span>Sign out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;
