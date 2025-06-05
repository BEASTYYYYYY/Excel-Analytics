import mongoose from 'mongoose';

const adminKeySchema = new mongoose.Schema({
    hashedKey: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now }
});

const AdminKey = mongoose.model('AdminKey', adminKeySchema);
export default AdminKey;
