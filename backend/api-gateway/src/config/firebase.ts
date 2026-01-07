import admin from 'firebase-admin';

const initializeFirebase = () => {
    if (process.env.NODE_ENV === "development") {
        console.log("⚠️ Firebase Admin disabled in development mode");
        return null;
    }

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL
            })
        });
    }

    return admin;
};

const firebaseAdmin = initializeFirebase();
export default firebaseAdmin;
