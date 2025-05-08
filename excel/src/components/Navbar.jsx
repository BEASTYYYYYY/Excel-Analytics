import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { SunIcon, MoonIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth"; // ✅ Firebase auth
import logo from "../assets/logo.jpeg";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  // ✅ Firebase logout
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); // Firebase logout
      dispatch(logout());  // Redux cleanup
      navigate("/login");  // Redirect
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="py-3 px-10 md:px-20 flex items-center justify-between">
      <img src={logo} alt="Logo" className="w-18 h-18 object-cover rounded-full border" />
      <nav className="hidden md:flex space-x-6">
       
        <a href="/Dashboard" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors duration-300 font-semibold dark:from-blue-400 dark:to-purple-400 dark:hover:from-blue-500 dark:hover:to-purple-500">
          DASHBOARD
        </a>
        <a href="/AboutPage" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors duration-300 font-semibold dark:from-blue-400 dark:to-purple-400 dark:hover:from-blue-500 dark:hover:to-purple-500">
          ABOUT
        </a>
        <a href="/ContactPage" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors duration-300 font-semibold dark:from-blue-400 dark:to-purple-400 dark:hover:from-blue-500 dark:hover:to-purple-500">
          CONTACT US
        </a>
      </nav>
      <div className="flex items-center pr-4">
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300 flex items-center gap-2 dark:hover:bg-red-700 dark:bg-blue-500 transform hover:scale-105 shadow-md hover:shadow-lg">
            <UserCircleIcon className="w-5 h-5" />
            Logout
          </button>
        )}
        <button onClick={toggleTheme} className="ml-4 md:ml-6">
          {isDarkMode ? (
            <SunIcon className="h-6 w-6 text-white" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
