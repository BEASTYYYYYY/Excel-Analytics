import User from '../models/userModel.js';
import { getAuth } from 'firebase-admin/auth';
import FileUploadHistory from '../models/fileUploadHistory.js';
import UnblockRequest from '../models/unblockRequest.js';

export const getAllUsers = async (req, res) => {
    try {
        const currentUser = await User.findOne({ uid: req.user.uid });
        if (!currentUser || !currentUser.isAdmin()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        const users = await User.find(
            { role: { $in: ['user', 'admin', 'superadmin'] } },
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
        let unblockNotice = null;
        if (user.isActive && user.unblockNotified === false) {
            unblockNotice = "Your access has been restored. Thank you for your patience.";
            user.unblockNotified = true;
            await user.save();
        }
        res.status(200).json({
            success: true,
            user: {
                uid: user.uid,
                name: user.name,
                email: user.email,
                photo: user.photo,
                role: user.role,
                isActive: user.isActive,
                settings: user.settings || {}
            },

            notification: unblockNotice // ✅ included for toast on frontend
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
                role: 'user',
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
                photo: user.photo,
                role: 'user',
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
        if (!currentUser || currentUser.role !== "superadmin") {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const { uid } = req.params;
        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.role === "superadmin") {
            return res.status(403).json({ success: false, message: "Cannot block a superadmin" });
        }
        user.isActive = !user.isActive;
        if (user.isActive) {
            user.unblockNotified = false; // ✅ User gets notified on dashboard
        }
        await user.save();
        res.status(200).json({
            success: true,
            message: `User ${user.isActive ? "unblocked" : "blocked"} successfully.`,
            user: { uid: user.uid, isActive: user.isActive },
        });
    } catch (err) {
        console.error("toggleUserBlock error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const submitUnblockRequest = async (req, res) => {
    try {
        const existing = await UnblockRequest.findOne({ uid: req.user.uid, reviewed: false });
        if (existing) {
            return res.status(400).json({ message: "You already submitted a request." });
        }
        const { name, email, reason, message, urgency } = req.body;
        if (!name || !email || !reason || !message) {
            return res.status(400).json({ message: "All required fields must be filled." });
        }
        const request = new UnblockRequest({
            uid: req.user.uid,
            name,
            email,
            reason,
            message,
            urgency
        });
        await request.save();
        res.status(200).json({ success: true, message: "Request submitted." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};
  
// Admin fetches unblock requests
export const getUnblockRequests = async (req, res) => {
    const currentUser = await User.findOne({ uid: req.user.uid });
    if (!currentUser || !currentUser.isAdmin()) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const requests = await UnblockRequest.find({ reviewed: false }).sort({ createdAt: -1 });
    res.json({ success: true, requests });
  };

export const deleteUnblockRequest = async (req, res) => {
    try {
        const currentUser = await User.findOne({ uid: req.user.uid });

        if (!currentUser || !currentUser.isAdmin()) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const { uid } = req.params;
        const deleted = await UnblockRequest.findOneAndDelete({ uid });

        if (!deleted) {
            return res.status(404).json({ message: 'Request not found or already deleted' });
        }

        res.status(200).json({ success: true, message: 'Request deleted successfully' });
    } catch (err) {
        console.error("Error deleting unblock request:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getRecentActivities = async (req, res) => {
    try {
        const recentUsers = await User.find({ role: { $in: ['user', 'admin'] } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('createdAt');

        const recentUploads = await FileUploadHistory.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('createdAt');

        res.status(200).json({
            success: true,
            recentUsers,
            recentUploads
        });
    } catch (error) {
        console.error("Error fetching recent activity:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get recent uploads
export const getRecentUploads = async (req, res) => {
    try {
        const uploads = await FileUploadHistory.find({})
            .sort({ createdAt: -1 })
            .limit(50)
            .select('_id user filename createdAt fileSize');

        // Get user UIDs from upload records
        const uids = uploads.map(u => u.user).filter(Boolean);
        const users = await User.find({ uid: { $in: uids } }, 'uid name');
        const userMap = Object.fromEntries(users.map(u => [u.uid, u.name]));

        // Attach name manually
        const uploadsWithNames = uploads.map(upload => ({
            ...upload.toObject(),
            userName: userMap[upload.user] || '—'
        }));

        res.status(200).json({ success: true, uploads: uploadsWithNames });
    } catch (err) {
        console.error('Error fetching uploads:', err);
        res.status(500).json({ success: false, message: 'Server error fetching uploads' });
    }
};

// Delete an upload
export const deleteUpload = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await FileUploadHistory.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Upload not found' });
        }
        res.status(200).json({ success: true, message: 'Upload deleted successfully' });
    } catch (err) {
        console.error('Error deleting upload:', err);
        res.status(500).json({ success: false, message: 'Server error while deleting upload' });
    }
};
  