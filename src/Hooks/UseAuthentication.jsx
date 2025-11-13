// src/hooks/useAuthentication.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { signInWithCustomToken } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function useAuthentication() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem("aef_user");
    const savedToken = localStorage.getItem("aef_token");
    if (savedUser && savedToken) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setUserProfile({ ...parsed });
      } catch (_err) {
        console.warn("Falha ao ler usuário salvo", _err);
      }
    }
    setInitialLoading(false);

    const publicPaths = [
      "/login",
      "/register",
      "/sobreautismo",
      "/leisedireitos",
      "/eventos",
      "/tratamentos",
      "/sobre",
      "/recuperar-senha",
    ];
    if (!savedUser && !publicPaths.includes(pathname)) {
      navigate("/", { replace: true });
    }
  }, [navigate, pathname]);

  const login = async (email, senha) => {
    setActionLoading(true);
    setError(null);
    try {
      const resp = await api.post("/auth/login", { email, senha });
      await signInWithCustomToken(auth, resp.firebaseToken);
      localStorage.setItem("aef_token", resp.token);
      localStorage.setItem("aef_user", JSON.stringify(resp.user));
      setUser(resp.user);
      setUserProfile({ ...resp.user });
      try {
        const ref = doc(db, "users", resp.user.id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            uid: resp.user.id,
            email: resp.user.email,
            displayName: resp.user.nome || "",
            createdAt: new Date(),
          });
        }
      } catch (_err) {
        console.warn("Falha ao sincronizar perfil no Firestore", _err);
      }
      return true;
    } catch (err) {
      setError(err?.message || "Email ou senha inválidos.");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const register = async (nome, email, senha, userType = "usuario") => {
    setActionLoading(true);
    setError(null);
    try {
      const resp = await api.post("/auth/register", { nome, email, senha, userType });
      await signInWithCustomToken(auth, resp.firebaseToken);
      localStorage.setItem("aef_token", resp.token);
      localStorage.setItem("aef_user", JSON.stringify(resp.user));
      setUser(resp.user);
      setUserProfile({ ...resp.user });
      try {
        const ref = doc(db, "users", resp.user.id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            uid: resp.user.id,
            email: resp.user.email,
            displayName: resp.user.nome || "",
            userType: userType,
            createdAt: new Date(),
          });
        }
      } catch (_err) {
        console.warn("Falha ao sincronizar perfil no Firestore", _err);
      }
      return true;
    } catch (err) {
      setError(err?.message || "Erro ao criar conta.");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setError("Login com Google indisponível nesta versão.");
    return false;
  };

  const logout = async () => {
    localStorage.removeItem("aef_token");
    localStorage.removeItem("aef_user");
    setUser(null);
    setUserProfile(null);
    navigate("/login", { replace: true });
  };

  const resetPassword = async () => {
    setError("Recuperação de senha indisponível nesta versão.");
    return false;
  };

  return {
    user,
    userProfile,
    loading: initialLoading,
    actionLoading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
  };
}
