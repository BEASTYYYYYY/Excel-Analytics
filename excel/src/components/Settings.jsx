import { useState } from "react";
import { useSelector } from "react-redux";
import { updateUserSettings, changeUserPassword, sendResetEmail } from "./utils/api";

const Settings = () => {
    const { user } = useSelector((state) => state.auth);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [darkModeDefault, setDarkModeDefault] = useState(false);
    const [language, setLanguage] = useState("english");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Password change states
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordErrors, setPasswordErrors] = useState({});

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const validatePasswordForm = () => {
        const errors = {};

        if (!passwordData.currentPassword)
            errors.currentPassword = "Current password is required";

        if (!passwordData.newPassword)
            errors.newPassword = "New password is required";
        else if (passwordData.newPassword.length < 8)
            errors.newPassword = "Password must be at least 8 characters";

        if (passwordData.newPassword !== passwordData.confirmPassword)
            errors.confirmPassword = "Passwords do not match";

        return errors;
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        // Validate form
        const errors = validatePasswordForm();
        if (Object.keys(errors).length > 0) {
            setPasswordErrors(errors);
            return;
        }
        setPasswordErrors({});
        setLoading(true);
        try {
            await changeUserPassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            // Reset form and show success message
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setShowPasswordModal(false);
            setMessage({ type: "success", text: "Password updated successfully!" });
            // Clear message after 5 seconds
            setTimeout(() => setMessage({ type: "", text: "" }), 5000);
        } catch (error) {
            setPasswordErrors({
                form: error.message || "Failed to update password. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSendResetEmail = async () => {
        setMessage({ type: "", text: "" });
        try {
            const response = await sendResetEmail();
            setMessage({ type: "success", text: response.message });
            setTimeout(() => setMessage({ type: "", text: "" }), 5000);
        } catch (error) {
            setMessage({
                type: "error",
                text: error.message || "Failed to send password reset email"
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            // Save settings to database
            await updateUserSettings({
                emailNotifications,
                darkModeDefault,
                language
            });

            setMessage({ type: "success", text: "Settings saved successfully!" });

            // Clear message after 5 seconds
            setTimeout(() => setMessage({ type: "", text: "" }), 5000);
        } catch (error) {
            setMessage({
                type: "error",
                text: error.message || "Failed to save settings. Please try again."
            });
            setTimeout(() => setMessage({ type: "", text: "" }), 5000);
        } finally {
            setLoading(false);
        }
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
        <div className="relative ml-[20rem] max-w-5xl mt-15 flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
            <div className="relative bg-clip-border mx-5 rounded-xl overflow-hidden bg-gradient-to-tr from-[#252525] to-[#3a3a3a] text-white shadow-gray-900/20 shadow-lg -mt-8 mb-8 p-6">
                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">
                    Account Settings
                </h6>
            </div>

            {/* Status Messages */}
            {message.text && (
                <div className={`mx-6 mb-4 px-4 py-3 rounded ${message.type === "success"
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-red-100 text-red-800 border border-red-300"
                    }`}>
                    {message.text}
                </div>
            )}
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
                            onClick={() => setShowPasswordModal(true)}
                            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded transition-colors duration-300"
                        >
                            Change Password
                        </button>
                        <button
                            type="button"
                            onClick={handleSendResetEmail}
                            className="ml-4 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
                        >
                            Send Reset Email
                        </button>

                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-gradient-to-r from-[#1f1f1f] to-[#3a3a3a] hoverr:bg-black cursor-pointer text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300 ${loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                            Change Password
                        </h2>

                        {passwordErrors.form && (
                            <div className="mb-4 px-4 py-3 bg-red-100 text-red-800 border border-red-300 rounded">
                                {passwordErrors.form}
                            </div>
                        )}

                        <form onSubmit={handlePasswordSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className={`w-full p-3 border ${passwordErrors.currentPassword
                                            ? "border-red-500"
                                            : "border-gray-300 dark:border-gray-600"
                                        } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                />
                                {passwordErrors.currentPassword && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {passwordErrors.currentPassword}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className={`w-full p-3 border ${passwordErrors.newPassword
                                            ? "border-red-500"
                                            : "border-gray-300 dark:border-gray-600"
                                        } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                />
                                {passwordErrors.newPassword && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {passwordErrors.newPassword}
                                    </p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className={`w-full p-3 border ${passwordErrors.confirmPassword
                                            ? "border-red-500"
                                            : "border-gray-300 dark:border-gray-600"
                                        } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                />
                                {passwordErrors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {passwordErrors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium py-2 px-4 rounded transition-colors duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`bg-gradient-to-r from-[#1f1f1f] to-[#3a3a3a] text-white font-semibold py-2 px-4 rounded transition-colors duration-300 ${loading ? "opacity-70 cursor-not-allowed" : ""
                                        }`}
                                >
                                    {loading ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;