import React, { useEffect } from 'react';
import { useNotifications } from '../../Hooks/useNotifications';
import styles from './NotificationManager.module.css';

const NotificationManager = () => {
  const { notification, enableNotifications, clearNotification } = useNotifications();

  useEffect(() => {
    // Solicitar permissão automaticamente quando o componente monta
    enableNotifications();
  }, []);

  useEffect(() => {
    if (notification) {
      // Auto-limpar notificação após 5 segundos
      const timer = setTimeout(() => {
        clearNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  return (
    <div className={styles.notificationContainer}>
      <div className={styles.notification}>
        <h4>{notification.title}</h4>
        <p>{notification.body}</p>
        <button onClick={clearNotification} className={styles.closeButton}>
          ×
        </button>
      </div>
    </div>
  );
};

export default NotificationManager;