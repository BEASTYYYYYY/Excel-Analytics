import mongoose from 'mongoose';

const fileUploadHistorySchema = new mongoose.Schema(
    {
        filename: { type: String, required: true },
        uploadDate: { type: Date, required: true },
        fileSize: { type: String, required: true },
        status: { type: String, required: true },
        parsedData: { type: Object, required: true },
        userId: { type: String, required: true, index: true }, 
        // Add userId field with index for faster queries
    },
    { timestamps: true }
);

const FileUploadHistory = mongoose.model('FileUploadHistory', fileUploadHistorySchema);

export default FileUploadHistory;