import React from 'react';
import styles from '../Comunidade.module.css';

const LoadingSpinner = () => {
  return (
    <div className={styles.loadingSpinner}>
      <div className={styles.spinner}></div> <br />
      <p className={styles.loadingMessage}>Carregando posts...</p>
    </div>
  );
};

export default LoadingSpinner;