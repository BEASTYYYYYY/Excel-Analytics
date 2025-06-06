// backend/firebaseAdmin.js
import admin from 'firebase-admin';
const serviceAccount = JSON.parse(
    process.env.GOOGLE_SERVICE_ACCOUNT // Path to your Firebase service account
);
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
export default admin;
export const db = admin.firestore();
export const auth = admin.auth();