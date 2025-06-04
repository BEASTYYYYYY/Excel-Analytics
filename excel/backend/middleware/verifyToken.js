import admin from '../firebaseAdmin.js';
import User from '../models/userModel.js';

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
            photo: decodedToken.picture,
        };

        let dbUser = await User.findOne({ uid: decodedToken.uid });

        if (!dbUser) {
            dbUser = new User({
                uid: decodedToken.uid,
                email: decodedToken.email,
                name: decodedToken.name || '',
                photo: decodedToken.picture || '',
                role: 'user', // default role
                isActive: true,
                loginCount: 1,
                lastLogin: new Date()
            });
        } else {
            dbUser.lastLogin = new Date();
            dbUser.loginCount = (dbUser.loginCount || 0) + 1;
        }
        await dbUser.save();
        if (dbUser.role !== 'superadmin' && !dbUser.isActive) {
            if (!req.path.includes('/unblock-request') && !req.path.includes('/profile')) {
                return res.status(403).json({ message: 'Account is blocked' });
            }
        }
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
