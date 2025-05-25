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
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Instance method to check if user is admin
userSchema.methods.isAdmin = function () {
    return this.role === 'admin' || this.role === 'superadmin';
};

// Instance method to check if user is superadmin
userSchema.methods.isSuperAdmin = function () {
    return this.role === 'superadmin';
};

const User = mongoose.model('User', userSchema);
export default User;