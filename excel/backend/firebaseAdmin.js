// backend/firebaseAdmin.js
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
    readFileSync('./serviceAccountKey-2.json', 'utf8') // Path to your Firebase service account
);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export default admin;
export const db = admin.firestore();
export const auth = admin.auth();