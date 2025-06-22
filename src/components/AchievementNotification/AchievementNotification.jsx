import React, { useState, useEffect } from 'react';
import Badge from '../Badge/Badge';
import styles from './AchievementNotification.module.css';

const AchievementNotification = ({ badge, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.notification} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.trophy}>🎉</span>
          <h3>Nova Conquista!</h3>
        </div>
        <Badge badge={badge} size="large" />
        <p className={styles.description}>{badge.description}</p>
      </div>
    </div>
  );
};

export default AchievementNotification;