import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    emailNotifications: { type: Boolean, default: true },
    darkModeDefault: { type: Boolean, default: false },
    language: { type: String, default: 'english' }
}, { _id: false });

const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true }, // Firebase UID
    name: String,
    email: { type: String, required: true },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin'],
        default: 'user'
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },
    settings: { type: settingsSchema, default: () => ({}) },
    unblockNotified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});
userSchema.methods.isAdmin = function () {
    return this.role === 'admin' || this.role === 'superadmin';
};
userSchema.methods.isSuperAdmin = function () {
    return this.role === 'superadmin';
};
const User = mongoose.model('User', userSchema);
export default User;