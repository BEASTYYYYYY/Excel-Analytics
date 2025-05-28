import User from '../models/userModel.js';
import { getAuth } from 'firebase-admin/auth';
import FileUploadHistory from '../models/fileUploadHistory.js';

export const getAllUsers = async (req, res) => {
    try {
        const currentUser = await User.findOne({ uid: req.user.uid });
        if (!currentUser || !currentUser.isAdmin()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        const users = await User.find(
            { role: { $in: ['user', 'admin'] } },
            '-_id uid name email photo role lastLogin isActive'
        );

        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const uid = req.user.uid;
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
                role: user.role,
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

export const updateUserProfile = async (req, res) => {
    try {
        const uid = req.user.uid;
        const { name, photo } = req.body;
        let user = await User.findOne({ uid });

        if (!user) {
            user = new User({
                uid,
                name,
                email: req.user.email,
                photo: photo || req.user.photo, 
            });
        } else {
            user.name = name || user.name;
            user.photo = photo || user.photo;
        }
        await user.save();
        try {
            await getAuth().updateUser(uid, {
                displayName: name,
                photoURL: user.photo,
            });
        } catch (firebaseError) {
            console.error('Firebase update error:', firebaseError);
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

export const updateUserSettings = async (req, res) => {
    try {
        const uid = req.user.uid;
        const { emailNotifications, darkModeDefault, language } = req.body;
        let user = await User.findOne({ uid });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        if (!user.settings) {
            user.settings = {};
        }
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

export const changeUserRole = async (req, res) => {
    try {
        const currentUser = await User.findOne({ uid: req.user.uid });
        const { uid } = req.params;
        const { role } = req.body;

        if (!currentUser || !currentUser.isSuperAdmin()) {
            return res.status(403).json({ success: false, message: 'Only superadmins can change roles' });
        }
        if (!['user', 'admin', 'superadmin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }
        const userToUpdate = await User.findOne({ uid });

        if (!userToUpdate) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        userToUpdate.role = role;
        await userToUpdate.save();

        res.status(200).json({ success: true, message: `User promoted to ${role}` });
    } catch (error) {
        console.error('Error changing role:', error);
        res.status(500).json({ success: false, message: 'Error changing role' });
    }
};

export const getUserStats = async (req, res) => {
    try {
        const currentUser = await User.findOne({ uid: req.user.uid });

        if (!currentUser || !currentUser.isAdmin()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const totalUsers = await User.countDocuments({ role: { $in: ['user', 'admin'] } });
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const activeUsers = await User.countDocuments({
            lastLogin: { $gte: thirtyDaysAgo },
            role: { $in: ['user', 'admin'] }
        });
        const totalUploads = await FileUploadHistory.countDocuments();

        res.json({
            success: true,
            stats: {
                totalUsers,
                activeUsers,
                totalUploads
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching stats' });
    }
};

export const toggleUserBlock = async (req, res) => {
    try {
        const currentUser = await User.findOne({ uid: req.user.uid });
        const { uid } = req.params;

        if (!currentUser || !currentUser.isAdmin()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const user = await User.findOne({ uid });

        if (!user || user.role === 'superadmin') {
            return res.status(404).json({ success: false, message: 'User not found or cannot block superadmin' });
        }

        user.isActive = !user.isActive; // ✅ toggle block state
        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${user.isActive ? 'unblocked' : 'blocked'} successfully.`,
            user: { uid: user.uid, isActive: user.isActive }
        });
    } catch (error) {
        console.error('Block/unblock error:', error.message);
        res.status(500).json({ success: false, message: 'Error updating user status' });
    }
};
