import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, title, children, confirmText, onConfirm, cancelText }) => {
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
            <button className={styles.modalCancelButton} onClick={onClose}>
              {cancelText}
            </button>
          )}
          {confirmText && onConfirm && (
            <button className={styles.modalConfirmButton} onClick={onConfirm}>
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;