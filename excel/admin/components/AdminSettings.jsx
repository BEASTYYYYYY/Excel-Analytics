import React, { useRef, useState } from 'react';
import { Lock, Mail, Send, Check, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    const bg =
        type === 'success'
            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700'
            : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700';

    return (
        <div
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl border shadow-sm flex items-center gap-3 ${bg}`}
        >
            {type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span className="text-sm font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 text-sm opacity-50 hover:opacity-100">
                ×
            </button>
        </div>
    );
};

const AdminSettings = () => {
    // Password section
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Email section
    const recipientRef = useRef();
    const subjectRef = useRef();
    const messageRef = useRef();
    const [emailLoading, setEmailLoading] = useState(false);

    // Toast state
    const [toast, setToast] = useState({ message: '', type: 'success', show: false });

    const showToast = (msg, type = 'success') => {
        setToast({ message: msg, type, show: true });
        setTimeout(() => setToast({ ...toast, show: false }), 4000);
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            return showToast('New passwords do not match', 'error');
        }

        setPasswordLoading(true);
        try {
            const res = await fetch('/admin/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            showToast('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleEmailSend = async () => {
        const subject = subjectRef.current.value.trim();
        const message = messageRef.current.value.trim();
        const recipients = recipientRef.current.value;

        if (!subject || !message) {
            return showToast('Subject and message are required', 'error');
        }

        setEmailLoading(true);
        try {
            const res = await fetch('/admin/email-broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipients, subject, message }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            showToast('Email sent successfully!');
            subjectRef.current.value = '';
            messageRef.current.value = '';
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setEmailLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-10 max-w-3xl mx-auto text-gray-800 dark:text-white">
            {/* Toast */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}

            {/* Password Section */}
            <div className="border p-6 rounded-xl shadow-sm bg-white dark:bg-gray-800 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <Lock className="text-blue-600" />
                    <h2 className="text-lg font-bold">Change Password</h2>
                </div>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current Password"
                    className="w-full px-4 py-3 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full px-4 py-3 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="w-full px-4 py-3 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handlePasswordChange}
                    disabled={passwordLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
            </div>

            {/* Email Section */}
            <div className="border p-6 rounded-xl shadow-sm bg-white dark:bg-gray-800 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <Mail className="text-blue-600" />
                    <h2 className="text-lg font-bold">Email Broadcast</h2>
                </div>
                <select
                    ref={recipientRef}
                    defaultValue="all"
                    className="w-full px-4 py-3 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                >
                    <option value="all">All Users & Admins</option>
                    <option value="admins">Admins Only</option>
                    <option value="users">Users Only</option>
                </select>
                <input
                    type="text"
                    ref={subjectRef}
                    placeholder="Email Subject"
                    className="w-full px-4 py-3 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <textarea
                    ref={messageRef}
                    placeholder="Email Message"
                    rows={5}
                    className="w-full px-4 py-3 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <button
                    onClick={handleEmailSend}
                    disabled={emailLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                    {emailLoading ? 'Sending...' : 'Send Email'}
                </button>
            </div>
        </div>
    );
};

export default AdminSettings;
