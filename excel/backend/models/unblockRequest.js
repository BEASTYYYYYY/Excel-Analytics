import mongoose from 'mongoose';

const unblockRequestSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String },          // ✅ new
    email: { type: String },         // ✅ new
    reason: { type: String },        // ✅ new
    urgency: { type: String },       // ✅ new
    message: { type: String, required: true },
    reviewed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("UnblockRequest", unblockRequestSchema);
