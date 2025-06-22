/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import { useAuthentication } from "../hooks/useAuthentication";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useAuthentication();

  if (auth.loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg">Carregando sessão…</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthValue() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthValue deve ser usado dentro de <AuthProvider>");
  }
  return context;
}
