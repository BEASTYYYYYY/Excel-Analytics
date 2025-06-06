// controllers/adminController.js
import { getAuth } from 'firebase-admin/auth';
import User from '../models/userModel.js';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import FileUploadHistory from '../models/fileUploadHistory.js';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
// Only superadmins can change password here
export const changePassword = async (req, res) => {
    try {
        const uid = req.user.uid;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        await getAuth().updateUser(uid, { password: newPassword });
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error changing password' });
    }
};

export const broadcastEmail = async (req, res) => {
    try {
        const { recipients, subject, message } = req.body;
        const currentUser = await User.findOne({ uid: req.user.uid });

        if (!currentUser || currentUser.role !== 'superadmin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required' });
        }

        const roleQuery =
            recipients === 'admins' ? { role: 'admin' } :
                recipients === 'users' ? { role: 'user' } :
                    { role: { $in: ['user', 'admin'] } };

        const users = await User.find(roleQuery, 'email');
        const emailList = users.map(u => u.email);

        // Send using Resend
        await resend.emails.send({
            from: 'Super Admin <onboarding@resend.dev>',
            to: emailList,
            subject,
            html: `<p>${message}</p>`
        });

        res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).json({ message: 'Failed to send broadcast email' });
    }
};

export const adminDeleteUpload = async (req, res) => {
    try {
        const currentUser = await User.findOne({ uid: req.user.uid });
        if (!currentUser || !currentUser.isAdmin()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        const { id } = req.params;
        const deleted = await FileUploadHistory.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Upload not found' });
        }
        res.status(200).json({ success: true, message: 'Upload deleted by admin' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};