import admin from '../firebaseAdmin.js';
import User from '../models/userModel.js'; // ✅ Add this

export const verifyFirebaseToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name,
            photo: decodedToken.picture, // fallback if needed
        };
        // ✅ Update lastLogin and loginCount in MongoDB
        try {
            const dbUser = await User.findOne({ uid: decodedToken.uid });

            if (dbUser) {
                if (!dbUser.isActive) {
                    return res.status(403).json({ message: 'Account is blocked' });
                }

                dbUser.lastLogin = new Date();
                dbUser.loginCount = (dbUser.loginCount || 0) + 1;
                await dbUser.save();
            }

        } catch (e) {
            console.error("Error updating lastLogin:", e.message);
        }
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
