import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getAuth, updateProfile } from "firebase/auth";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || "");
            setEmail(user.email || "");
            setPhotoURL(user.photoURL || "");
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (currentUser) {
                await updateProfile(currentUser, {
                    displayName,
                    photoURL
                });

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
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    Please login to view your profile
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                Edit Profile
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 rounded-full mb-4 overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {photoURL ? (
                            <img
                                src={photoURL}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <UserCircleIcon className="w-28 h-28 text-gray-400 dark:text-gray-500" />
                        )}
                    </div>
                </div>

                {message.text && (
                    <div
                        className={`mb-4 p-3 rounded-md ${message.type === "success"
                                ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                                : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                            htmlFor="displayName"
                        >
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Your name"
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                            htmlFor="email"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            disabled
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                            placeholder="Your email"
                        />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Email cannot be changed
                        </p>
                    </div>

                    <div className="mb-6">
                        <label
                            className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                            htmlFor="photoURL"
                        >
                            Profile Picture URL
                        </label>
                        <input
                            type="text"
                            id="photoURL"
                            value={photoURL}
                            onChange={(e) => setPhotoURL(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="https://example.com/your-photo.jpg"
                        />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Enter a direct URL to your profile image
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;