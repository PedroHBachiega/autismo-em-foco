import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthentication } from '../hooks/useAuthentication';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const { user, userProfile, loading } = useAuthentication();

  // enquanto ainda estiver carregando, não renderiza nada
  if (loading) return null;

  // se não estiver logado, redireciona com mensagem — apenas uma vez
  if (!user) {
    const message = location.pathname.includes('comunidade')
      ? 'Você precisa fazer login para acessar a Comunidade'
      : 'Você precisa fazer login para acessar os Agendamentos';

    return (
      <Navigate
        to="/login"
        replace
        state={{ message, from: location.pathname }}
      />
    );
  }

  
  if (
    allowedRoles.length > 0 &&
    (!userProfile || !allowedRoles.includes(userProfile.userType))
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
