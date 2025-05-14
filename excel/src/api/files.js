import { Router } from 'express';
import admin from 'firebase-admin';
import { db } from '../../backend/firebaseAdmin.js';
// Keeping Firestore for metadata
const router = Router();
// Authentication middleware
const authenticateUser = async (req, res, next) => {
    try {
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
            return res.status(401).json({ message: 'No authentication token provided' });
        }
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Invalid authentication token' });
    }
};

// Get file metadata by ID
router.get('/:fileId', authenticateUser, async (req, res) => {
    try {
        const { fileId } = req.params;
        const userId = req.user.uid;
        // Get file document from Firestore
        const fileDoc = await db.collection('files').doc(fileId).get();
        if (!fileDoc.exists) {
            return res.status(404).json({ message: 'File not found' });
        }
        const fileData = fileDoc.data();
        // Check if user has access to this file
        if (fileData.userId !== userId) {
            return res.status(403).json({ message: 'Access denied to this file' });
        }
        return res.json({ success: true, file: fileData });
    } catch (error) {
        console.error('Error fetching file metadata:', error);
        return res.status(500).json({ message: 'Server error fetching file metadata' });
    }
});

router.get('/:fileId/content', authenticateUser, async (req, res) => {
    try {
        const { fileId } = req.params;
        const userId = req.user.uid;
        const fileDoc = await db.collection('files').doc(fileId).get();
        if (!fileDoc.exists) {
            return res.status(404).json({ message: 'File not found' });
        }
        const fileData = fileDoc.data();
        if (fileData.userId !== userId) {
            return res.status(403).json({ message: 'Access denied to this file' });
        }
    } catch (error) {
        console.error('Error fetching file content:', error);
        return res.status(500).json({ message: 'Server error fetching file content' });
    }
});
router.delete('/:fileId', authenticateUser, async (req, res) => {
    try {
        const { fileId } = req.params;
        const userId = req.user.uid;

        const fileDoc = await db.collection('files').doc(fileId).get();

        if (!fileDoc.exists) {
            return res.status(404).json({ message: 'File not found' });
        }
        const fileData = fileDoc.data();

        if (fileData.userId !== userId) {
            return res.status(403).json({ message: 'Access denied to this file' });
        }
        await db.collection('files').doc(fileId).delete();

        return res.json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        return res.status(500).json({ message: 'Server error deleting file' });
    }
});

export default router;