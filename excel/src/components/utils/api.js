import axios from 'axios';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword, sendPasswordResetEmail } from 'firebase/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
    baseURL: API_BASE_URL
});
api.interceptors.request.use(async (config) => {
    try {
        // Get the current user from firebase
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            // Get the token and add it to the headers
            const token = await user.getIdToken(true); // Force refresh to ensure token is valid
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("No authenticated user found for API request");
        }
    } catch (error) {
        console.error("Error setting auth token:", error);
    }
    return config;
});

/**
 * Check if user is authenticated
 * @returns {boolean} Whether the user is authenticated
 */
export const isAuthenticated = () => {
    const auth = getAuth();
    return !!auth.currentUser;
};
/**
 * Fetches the upload history from the server
 * @returns {Promise<Array>} The processed history items
 */
export const fetchUploadHistory = async () => {
    try {
        // Check if user is authenticated before making the request
        if (!isAuthenticated()) {
            throw new Error("User not authenticated. Please log in to view your upload history.");
        }
        // Use the full URL to the backend API
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/upload/history`);
        if (response.data && response.data.success) {
            const processedHistory = response.data.history.map((item) => ({
                id: item._id,
                filename: item.filename || 'Untitled',
                uploadDate: new Date(item.uploadDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                }),
                fileSize: item.fileSize || 'N/A',
                status: item.status || 'Processed',
                parsedData: item.parsedData || {},
                originalItem: item, // Keep the original item for reference
            }));
            return processedHistory;
        }
        throw new Error("Failed to fetch history data");
    } catch (err) {
        console.error("Error fetching history:", err);
        throw err;
    }
};
/**
 * Loads file data for a specific file
 * @param {string} fileId - The ID of the file to load
 * @returns {Promise<Object>} The file data
 */
export const loadFileData = async (fileId) => {
    try {
        // Check if user is authenticated before making the request
        if (!isAuthenticated()) {
            throw new Error("User not authenticated. Please log in to access file data.");
        }

        // Use the full URL to the backend API
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/upload/${fileId}`);
        if (response.data && response.data.success) {
            const item = response.data;
            // Check if data exists and is valid
            if (!item.data || Object.keys(item.data).length === 0) {
                throw new Error("The file doesn't contain valid data for visualization");
            }
            return {
                id: item.fileDetails.id,
                filename: item.fileDetails.filename,
                uploadDate: new Date(item.fileDetails.uploadDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                }),
                fileSize: item.fileDetails.fileSize,
                status: item.fileDetails.status,
                parsedData: item.data || {}, // Ensure parsedData is always an object
            };
        }
        throw new Error("Failed to load file data");
    } catch (error) {
        console.error("Error loading file data:", error);
        throw error;
    }
};
/**
 * Analyzes a specific file
 * @param {string} fileId - The ID of the file to analyze
 * @returns {Promise<Object>} The analysis results
 */
/**
 * Analyzes a specific file and displays the results in a user-friendly format
 * @param {string} fileId - The ID of the file to analyze
 * @returns {Promise<Object>} The analysis results formatted for display
 */
export const analyzeFile = async (fileId) => {
    try {
        // Check if user is authenticated before making the request
        if (!isAuthenticated()) {
            throw new Error("User not authenticated. Please log in to analyze files.");
        }

        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/upload/analyze/${fileId}`);
        if (response.data && response.data.success) {
            // Format the results for easy display
            const analysis = response.data.analysis;
            const formattedResults = {
                fileDetails: response.data.fileDetails,
                summary: {
                    totalRows: analysis.totalRows,
                    totalColumns: analysis.columns.length,
                    numericColumns: Object.keys(analysis.numericColumns).length,
                },
                columns: analysis.columns,
                statistics: []
            };
            // Format numeric column statistics
            Object.entries(analysis.numericColumns).forEach(([column, stats]) => {
                formattedResults.statistics.push({
                    column,
                    average: stats.average,
                    highest: stats.highest.value,
                    lowest: stats.lowest.value
                });
            });

            return formattedResults;
        }
        throw new Error("Analysis failed");
    } catch (error) {
        console.error("Error analyzing file:", error);
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error("Failed to analyze file: " + errorMessage);
    }
};
/*
 * Deletes a specific file
 * @param {string} fileId - The ID of the file to delete
 * @param {Event} event - The event object to stop propagation
 * @returns {Promise<Object>} The deletion result
 */
export const deleteFile = async (fileId, event) => {
    // Stop event propagation to prevent triggering the parent's onClick
    if (event) {
        event.stopPropagation();
    }
    try {
        // Check if user is authenticated before making the request
        if (!isAuthenticated()) {
            throw new Error("User not authenticated. Please log in to delete files.");
        }

        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/upload/${fileId}`);
        if (response.data && response.data.success) {
            return { success: true, message: "File deleted successfully!" };
        }
        throw new Error("Failed to delete file");
    } catch (error) {
        console.error("Error deleting file:", error);
        throw new Error(error.response?.data?.message || "Failed to delete file");
    }
};

/**
 * Processes and uploads an Excel file to the server
 * @param {File} selectedFile - The Excel file to upload
 * @returns {Promise<Object>} Upload response
 */
export const processExcelFile = async (selectedFile) => {
    if (!isAuthenticated()) {
        throw new Error("User not authenticated. Please log in to upload files.");
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
        // Use the full URL to the backend API
        const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
};
/**
 * Fetches the user profile from MongoDB
 * @returns {Promise<Object>} User profile data
 */
export const fetchUserProfile = async () => {
    try {
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/profile/`);
        if (response.data && response.data.success) {
            return response.data.user;
        }
        throw new Error("Failed to fetch user profile");
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

/**
 * Updates the user profile in MongoDB and Firebase
 * @param {Object} profileData - The profile data to update
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserProfile = async (profileData) => {
    try {
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/profile/`, profileData);
        if (response.data && response.data.success) {
            return response.data.user;
        }
        throw new Error("Failed to update user profile");
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

/**
 * Updates user settings in MongoDB
 * @param {Object} settingsData - The settings data to update
 * @returns {Promise<Object>} Updated settings
 */
export const updateUserSettings = async (settingsData) => {
    try {
        const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/settings`, settingsData);
        if (response.data && response.data.success) {
            return response.data.settings;
        }
        throw new Error("Failed to update user settings");
    } catch (error) {
        console.error("Error updating user settings:", error);
        throw error;
    }
};

/**
 * Changes the user password in Firebase
 * @param {Object} passwordData - Contains the new password
 * @returns {Promise<Object>} Success message
 */
export const changeUserPassword = async (passwordData) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No authenticated user found. Please log in to change your password.");
        }
        const { currentPassword, newPassword } = passwordData;
        if (!currentPassword || !newPassword) {
            throw new Error("Current password and new password are required");
        }
        // For security, Firebase requires recent authentication before changing password
        // First, we need to reauthenticate the user with their current credentials
        const credential = EmailAuthProvider.credential(
            user.email,
            currentPassword
        );
        try {
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            await api.post(`${import.meta.env.VITE_API_BASE_URL}/password`, passwordData);
            return {
                success: true,
                message: "Password changed successfully!"
            };
        } catch (authError) {
            // Handle specific Firebase Auth errors
            if (authError.code === 'auth/wrong-password') {
                throw new Error("Current password is incorrect.");
            } else if (authError.code === 'auth/too-many-requests') {
                throw new Error("Too many failed attempts. Please try again later.");
            } else if (authError.code === 'auth/requires-recent-login') {
                throw new Error("For security reasons, please log out and log back in before changing your password.");
            } else {
                console.error("Firebase auth error:", authError);
                throw new Error("Authentication failed: " + (authError.message || "Please try again."));
            }
        }
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
};
/**
 * Fetches the raw content of a file by ID
 * @param {string} fileId - The ID of the file to fetch
 * @returns {Promise<string>} - The raw file content
 */
export const fetchFileContent = async (fileId) => {
    try {
        const token = await getAuthToken();

        // Replace with your actual API endpoint
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/files/${fileId}/content`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to fetch file content: ${response.statusText}`);
        }

        return await response.text();
    } catch (error) {
        console.error('Error fetching file content:', error);
        throw error;
    }
};

/**
 * Get the authentication token for the current user
 * @returns {Promise<string>} The authentication token
 * @throws {Error} If user is not authenticated
 */
export const getAuthToken = async () => {
    try {
        // Import getAuth on demand to avoid circular dependencies
        const { getAuth } = await import('firebase/auth');
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('User not authenticated');
        }
        // Force token refresh if it's close to expiration
        const token = await currentUser.getIdToken(/* forceRefresh */ false);
        // Optional: Check token expiration
        // The Firebase ID token has a default expiration of 1 hour
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        // If token expires in less than 5 minutes, force refresh
        if (expirationTime - currentTime < 5 * 60 * 1000) {
            return await currentUser.getIdToken(/* forceRefresh */ true);
        }

        return token;
    } catch (error) {
        console.error('Error getting auth token:', error);
        throw new Error('Authentication error: ' + (error.message || 'Failed to get auth token'));
    }
};

export const sendResetEmail = async () => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || !user.email) {
            throw new Error("No authenticated user found.");
        }

        await sendPasswordResetEmail(auth, user.email);
        return {
            success: true,
            message: `Password reset email sent to ${user.email}`
        };
    } catch (error) {
        console.error("Error sending reset email:", error);
        throw new Error(error.message || "Failed to send reset email.");
    }
};

/**
 * Calls the AI Insight backend for the given file
 * @param {string} fileId - The ID of the uploaded file
 * @returns {Promise<string>} - The AI-generated insights
 */
export const fetchAIInsight = async (fileId) => {
    try {
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/insight/${fileId}`);
        if (response.data && response.data.success) {
            return response.data.insights;
        }
        throw new Error(response.data.message || "Failed to fetch AI insight.");
    } catch (error) {
        console.error("Error fetching AI Insight:", error);
        throw error;
    }
  };