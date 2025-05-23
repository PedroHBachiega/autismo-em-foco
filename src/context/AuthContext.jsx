// src/context/AuthContext.jsx

import React, { createContext, useContext } from 'react';
import { useAuthentication } from '../hooks/useAuthentication';

// 1. Cria o contexto
const AuthContext = createContext();

// 2. AuthProvider integra TODO o retorno de useAuthentication
export function AuthProvider({ children }) {
  // 🔥 useAuthentication já cuida de onAuthStateChanged, login, logout, erros e loading
  const auth = useAuthentication();
  // auth = { user, loading, error, login, loginWithGoogle, logout }

  // Se quiser apresentação mais sofisticada de “aguarde”, 
  // você pode substituir o return abaixo por um Skeleton ou Spinner corporativo
  if (auth.loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-600">Carregando sessão…</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Hook para consumir o contexto em qualquer componente
export function useAuthValue() {
  return useContext(AuthContext);
}
