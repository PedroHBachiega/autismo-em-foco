// src/context/AuthContext.jsx

import React, { createContext, useContext } from 'react';
import { useAuthentication } from '../Hooks/UseAuthentication';


const AuthContext = createContext();

export function AuthProvider({ children }) {

  const auth = useAuthentication();
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
