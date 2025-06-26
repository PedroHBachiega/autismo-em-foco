import React from 'react';
import { FiLoader } from 'react-icons/fi';
import styles from './Button.module.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  loadingText = 'Aguarde...',
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    loading && styles.loading,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (loading) {
      return <FiLoader className={styles.spinner} />;
    }
    if (icon) {
      return <span className={styles.icon}>{icon}</span>;
    }
    return null;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          {renderIcon()}
          <span>{loadingText}</span>
        </>
      );
    }

    if (iconPosition === 'left') {
      return (
        <>
          {renderIcon()}
          <span>{children}</span>
        </>
      );
    }

    return (
      <>
        <span>{children}</span>
        {renderIcon()}
      </>
    );
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={loading || disabled}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;