import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkdylfQ_B1enXYQ4XmsFxmsYaLnJ5zrdo",
  authDomain: "pi-saudetec.firebaseapp.com",
  projectId: "pi-saudetec",
  storageBucket: "pi-saudetec.firebasestorage.app",
  messagingSenderId: "940410171334",
  appId: "1:940410171334:web:811c2436acc7714c314cc7",
  measurementId: "G-EE4MS5GH14"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);