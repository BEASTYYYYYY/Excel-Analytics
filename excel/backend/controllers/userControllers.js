import User from '../models/userModel.js';
import { getAuth } from 'firebase-admin/auth';

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const uid = req.user.uid;

        // Find user in MongoDB by Firebase UID
        const user = await User.findOne({ uid });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                uid: user.uid,
                name: user.name,
                email: user.email,
                photo: user.photo,
                settings: user.settings || {}
            }
        });
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user profile'
        });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const uid = req.user.uid;
        const { name, photo } = req.body;

        // Find and update user in MongoDB
        let user = await User.findOne({ uid });

        if (!user) {
            // Create new user if not found
            user = new User({
                uid,
                name,
                email: req.user.email,
                photo
            });
        } else {
            // Update existing user
            user.name = name || user.name;
            user.photo = photo || user.photo;
        }

        await user.save();

        // Also update Firebase display name and photo URL
        try {
            await getAuth().updateUser(uid, {
                displayName: name,
                photoURL: photo,
            });
        } catch (firebaseError) {
            console.error('Firebase update error:', firebaseError);
            // Continue with MongoDB update even if Firebase update fails
        }

        res.status(200).json({
            success: true,
            message: 'User profile updated successfully',
            user: {
                uid: user.uid,
                name: user.name,
                email: user.email,
                photo: user.photo
            }
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating user profile'
        });
    }
};

// Update user settings
export const updateUserSettings = async (req, res) => {
    try {
        const uid = req.user.uid;
        const { emailNotifications, darkModeDefault, language } = req.body;

        // Find user in MongoDB
        let user = await User.findOne({ uid });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Initialize settings object if it doesn't exist
        if (!user.settings) {
            user.settings = {};
        }

        // Update settings
        user.settings.emailNotifications = emailNotifications !== undefined ?
            emailNotifications : user.settings.emailNotifications;

        user.settings.darkModeDefault = darkModeDefault !== undefined ?
            darkModeDefault : user.settings.darkModeDefault;

        user.settings.language = language || user.settings.language;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'User settings updated successfully',
            settings: user.settings
        });
    } catch (error) {
        console.error('Error updating user settings:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating user settings'
        });
    }
};

// Change password (Firebase only - password not stored in MongoDB)
export const changePassword = async (req, res) => {
    try {
        const uid = req.user.uid;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Update password in Firebase
        await getAuth().updateUser(uid, {
            password: newPassword
        });

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            success: false,
            message: `Error changing password: ${error.message}`
        });
    }
};