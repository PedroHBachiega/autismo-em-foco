// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthentication } from '../hooks/useAuthentication';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  // usa o hook real de auth (Firebase)
  const { user, userProfile, loading } = useAuthentication();

  // enquanto estiver carregando o estado inicial, pode retornar null ou um spinner
  if (loading) {
    return null; // ou um <Spinner />
  }

  // não logado → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // se houver papéis restritos e o usuário não for um dos permitidos
  if (
    allowedRoles.length > 0 &&
    (!userProfile || !allowedRoles.includes(userProfile.userType))
  ) {
    return <Navigate to="/" replace />;
  }

  // caso contrário → libera a rota
  return children;
};

export default ProtectedRoute;
