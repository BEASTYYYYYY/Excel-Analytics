import { useState } from "react";
import { useSelector } from "react-redux";

const Settings = () => {
    const { user } = useSelector((state) => state.auth);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [darkModeDefault, setDarkModeDefault] = useState(false);
    const [language, setLanguage] = useState("english");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle saving settings logic
        alert("Settings saved successfully!");
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    Please login to view your settings
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                Account Settings
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                            Notification Preferences
                        </h2>
                        <label className="flex items-center space-x-3 mb-3">
                            <input
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={() => setEmailNotifications(!emailNotifications)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                                Receive email notifications
                            </span>
                        </label>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                            Appearance
                        </h2>
                        <label className="flex items-center space-x-3 mb-3">
                            <input
                                type="checkbox"
                                checked={darkModeDefault}
                                onChange={() => setDarkModeDefault(!darkModeDefault)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                                Use dark mode by default
                            </span>
                        </label>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                            Language
                        </h2>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="english">English</option>
                            <option value="spanish">Spanish</option>
                            <option value="french">French</option>
                            <option value="german">German</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                            Security
                        </h2>
                        <button
                            type="button"
                            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded transition-colors duration-300"
                        >
                            Change Password
                        </button>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;