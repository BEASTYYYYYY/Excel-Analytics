import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { SunIcon, MoonIcon, UserCircleIcon, BellIcon, Cog6ToothIcon, QuestionMarkCircleIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState, useRef } from "react";
import { getAuth, signOut } from "firebase/auth";
import logo from "../assets/logo.jpeg";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) setIsDarkMode(true);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setIsDarkMode(true);
    else if (savedTheme === 'light') setIsDarkMode(false);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

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
    // Navigate to account settings page
    navigate("/settings");
    setDropdownOpen(false);
  };

  const handleSupport = () => {
    // Navigate to support page
    navigate("/support");
    setDropdownOpen(false);
  };

  return (
    <header className="py-3 px-10 md:px-20 flex items-center justify-between bg-white dark:bg-gray-900 shadow-sm">
      <img src={logo} alt="Logo" className="w-10 h-10 object-cover rounded-full border" />
      <nav className="hidden md:flex space-x-6">
        <Link to="/Dashboard" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors duration-300 font-semibold dark:from-blue-400 dark:to-purple-400 dark:hover:from-blue-500 dark:hover:to-purple-500">
          DASHBOARD
        </Link>
        <Link to="/UploadHistory" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors duration-300 font-semibold dark:from-blue-400 dark:to-purple-400 dark:hover:from-blue-500 dark:hover:to-purple-500">
          UPLOAD HISTORY
        </Link>
        <Link to="/playground" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors duration-300 font-semibold dark:from-blue-400 dark:to-purple-400 dark:hover:from-blue-500 dark:hover:to-purple-500">
          PLAYGROUND
        </Link>
      </nav>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          {isDarkMode ? (
            <SunIcon className="h-5 w-5 text-yellow-500" />
          ) : (
            <MoonIcon className="h-5 w-5 text-gray-700" />
          )}
        </button>

        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>

        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-1"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="h-7 w-7 text-white" />
                )}
              </div>
              <span className="ml-1 text-gray-800 dark:text-gray-200 font-medium hidden md:inline-block">
                {user.displayName?.split(' ')[0] || 'User'}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-800 dark:text-white">{user.displayName || 'User'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={handleEditProfile}
                    className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <UserCircleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Edit profile</span>
                  </button>

                  <button
                    onClick={handleAccountSettings}
                    className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Cog6ToothIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Account settings</span>
                  </button>

                  <button
                    onClick={handleSupport}
                    className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Support</span>
                  </button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 dark:text-red-400"
                  >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;