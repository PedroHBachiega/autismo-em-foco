// src/components/ProtectedRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthValue } from '../context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, userProfile } = useAuthValue()

  // não logado → login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // se tiver papéis restritos e o usuário não for um dos permitidos
  if (
    allowedRoles.length > 0 &&
    (!userProfile || !allowedRoles.includes(userProfile.userType))
  ) {
    return <Navigate to="/" replace />
  }

  // caso contrário → libera a rota
  return children
}

export default ProtectedRoute
