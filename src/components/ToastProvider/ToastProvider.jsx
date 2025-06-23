import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        // Configurações padrão para todos os toasts
        duration: 5000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          fontSize: '14px',
          maxWidth: '350px',
        },
        // Configurações específicas para cada tipo de toast
        success: {
          style: {
            background: '#E6F7E8',
            color: '#2E7D32',
          },
          iconTheme: {
            primary: '#2E7D32',
            secondary: '#FFFFFF',
          },
        },
        error: {
          style: {
            background: '#FEECEC',
            color: '#D32F2F',
          },
          iconTheme: {
            primary: '#D32F2F',
            secondary: '#FFFFFF',
          },
        },
      }}
    />
  );
};

export default ToastProvider;