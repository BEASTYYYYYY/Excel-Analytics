
import { SunIcon, MoonIcon,  BellIcon} from "@heroicons/react/24/solid";
import { useEffect, useState} from "react";
import logo from "../assets/logo.jpeg";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);


  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) setIsDarkMode(true);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setIsDarkMode(true);
    else if (savedTheme === 'light') setIsDarkMode(false);
  }, []);

  
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
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

        
      </div>
    </header>
  );
};

export default Navbar;