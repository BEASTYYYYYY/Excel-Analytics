// backend/routes/fileUpload.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import xlsx from 'xlsx';
import fs from 'fs';
import FileUploadHistory from '../models/fileUploadHistory.js';  // Import the model
import { verifyFirebaseToken } from '../middleware/verifyToken.js'; // Import auth middleware

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Store files in /uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Apply authentication middleware to all routes
router.use(verifyFirebaseToken);

// Get all file upload history for the current user
router.get('/history', async (req, res) => {
    try {
        // Filter history by the current user's ID
        const history = await FileUploadHistory.find({ userId: req.user.uid })
            .sort({ uploadDate: -1 }) // Sort by most recent first
            .limit(50); // Limit to reasonable number of records

        return res.json({
            success: true,
            history
        });
    } catch (error) {
        console.error('Error fetching upload history:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving upload history'
        });
    }
});

router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const filePath = req.file.path;

        // Read workbook
        const workbook = xlsx.readFile(filePath);

        if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
            fs.unlinkSync(filePath); // Clean up uploaded file
            return res.status(400).json({
                success: false,
                message: 'Invalid Excel file format'
            });
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Get data from worksheet
        const data = xlsx.utils.sheet_to_json(worksheet);

        if (!data || !Array.isArray(data) || data.length === 0) {
            fs.unlinkSync(filePath); // Clean up uploaded file
            return res.status(400).json({
                success: false,
                message: 'No data found in the uploaded file'
            });
        }

        // Process data into chart-friendly format
        const chartData = {};

        // First determine column names to use for key and value
        const firstRow = data[0];
        const columns = Object.keys(firstRow);

        if (columns.length < 1) {
            fs.unlinkSync(filePath);
            return res.status(400).json({
                success: false,
                message: 'File must contain at least two columns of data'
            });
        }

        // Use first column as key and second column as value by default
        const keyColumn = columns[0];
        const valueColumn = columns.length > 1 ? columns[1] : null;

        if (valueColumn) {
            // We have two or more columns - use key-value pairs
            data.forEach((entry) => {
                const key = String(entry[keyColumn] || 'undefined');
                const rawValue = entry[valueColumn];

                // Handle different value types
                if (rawValue === undefined || rawValue === null) {
                    // Count null/undefined values
                    chartData[key] = (chartData[key] || 0) + 1;
                } else if (typeof rawValue === 'number' || !isNaN(Number(rawValue))) {
                    // Numeric values - sum them
                    chartData[key] = (chartData[key] || 0) + Number(rawValue);
                } else {
                    // For string values, count occurrences
                    if (!chartData[key]) chartData[key] = 0;
                    chartData[key] += 1;
                }
            });
        } else {
            // We only have one column - count occurrences of each value
            data.forEach((entry) => {
                const key = String(entry[keyColumn] || 'undefined');
                chartData[key] = (chartData[key] || 0) + 1;
            });
        }


        // If chartData is empty after processing, return an error
        if (Object.keys(chartData).length === 0) {
            fs.unlinkSync(filePath);
            return res.status(400).json({
                success: false,
                message: 'Could not extract valid numeric data from the file'
            });
        }

        // Save the upload history to MongoDB with user ID
        const fileUploadHistory = new FileUploadHistory({
            filename: req.file.originalname,
            uploadDate: new Date(),
            fileSize: (req.file.size / 1024).toFixed(2) + ' KB',
            status: 'Processed',
            parsedData: chartData,
            userId: req.user.uid, // Associate with the current user
        });

        await fileUploadHistory.save();

        // Clean up uploaded file after processing
        fs.unlinkSync(filePath);

        return res.json({
            success: true,
            message: 'File processed successfully',
            data: chartData,
            fileDetails: {
                id: fileUploadHistory._id,
                filename: fileUploadHistory.filename,
                uploadDate: fileUploadHistory.uploadDate,
                fileSize: fileUploadHistory.fileSize,
                status: fileUploadHistory.status
            }
        });
    } catch (error) {
        console.error('Upload error:', error.message);

        // Clean up the file if it was uploaded
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError.message);
            }
        }

        return res.status(500).json({
            success: false,
            message: 'Error processing file: ' + error.message,
        });
    }
});

// Get specific file data by ID - check if user owns the file
router.get('/:id', async (req, res) => {
    try {
        const fileRecord = await FileUploadHistory.findOne({
            _id: req.params.id,
            userId: req.user.uid // Ensure user can only access their own files
        });

        if (!fileRecord) {
            return res.status(404).json({
                success: false,
                message: 'File record not found or you do not have permission to access it'
            });
        }

        return res.json({
            success: true,
            data: fileRecord.parsedData,
            fileDetails: {
                id: fileRecord._id,
                filename: fileRecord.filename,
                uploadDate: fileRecord.uploadDate,
                fileSize: fileRecord.fileSize,
                status: fileRecord.status
            }
        });
    } catch (error) {
        console.error('Error fetching file data:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving file data'
        });
    }
});

// DELETE specific file record by ID - check if user owns the file
router.delete('/:id', async (req, res) => {
    try {
        const fileRecord = await FileUploadHistory.findOne({
            _id: req.params.id,
            userId: req.user.uid // Ensure user can only delete their own files
        });

        if (!fileRecord) {
            return res.status(404).json({
                success: false,
                message: 'File record not found or you do not have permission to delete it'
            });
        }

        // Delete the record from the database
        await FileUploadHistory.findByIdAndDelete(req.params.id);

        return res.json({
            success: true,
            message: 'File record deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting file record:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error deleting file record'
        });
    }
});

router.get('/analyze/:id', async (req, res) => {
    try {
        const fileRecord = await FileUploadHistory.findOne({
            _id: req.params.id,
            userId: req.user.uid // Ensure user can only analyze their own files
        });

        if (!fileRecord) {
            return res.status(404).json({
                success: false,
                message: 'File record not found or you do not have permission to access it'
            });
        }

        // Get the parsed data with safety check
        const parsedData = fileRecord.parsedData || {};

        // Make sure parsedData is a valid object before proceeding
        if (!parsedData || typeof parsedData !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Invalid data format in file record'
            });
        }

        // Basic analysis
        const analysis = {
            totalEntries: Object.keys(parsedData).length,
            summary: {},
            highestValue: { key: null, value: -Infinity },
            lowestValue: { key: null, value: Infinity },
            average: 0
        };

        // Calculate statistics
        let sum = 0;
        let count = 0;

        // Safely iterate through parsedData
        Object.entries(parsedData).forEach(([key, value]) => {
            // Convert value to number if it's not already
            const numValue = Number(value);

            // Only process if it's a valid number
            if (!isNaN(numValue)) {
                // Track highest and lowest values
                if (numValue > analysis.highestValue.value) {
                    analysis.highestValue = { key, value: numValue };
                }

                if (numValue < analysis.lowestValue.value) {
                    analysis.lowestValue = { key, value: numValue };
                }

                // Add to summary
                analysis.summary[key] = numValue;

                // For average calculation
                sum += numValue;
                count++;
            }
        });

        // Calculate average if there are entries
        if (count > 0) {
            analysis.average = (sum / count).toFixed(2);
        } else {
            analysis.average = "0.00";
        }

        return res.json({
            success: true,
            analysis,
            fileDetails: {
                id: fileRecord._id,
                filename: fileRecord.filename,
                uploadDate: fileRecord.uploadDate
            }
        });
    } catch (error) {
        console.error('Error analyzing file data:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error analyzing file data: ' + error.message
        });
    }
});

export default router;