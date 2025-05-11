
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
// import { getFirestore, type Firestore } from "firebase/firestore"; // Commented out
// import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

if (!firebaseConfig.apiKey) {
  console.error(
    "Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing or undefined. " +
    "Please ensure it is correctly set in your .env.local file and that your Next.js " +
    "server has been restarted after changes to .env files."
  );
}
if (!firebaseConfig.projectId) {
  console.error(
    "Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is missing or undefined. " +
    "Please ensure it is correctly set in your .env.local file."
  );
}

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);
// const db: Firestore = getFirestore(app); // Commented out: Firestore instance
// const storage: FirebaseStorage = getStorage(app);

// Export db for now, but it should be phased out.
// Components will fetch from API routes that query MySQL.
// export { app, auth, db /*, storage */ }; // Original export
export { app, auth /*, storage */ }; // Export without db for now
