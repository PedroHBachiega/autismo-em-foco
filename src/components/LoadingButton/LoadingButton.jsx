import React from 'react';
import styles from './LoadingButton.module.css';

const LoadingButton = ({
  type = 'button',
  onClick,
  loading = false,
  disabled = false,
  className = '',
  loadingText = 'Aguarde...',
  children,
  ariaLabel,
  style
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${styles.loadingButton} ${className}`}
      aria-busy={loading ? 'true' : 'false'}
      aria-label={ariaLabel}
      style={style}
    >
      {loading && (
        <span className={styles.spinner}></span>
      )}
      <span className={loading ? styles.buttonTextLoading : ''}>
        {loading ? loadingText : children}
      </span>
    </button>
  );
};

export default LoadingButton;