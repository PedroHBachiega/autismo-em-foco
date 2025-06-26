import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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
export const storage = getStorage(app);
export const messaging = getMessaging(app);

// Função para solicitar permissão e obter token FCM
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BJcUE5sFsRWthy4ta0PLFXegbLAlusa01wEVN2Zw_-44K8RAfNK7TaZf2DPwVKkBzwiYH6c1pb05T2VutvqpBr4' // Você precisará gerar isso no console Firebase
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error('Erro ao solicitar permissão de notificação:', error);
    return null;
  }
};

// Função para escutar mensagens em primeiro plano
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
