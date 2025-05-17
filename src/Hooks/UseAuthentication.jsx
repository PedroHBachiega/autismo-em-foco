// src/hooks/useAuthentication.jsx
import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider
} from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate, useLocation } from "react-router-dom";

export function useAuthentication() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const googleProvider = new GoogleAuthProvider();

  // 1) Login com email/senha
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Email ou senha inválidos.");
    }
    setLoading(false);
  };

  // 2) Login com Google
  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Falha no login Google.");
    }
    setLoading(false);
  };

  // 3) Logout
  const logout = async () => {
    await auth.signOut();
    navigate("/Login", { replace: true });
  };

  // 4) Observa estado de auth e faz guard de rota
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      const publicPaths = ["/login", "/register"];
      if (!u && !publicPaths.includes(pathname)) {
        navigate("/", { replace: true });
      }
      // opcional: se user logado e estiver em /login ou /register, manda pro home
      if (u && publicPaths.includes(pathname)) {
        navigate("/", { replace: true });
      }
    });
    return () => unsub();
  }, [navigate, pathname]);

  return {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    logout
  };
}
