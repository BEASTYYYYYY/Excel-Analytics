import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getAuth, updateProfile } from "firebase/auth";
import { UserCircleIcon, CameraIcon } from "@heroicons/react/24/solid";
import { fetchUserProfile, updateUserProfile } from "./utils/api"; 
import { useDispatch } from "react-redux";
import { updateUserName } from "../redux/authSlice";
import { updateUserPhoto } from "../redux/authSlice";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        photo: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        const loadUserProfile = async () => {
            if (user) {
                setIsFetching(true);
                try {
                    // First set from Firebase auth (immediately available)
                    setProfileData({
                        name: user.displayName || "",
                        email: user.email || "",
                        photo: user.photoURL || ""
                    });
                    // Then fetch from MongoDB (more complete data)
                    const mongoProfile = await fetchUserProfile();
                    setProfileData({
                        name: mongoProfile.name || user.displayName || "",
                        email: mongoProfile.email || user.email || "",
                        photo: mongoProfile.photo || user.photoURL || ""
                    });
                } catch (error) {
                    console.error("Error loading profile:", error);
                    setMessage({
                        text: `Error loading profile: ${error.message}`,
                        type: "error"
                    });
                } finally {
                    setIsFetching(false);
                }
            }
        };

        loadUserProfile();
    }, [user]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setProfileData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (currentUser) {
                // Update in Firebase
                await updateProfile(currentUser, {
                    displayName: profileData.name,
                    photoURL: profileData.photo
                });

                // Update in MongoDB
                await updateUserProfile({
                    name: profileData.name,
                    photo: profileData.photo
                });

                dispatch(updateUserName(profileData.name));
                dispatch(updateUserPhoto(profileData.photo));

                setMessage({
                    text: "Profile updated successfully!",
                    type: "success"
                });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({
                text: `Error updating profile: ${error.message}`,
                type: "error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
                    <p className="text-lg text-center text-gray-700 dark:text-gray-300">
                        Please login to view your profile
                    </p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    Your Profile
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Manage your personal information and account settings
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                {isFetching ? (
                    <div className="p-8 flex justify-center">
                        <div className="animate-pulse flex space-x-4">
                            <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-12 w-12"></div>
                            <div className="flex-1 space-y-4 py-1">
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
                        <div className="px-6 py-8">
                            <div className="flex flex-col md:flex-row md:items-center">
                                <div className="relative -mt-20 mb-4 md:mb-0 md:mr-6">
                                    <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        {profileData.photo ? (
                                            <img
                                                src={profileData.photo}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <UserCircleIcon className="w-28 h-28 text-gray-400 dark:text-gray-500" />
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-1 shadow-md">
                                        <CameraIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {profileData.name || "Set Your Name"}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {profileData.email}
                                    </p>
                                </div>
                            </div>

                            {message.text && (
                                <div
                                    className={`mt-6 p-4 border-l-4 rounded-md ${message.type === "success"
                                            ? "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-500 dark:text-green-200"
                                            : "bg-red-50 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-500 dark:text-red-200"
                                        }`}
                                >
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="mt-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                                            htmlFor="name"
                                        >
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={profileData.name}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                                            htmlFor="email"
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={profileData.email}
                                            disabled
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                                            placeholder="Your email"
                                        />
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Email cannot be changed
                                        </p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label
                                            className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                                            htmlFor="photo"
                                        >
                                            Profile Picture URL
                                        </label>
                                        <input
                                            type="text"
                                            id="photo"
                                            value={profileData.photo}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="https://example.com/your-photo.jpg"
                                        />
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Enter a direct URL to your profile image
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <button
                                        type="button"
                                        className="mr-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                                        onClick={() => window.location.href = '/settings'}
                                    >
                                        Go to Settings
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300 flex items-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        {isLoading && (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;