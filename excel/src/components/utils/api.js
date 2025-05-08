import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with auth token interceptor
const api = axios.create({
    baseURL: API_BASE_URL
});

// Add auth token to all requests
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
            // You might want to handle unauthenticated state here
            // For example, redirect to login or show an error
        }
    } catch (error) {
        console.error("Error setting auth token:", error);
        // Don't throw the error to allow the request to continue, but without auth
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
        const response = await api.get(`/api/upload/history`);
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
        const response = await api.get(`/api/upload/${fileId}`);
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
export const analyzeFile = async (fileId) => {
    try {
        // Check if user is authenticated before making the request
        if (!isAuthenticated()) {
            throw new Error("User not authenticated. Please log in to analyze files.");
        }

        const response = await api.get(`/api/upload/analyze/${fileId}`);
        if (response.data && response.data.success) {
            return response.data.analysis;
        }
        throw new Error("Analysis failed");
    } catch (error) {
        console.error("Error analyzing file:", error);
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error("Failed to analyze file: " + errorMessage);
    }
};

/**
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

        const response = await api.delete(`/api/upload/${fileId}`);
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
    // Check if user is authenticated before making the request
    if (!isAuthenticated()) {
        throw new Error("User not authenticated. Please log in to upload files.");
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        // Use the full URL to the backend API
        const response = await api.post(`/api/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data;
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
};