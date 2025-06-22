import React, { createContext, useContext } from 'react';

// Cria o contexto para o GTM
export const GTMContext = createContext();

// Provedor do contexto GTM
export function GTMProvider({ children }) {
  // Garante que o dataLayer existe
  window.dataLayer = window.dataLayer || [];

  // Função para enviar eventos para o GTM
  const pushEvent = (event) => {
    if (window.dataLayer) {
      window.dataLayer.push(event);
      console.log('GTM Event:', event); // Para debug
    }
  };

  // Eventos específicos
  const trackLogin = (method) => {
    pushEvent({
      event: 'login',
      loginMethod: method // 'email' ou 'google'
    });
  };

  const trackPostCreation = (postId, tags) => {
    pushEvent({
      event: 'post_created',
      postId,
      postTags: tags
    });
  };

  const trackAppointmentScheduled = (especialidade, profissionalId) => {
    pushEvent({
      event: 'appointment_scheduled',
      especialidade,
      profissionalId
    });
  };

  // Valores e funções expostos pelo contexto
  const value = {
    pushEvent,
    trackLogin,
    trackPostCreation,
    trackAppointmentScheduled
  };

  return (
    <GTMContext.Provider value={value}>
      {children}
    </GTMContext.Provider>
  );
}

// Hook para usar o contexto GTM
export function useGTM() {
  return useContext(GTMContext);
}