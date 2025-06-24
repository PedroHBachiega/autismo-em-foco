// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthentication } from '../hooks/useAuthentication';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  // usa o hook real de auth (Firebase)
  const { user, userProfile, loading } = useAuthentication();

  // enquanto estiver carregando o estado inicial, pode retornar null ou um spinner
  if (loading) {
    return null; // ou um <Spinner />
  }

  // não logado → login com mensagem
  if (!user) {
    const message = location.pathname.includes('comunidade') 
      ? 'Você precisa fazer login para acessar a Comunidade'
      : 'Você precisa fazer login para acessar os Agendamentos';
    
    return <Navigate 
      to="/login" 
      replace 
      state={{ message, from: location.pathname }} 
    />;
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
