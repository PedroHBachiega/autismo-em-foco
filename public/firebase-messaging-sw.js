importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBw1B0kDrCvKOZHCE9c-lpWff-aL0YXISI",
  authDomain: "autismoemfoco-9117e.firebaseapp.com",
  projectId: "autismoemfoco-9117e",
  storageBucket: "autismoemfoco-9117e.firebasestorage.app",
  messagingSenderId: "241125743479",
  appId: "1:241125743479:web:8a11e9ae8021b6a95b1f72"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Mensagem recebida em background:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logotipo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});