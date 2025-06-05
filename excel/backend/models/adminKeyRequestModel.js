import mongoose from 'mongoose';

const adminKeyRequestSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    role: { type: String, required: true },
    requestedAt: { type: Date, default: Date.now }
});

const AdminKeyRequest = mongoose.model('AdminKeyRequest', adminKeyRequestSchema);
export default AdminKeyRequest;
