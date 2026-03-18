const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// The service account key should be in .env as FIREBASE_SERVICE_ACCOUNT_KEY (JSON string)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };
