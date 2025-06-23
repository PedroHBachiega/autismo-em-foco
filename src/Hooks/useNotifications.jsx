import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, requestNotificationPermission, onMessageListener } from '../firebase/config';
import { useAuthValue } from '../context/AuthContext';

export const useNotifications = () => {
  const { user } = useAuthValue();
  const [notification, setNotification] = useState(null);

  // Solicitar permissão e salvar token
  const enableNotifications = async () => {
    if (!user) return;

    try {
      const token = await requestNotificationPermission();
      if (token) {
        // Salvar token no Firestore
        await setDoc(doc(db, 'fcmTokens', user.uid), {
          token,
          userId: user.uid,
          updatedAt: new Date()
        }, { merge: true });
        
        console.log('Token FCM salvo:', token);
        return true;
      }
    } catch (error) {
      console.error('Erro ao habilitar notificações:', error);
    }
    return false;
  };

  // Escutar notificações em primeiro plano
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onMessageListener()
      .then((payload) => {
        setNotification({
          title: payload.notification?.title,
          body: payload.notification?.body,
          data: payload.data
        });
      })
      .catch((err) => console.log('Erro ao escutar mensagens:', err));

    // Adicionar listener para eventos customizados de teste
    const handleCustomEvent = (event) => {
      const payload = event.detail;
      setNotification({
        title: payload.notification?.title,
        body: payload.notification?.body,
        data: payload.data
      });
    };

    window.addEventListener('fcm-message', handleCustomEvent);

    return () => {
      unsubscribe;
      window.removeEventListener('fcm-message', handleCustomEvent);
    };
  }, [user]);

  return {
    notification,
    enableNotifications,
    clearNotification: () => setNotification(null)
  };
};