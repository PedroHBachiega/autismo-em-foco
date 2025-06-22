import React from 'react';
import styles from './Badge.module.css';

const Badge = ({ badge, size = 'medium', showTooltip = true }) => {
  return (
    <div className={`${styles.badge} ${styles[size]}`} title={showTooltip ? badge.description : ''}>
      <span className={styles.icon}>{badge.icon}</span>
      <span className={styles.name}>{badge.name}</span>
    </div>
  );
};

export default Badge;