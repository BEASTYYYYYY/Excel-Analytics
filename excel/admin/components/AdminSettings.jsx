// src/admin/components/AdminSettings.jsx
import React, { useState } from 'react';
import {
    Settings, Save, RefreshCw, Shield, Database, Mail, Bell, Users,
    Server, Globe, Lock, Eye, EyeOff, Upload, Download, Trash2,
    AlertTriangle, CheckCircle, Info, HelpCircle, Monitor, Smartphone,
    Cloud, Key, FileText, Zap, Activity, BarChart3, MessageSquare,
    Calendar, Clock, Filter, Search, Plus, X, Edit3, Copy, ExternalLink
} from 'lucide-react';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        // General Settings
        siteName: 'AdminPortal',
        siteDescription: 'Comprehensive admin dashboard for file management',
        timezone: 'UTC',
        language: 'en',
        maintenanceMode: false,

        // Security Settings
        twoFactorAuth: true,
        sessionTimeout: 30,
        passwordPolicy: {
            minLength: 8,
            requireNumbers: true,
            requireSpecialChars: true,
            requireUppercase: true,
        },
        ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],

        // Upload Settings
        maxFileSize: 100,
        allowedFileTypes: ['xlsx', 'csv', 'xls', 'pdf', 'doc', 'docx'],
        uploadLimit: 50,
        virusScanning: true,

        // Email Settings
        smtpHost: 'smtp.example.com',
        smtpPort: 587,
        smtpUser: 'admin@example.com',
        smtpPassword: '',
        emailNotifications: true,

        // Notification Settings
        notifications: {
            newUploads: true,
            failedUploads: true,
            systemAlerts: true,
            securityEvents: true,
            weeklyReports: true,
        },

        // Performance Settings
        cacheEnabled: true,
        cacheDuration: 3600,
        compressionEnabled: true,
        cdnEnabled: false,

        // Backup Settings
        autoBackup: true,
        backupFrequency: 'daily',
        backupRetention: 30,
        cloudBackup: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1500);
    };

    const handleSettingChange = (section, key, value) => {
        if (section) {
            setSettings(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [key]: value
                }
            }));
        } else {
            setSettings(prev => ({
                ...prev,
                [key]: value
            }));
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'uploads', label: 'File Uploads', icon: Upload },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'performance', label: 'Performance', icon: Zap },
        { id: 'backup', label: 'Backup', icon: Database },
        { id: 'users', label: 'User Management', icon: Users },
    ];

    const SettingCard = ({ title, description, children, icon: Icon }) => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-start space-x-4">
                {Icon && (
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                )}
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                    {description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );

    const Toggle = ({ enabled, onChange, label }) => (
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-900 dark:text-white">{label}</span>
            <button
                onClick={() => onChange(!enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );

    const renderGeneralSettings = () => (
        <div className="space-y-6">
            <SettingCard title="Site Configuration" description="Basic site settings and configuration" icon={Globe}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Name</label>
                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => handleSettingChange(null, 'siteName', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Description</label>
                        <textarea
                            value={settings.siteDescription}
                            onChange={(e) => handleSettingChange(null, 'siteDescription', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                            <select
                                value={settings.timezone}
                                onChange={(e) => handleSettingChange(null, 'timezone', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                            >
                                <option value="UTC">UTC</option>
                                <option value="America/New_York">Eastern Time</option>
                                <option value="America/Chicago">Central Time</option>
                                <option value="America/Los_Angeles">Pacific Time</option>
                                <option value="Europe/London">London</option>
                                <option value="Asia/Tokyo">Tokyo</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                            <select
                                value={settings.language}
                                onChange={(e) => handleSettingChange(null, 'language', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="zh">Chinese</option>
                            </select>
                        </div>
                    </div>
                </div>
            </SettingCard>

            <SettingCard title="System Status" description="System-wide settings and maintenance" icon={Activity}>
                <div className="space-y-4">
                    <Toggle
                        enabled={settings.maintenanceMode}
                        onChange={(value) => handleSettingChange(null, 'maintenanceMode', value)}
                        label="Maintenance Mode"
                    />
                    {settings.maintenanceMode && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                <span className="text-sm text-amber-800 dark:text-amber-200">
                                    Maintenance mode is enabled. Users will see a maintenance page.
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </SettingCard>
        </div>
    );

    const renderSecuritySettings = () => (
        <div className="space-y-6">
            <SettingCard title="Authentication" description="Two-factor authentication and session settings" icon={Lock}>
                <div className="space-y-4">
                    <Toggle
                        enabled={settings.twoFactorAuth}
                        onChange={(value) => handleSettingChange(null, 'twoFactorAuth', value)}
                        label="Two-Factor Authentication"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Session Timeout (minutes)</label>
                        <input
                            type="number"
                            value={settings.sessionTimeout}
                            onChange={(e) => handleSettingChange(null, 'sessionTimeout', parseInt(e.target.value))}
                            className="w-32 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </SettingCard>

            <SettingCard title="Password Policy" description="Requirements for user passwords" icon={Key}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Length</label>
                        <input
                            type="number"
                            value={settings.passwordPolicy.minLength}
                            onChange={(e) => handleSettingChange('passwordPolicy', 'minLength', parseInt(e.target.value))}
                            className="w-32 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        />
                    </div>
                    <div className="space-y-3">
                        <Toggle
                            enabled={settings.passwordPolicy.requireNumbers}
                            onChange={(value) => handleSettingChange('passwordPolicy', 'requireNumbers', value)}
                            label="Require Numbers"
                        />
                        <Toggle
                            enabled={settings.passwordPolicy.requireSpecialChars}
                            onChange={(value) => handleSettingChange('passwordPolicy', 'requireSpecialChars', value)}
                            label="Require Special Characters"
                        />
                        <Toggle
                            enabled={settings.passwordPolicy.requireUppercase}
                            onChange={(value) => handleSettingChange('passwordPolicy', 'requireUppercase', value)}
                            label="Require Uppercase Letters"
                        />
                    </div>
                </div>
            </SettingCard>

            <SettingCard title="IP Whitelist" description="Allowed IP addresses and ranges" icon={Shield}>
                <div className="space-y-4">
                    {settings.ipWhitelist.map((ip, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={ip}
                                onChange={(e) => {
                                    const newList = [...settings.ipWhitelist];
                                    newList[index] = e.target.value;
                                    handleSettingChange(null, 'ipWhitelist', newList);
                                }}
                                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                            />
                            <button
                                onClick={() => {
                                    const newList = settings.ipWhitelist.filter((_, i) => i !== index);
                                    handleSettingChange(null, 'ipWhitelist', newList);
                                }}
                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => handleSettingChange(null, 'ipWhitelist', [...settings.ipWhitelist, ''])}
                        className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add IP Range</span>
                    </button>
                </div>
            </SettingCard>
        </div>
    );

    const renderUploadSettings = () => (
        <div className="space-y-6">
            <SettingCard title="File Upload Limits" description="Configure file size and type restrictions" icon={Upload}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Maximum File Size (MB)</label>
                        <input
                            type="number"
                            value={settings.maxFileSize}
                            onChange={(e) => handleSettingChange(null, 'maxFileSize', parseInt(e.target.value))}
                            className="w-32 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Limit per User (files/day)</label>
                        <input
                            type="number"
                            value={settings.uploadLimit}
                            onChange={(e) => handleSettingChange(null, 'uploadLimit', parseInt(e.target.value))}
                            className="w-32 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </SettingCard>

            <SettingCard title="Allowed File Types" description="Manage supported file formats" icon={FileText}>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {settings.allowedFileTypes.map((type, index) => (
                            <span key={index} className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm">
                                <span>{type}</span>
                                <button
                                    onClick={() => {
                                        const newTypes = settings.allowedFileTypes.filter((_, i) => i !== index);
                                        handleSettingChange(null, 'allowedFileTypes', newTypes);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Add file type (e.g., pdf)"
                            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                    handleSettingChange(null, 'allowedFileTypes', [...settings.allowedFileTypes, e.target.value.trim()]);
                                    e.target.value = '';
                                }
                            }}
                        />
                    </div>
                </div>
            </SettingCard>

            <SettingCard title="Security & Processing" description="File scanning and processing options" icon={Shield}>
                <div className="space-y-4">
                    <Toggle
                        enabled={settings.virusScanning}
                        onChange={(value) => handleSettingChange(null, 'virusScanning', value)}
                        label="Virus Scanning"
                    />
                    <Toggle
                        enabled={settings.autoBackup}
                        onChange={(value) => handleSettingChange(null, 'autoBackup', value)}
                        label="Auto Backup Uploaded Files"
                    />
                </div>
            </SettingCard>
        </div>
    );

    const renderEmailSettings = () => (
        <div className="space-y-6">
            <SettingCard title="SMTP Configuration" description="Email server settings" icon={Mail}>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP Host</label>
                            <input
                                type="text"
                                value={settings.smtpHost}
                                onChange={(e) => handleSettingChange(null, 'smtpHost', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP Port</label>
                            <input
                                type="number"
                                value={settings.smtpPort}
                                onChange={(e) => handleSettingChange(null, 'smtpPort', parseInt(e.target.value))}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP Username</label>
                        <input
                            type="email"
                            value={settings.smtpUser}
                            onChange={(e) => handleSettingChange(null, 'smtpUser', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={settings.smtpPassword}
                                onChange={(e) => handleSettingChange(null, 'smtpPassword', e.target.value)}
                                className="w-full px-3 py-2 pr-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                            Test Connection
                        </button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Send a test email to verify settings</span>
                    </div>
                </div>
            </SettingCard>

            <SettingCard title="Email Notifications" description="Configure when to send emails" icon={Bell}>
                <div className="space-y-4">
                    <Toggle
                        enabled={settings.emailNotifications}
                        onChange={(value) => handleSettingChange(null, 'emailNotifications', value)}
                        label="Enable Email Notifications"
                    />
                </div>
            </SettingCard>
        </div>
    );

    const renderNotificationSettings = () => (
        <div className="space-y-6">
            <SettingCard title="Notification Preferences" description="Choose which events trigger notifications" icon={Bell}>
                <div className="space-y-4">
                    <Toggle
                        enabled={settings.notifications.newUploads}
                        onChange={(value) => handleSettingChange('notifications', 'newUploads', value)}
                        label="New File Uploads"
                    />
                    <Toggle
                        enabled={settings.notifications.failedUploads}
                        onChange={(value) => handleSettingChange('notifications', 'failedUploads', value)}
                        label="Failed Uploads"
                    />
                    <Toggle
                        enabled={settings.notifications.systemAlerts}
                        onChange={(value) => handleSettingChange('notifications', 'systemAlerts', value)}
                        label="System Alerts"
                    />
                    <Toggle
                        enabled={settings.notifications.securityEvents}
                        onChange={(value) => handleSettingChange('notifications', 'securityEvents', value)}
                        label="Security Events"
                    />
                    <Toggle
                        enabled={settings.notifications.weeklyReports}
                        onChange={(value) => handleSettingChange('notifications', 'weeklyReports', value)}
                        label="Weekly Reports"
                    />
                </div>
            </SettingCard>
        </div>
    );

    const renderPerformanceSettings = () => (
        <div className="space-y-6">
            <SettingCard title="Caching" description="Improve performance with caching" icon={Zap}>
                <div className="space-y-4">
                    <Toggle
                        enabled={settings.cacheEnabled}
                        onChange={(value) => handleSettingChange(null, 'cacheEnabled', value)}
                        label="Enable Caching"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cache Duration (seconds)</label>
                        <input
                            type="number"
                            value={settings.cacheDuration}
                            onChange={(e) => handleSettingChange(null, 'cacheDuration', parseInt(e.target.value))}
                            className="w-32 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </SettingCard>

            <SettingCard title="Optimization" description="Performance optimization settings" icon={Activity}>
                <div className="space-y-4">
                    <Toggle
                        enabled={settings.compressionEnabled}
                        onChange={(value) => handleSettingChange(null, 'compressionEnabled', value)}
                        label="Enable Compression"
                    />
                    <Toggle
                        enabled={settings.cdnEnabled}
                        onChange={(value) => handleSettingChange(null, 'cdnEnabled', value)}
                        label="CDN Integration"
                    />
                </div>
            </SettingCard>
        </div>
    );

    const renderBackupSettings = () => (
        <div className="space-y-6">
            <SettingCard title="Backup Configuration" description="Automated backup settings" icon={Database}>
                <div className="space-y-4">
                    <Toggle
                        enabled={settings.autoBackup}
                        onChange={(value) => handleSettingChange(null, 'autoBackup', value)}
                        label="Enable Auto Backup"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Backup Frequency</label>
                        <select
                            value={settings.backupFrequency}
                            onChange={(e) => handleSettingChange(null, 'backupFrequency', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Backup Retention (days)</label>
                        <input
                            type="number"
                            value={settings.backupRetention}
                            onChange={(e) => handleSettingChange(null, 'backupRetention', parseInt(e.target.value))}
                            className="w-32 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        />
                    </div>
                    <Toggle
                        enabled={settings.cloudBackup}
                        onChange={(value) => handleSettingChange(null, 'cloudBackup', value)}
                        label="Cloud Backup"
                    />
                </div>
            </SettingCard>

            <SettingCard title="Manual Backup" description="Create backups on demand" icon={Download}>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                            Create Backup Now
                        </button>
                        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                            Download Latest Backup
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last backup: 2 hours ago (15.2 MB)
                    </p>
                </div>
            </SettingCard>
        </div>
    );

    const renderUserSettings = () => (
        <div className="space-y-6">
            <SettingCard title="User Registration" description="Control user registration settings" icon={Users}>
                <div className="space-y-4">
                    <Toggle
                        enabled={true}
                        onChange={() => { }}
                        label="Allow New Registrations"
                    />
                    <Toggle
                        enabled={false}
                        onChange={() => { }}
                        label="Require Email Verification"
                    />
                    <Toggle
                        enabled={true}
                        onChange={() => { }}
                        label="Require Admin Approval"
                    />
                </div>
            </SettingCard>

            <SettingCard title="User Roles & Permissions" description="Manage user access levels" icon={Shield}>
                <div className="space-y-4">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-2 font-medium text-gray-600 dark:text-gray-300">Role</th>
                                    <th className="text-left py-2 font-medium text-gray-600 dark:text-gray-300">Upload</th>
                                    <th className="text-left py-2 font-medium text-gray-600 dark:text-gray-300">View</th>
                                    <th className="text-left py-2 font-medium text-gray-600 dark:text-gray-300">Admin</th>
                                    <th className="text-left py-2 font-medium text-gray-600 dark:text-gray-300">Users</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100 dark:border-gray-700">
                                    <td className="py-3 text-gray-900 dark:text-white">Admin</td>
                                    <td className="py-3"><CheckCircle className="w-5 h-5 text-green-500" /></td>
                                    <td className="py-3"><CheckCircle className="w-5 h-5 text-green-500" /></td>
                                    <td className="py-3"><CheckCircle className="w-5 h-5 text-green-500" /></td>
                                    <td className="py-3"><CheckCircle className="w-5 h-5 text-green-500" /></td>
                                </tr>
                                <tr className="border-b border-gray-100 dark:border-gray-700">
                                    <td className="py-3 text-gray-900 dark:text-white">Editor</td>
                                    <td className="py-3"><CheckCircle className="w-5 h-5 text-green-500" /></td>
                                    <td className="py-3"><CheckCircle className="w-5 h-5 text-green-500" /></td>
                                    <td className="py-3"><X className="w-5 h-5 text-red-500" /></td>
                                    <td className="py-3"><X className="w-5 h-5 text-red-500" /></td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-gray-900 dark:text-white">Viewer</td>
                                    <td className="py-3"><X className="w-5 h-5 text-red-500" /></td>
                                    <td className="py-3"><CheckCircle className="w-5 h-5 text-green-500" /></td>
                                    <td className="py-3"><X className="w-5 h-5 text-red-500" /></td>
                                    <td className="py-3"><X className="w-5 h-5 text-red-500" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </SettingCard>

            <SettingCard title="User Activity" description="Monitor and manage user sessions" icon={Activity}>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">Active Users</p>
                                    <p className="text-xl font-bold text-blue-900 dark:text-blue-100">24</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                <div>
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400">Avg. Session</p>
                                    <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">32m</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                <div>
                                    <p className="text-sm text-amber-600 dark:text-amber-400">Suspended</p>
                                    <p className="text-xl font-bold text-amber-900 dark:text-amber-100">3</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                            Force Logout All Users
                        </button>
                        <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors">
                            Clear Inactive Sessions
                        </button>
                    </div>
                </div>
            </SettingCard>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general': return renderGeneralSettings();
            case 'security': return renderSecuritySettings();
            case 'uploads': return renderUploadSettings();
            case 'email': return renderEmailSettings();
            case 'notifications': return renderNotificationSettings();
            case 'performance': return renderPerformanceSettings();
            case 'backup': return renderBackupSettings();
            case 'users': return renderUserSettings();
            default: return renderGeneralSettings();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Configure your admin dashboard and system preferences</p>
                </div>
                <div className="flex items-center space-x-3">
                    {saved && (
                        <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-lg">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Settings saved successfully!</span>
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="flex overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-96">
                {renderTabContent()}
            </div>

            {/* Footer Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Need Help?</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Check our documentation or contact support</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <HelpCircle className="w-4 h-4" />
                            <span>Documentation</span>
                            <ExternalLink className="w-3 h-3" />
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span>Contact Support</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* System Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                        <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">System Status</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">CPU Usage</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">45%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Memory</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">2.1GB / 8GB</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">45GB / 100GB</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                        <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="text-emerald-600 dark:text-emerald-400">•</span> Settings updated 5m ago
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="text-blue-600 dark:text-blue-400">•</span> User logged in 12m ago
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="text-amber-600 dark:text-amber-400">•</span> Backup completed 1h ago
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                        <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Quick Stats</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Total Users</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">1,247</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Files Uploaded</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">8,432</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Storage Used</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">45.2GB</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;