
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDEz9mYYb91Kz2TV_YixODPDePp4jQ-aro",
  authDomain: "analyzed-a6a3b.firebaseapp.com",
  projectId: "analyzed-a6a3b",
  storageBucket: "analyzed-a6a3b.appspot.com",
  messagingSenderId: "652017466450",
  appId: "1:652017466450:web:8d04d298961db4a3fb738b",
  measurementId: "G-ZS02K5LZYV"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export { app, db, auth, analytics };
