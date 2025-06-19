
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

// Hook para consumir o contexto em qualquer componente
export function useAuthValue() {
  return useContext(AuthContext);
}