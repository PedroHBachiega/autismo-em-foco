import React from 'react';
import Button from './Button';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, title, children, confirmText, onConfirm, cancelText, confirmVariant = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {title && <h3>{title}</h3>}
        <div className={styles.modalContent}>
          {children}
        </div>
        <div className={styles.modalActions}>
          {cancelText && (
            <Button 
              variant="secondary" 
              onClick={onClose}
              size="medium"
            >
              {cancelText}
            </Button>
          )}
          {confirmText && onConfirm && (
            <Button 
              variant={confirmVariant}
              onClick={onConfirm}
              size="medium"
            >
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;