import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAUMG0WcxcbDnHwLbGZWQ8x1BSAnKmxsAw',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'e-commerce-c2663.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'e-commerce-c2663',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'e-commerce-c2663.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '30948958272',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:30948958272:web:bb25877ee0613c1f9effa5',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-DFXQNBQ7ZP',
};

const app = initializeApp(firebaseConfig);

const analyticsPromise = typeof window !== 'undefined'
  ? isAnalyticsSupported().then((supported) => (supported ? getAnalytics(app) : null))
  : Promise.resolve(null);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, analyticsPromise };

