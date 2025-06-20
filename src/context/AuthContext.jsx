// src/context/AuthContext.jsx
import React, { createContext, useContext } from 'react'
import { useAuthentication } from '../hooks/useAuthentication'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const { loading, ...auth } = useAuthentication()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Carregando sessão…</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthValue() {
  return useContext(AuthContext)
}
