import { useState, useCallback } from 'react';
import api from '../services/apiClient';

export default function useApiAuthentication() {
  const [user, setUser] = useState(null);

  const saveSession = useCallback((authResponse) => {
    if (!authResponse) return;
    localStorage.setItem('api_token', authResponse.token);
    localStorage.setItem('api_user', JSON.stringify(authResponse));
    setUser(authResponse);
  }, []);

  const register = useCallback(async ({ email, password, displayName, userType = 'usuario' }) => {
    const res = await api.post('/auth/register', { email, password, displayName, userType });
    saveSession(res);
    return res;
  }, [saveSession]);

  const login = useCallback(async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    saveSession(res);
    return res;
  }, [saveSession]);

  const logout = useCallback(() => {
    localStorage.removeItem('api_token');
    localStorage.removeItem('api_user');
    setUser(null);
  }, []);

  const hydrate = useCallback(() => {
    try {
      const raw = localStorage.getItem('api_user');
      if (raw) setUser(JSON.parse(raw));
    } catch (_) {}
  }, []);

  return { user, register, login, logout, hydrate };
}