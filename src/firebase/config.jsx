import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBw1B0kDrCvKOZHCE9c-lpWff-aL0YXISI",
  authDomain: "autismoemfoco-9117e.firebaseapp.com",
  projectId: "autismoemfoco-9117e",
  storageBucket: "autismoemfoco-9117e.firebasestorage.app",
  messagingSenderId: "241125743479",
  appId: "1:241125743479:web:8a11e9ae8021b6a95b1f72",
  measurementId: "G-MTHJCGZ3EJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);