import mongoose from 'mongoose';

const canvasDataSchema = new mongoose.Schema({
    data: {
        type: Object,
        required: true,
    },
}, { timestamps: true });

const CanvasData = mongoose.model('CanvasData', canvasDataSchema);

export default CanvasData;
