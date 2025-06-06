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
router.use(verifyFirebaseToken);
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
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            fs.unlinkSync(filePath);
            return res.status(400).json({
                success: false,
                message: 'No data found in the uploaded file'
            });
        }
        const fileUploadHistory = new FileUploadHistory({
            filename: req.file.originalname,
            uploadDate: new Date(),
            fileSize: (req.file.size / 1024).toFixed(2) + ' KB',
            status: 'Processed',
            parsedData: jsonData, // ⬅️ Store raw rows
            userId: req.user.uid,
            user: req.user.uid 
        });
        await fileUploadHistory.save();
        fs.unlinkSync(filePath);

        return res.json({
            success: true,
            message: 'File processed successfully',
            data: jsonData, // ⬅️ Return full raw data
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

// Modified analyze/:id endpoint for fileUpload.js
// Replace the existing analyze/:id endpoint with this code

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
        const parsedData = fileRecord.parsedData || [];
        // Make sure parsedData is a valid array before proceeding
        if (!Array.isArray(parsedData) || parsedData.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid data found in file record or empty dataset'
            });
        }

        // Get all numeric columns to analyze
        const numericColumns = {};
        const firstRow = parsedData[0];

        // Identify numeric columns in the dataset
        Object.keys(firstRow).forEach(column => {
            // Check if at least 70% of values in this column are numeric
            const numericCount = parsedData.reduce((count, row) => {
                const val = row[column];
                return (val !== undefined && val !== null && !isNaN(Number(val))) ? count + 1 : count;
            }, 0);

            if (numericCount >= parsedData.length * 0.7) {
                numericColumns[column] = {
                    sum: 0,
                    count: 0,
                    highest: { value: -Infinity, rowIndex: -1 },
                    lowest: { value: Infinity, rowIndex: -1 }
                };
            }
        });

        // Calculate statistics for each numeric column
        parsedData.forEach((row, rowIndex) => {
            Object.keys(numericColumns).forEach(column => {
                if (row[column] !== undefined && row[column] !== null) {
                    const numValue = Number(row[column]);
                    if (!isNaN(numValue)) {
                        numericColumns[column].sum += numValue;
                        numericColumns[column].count++;

                        // Track highest
                        if (numValue > numericColumns[column].highest.value) {
                            numericColumns[column].highest = { value: numValue, rowIndex };
                        }

                        // Track lowest
                        if (numValue < numericColumns[column].lowest.value) {
                            numericColumns[column].lowest = { value: numValue, rowIndex };
                        }
                    }
                }
            });
        });

        // Format the analysis results
        const analysis = {
            totalRows: parsedData.length,
            columns: Object.keys(firstRow),
            numericColumns: {},
            summaryStatistics: {}
        };

        // Calculate averages and format results
        Object.keys(numericColumns).forEach(column => {
            const stats = numericColumns[column];
            const average = stats.count > 0 ? stats.sum / stats.count : 0;

            analysis.numericColumns[column] = {
                average: Number(average.toFixed(2)),
                highest: {
                    value: stats.highest.value,
                    row: stats.highest.rowIndex >= 0 ? parsedData[stats.highest.rowIndex] : null
                },
                lowest: {
                    value: stats.lowest.value,
                    row: stats.lowest.rowIndex >= 0 ? parsedData[stats.lowest.rowIndex] : null
                }
            };
        });

        // Add aggregate statistics
        analysis.summaryStatistics = {
            rowCount: parsedData.length,
            columnCount: Object.keys(firstRow).length,
            numericColumnCount: Object.keys(numericColumns).length
        };

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