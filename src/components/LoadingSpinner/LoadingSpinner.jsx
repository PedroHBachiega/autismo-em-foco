import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 'medium', message = 'Carregando...' }) => {
  const spinnerClasses = {
    small: styles.spinnerSmall,
    medium: styles.spinnerMedium,
    large: styles.spinnerLarge
  };

  return (
    <div className={styles.loadingContainer}>
      <div className={`${styles.spinner} ${spinnerClasses[size]}`}></div>
      {message && <p className={styles.loadingMessage}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;