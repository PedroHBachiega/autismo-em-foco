// src/hooks/useAuthentication.jsx
import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

export function useAuthentication() {
  // Estados de usuário e perfil
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Estado só para o carregamento inicial (auth + perfil)
  const [initialLoading, setInitialLoading] = useState(true);

  // Outros estados de ação (login, logout, reset…)
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const googleProvider = new GoogleAuthProvider();

  // Helper: busca o perfil no Firestore
  const fetchUserProfile = async (uid) => {
    try {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setUserProfile({ id: snap.id, ...data });
        return data;
      }
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
    }
    setUserProfile(null);
    return null;
  };

  // 5) Monitora o estado de auth (login persistido) e carrega perfil
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        await fetchUserProfile(u.uid);
      } else {
        setUser(null);
        setUserProfile(null);
      }

      // permite só uma vez, depois disso já tiramos o loading
      setInitialLoading(false);

      // redireciona quem não estiver logado numa rota privada
      const publicPaths = [
        "/login","/register","/sobreautismo","/leisedireitos",
        "/eventos","/tratamentos","/sobre","/recuperar-senha"
      ];
      if (!u && !publicPaths.includes(pathname)) {
        navigate("/", { replace: true });
      }
    });

    return () => unsub();
  }, [navigate, pathname]);

  // 1) Login com email/senha
  const login = async (email, password) => {
    setActionLoading(true);
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserProfile(cred.user.uid);
      navigate("/", { replace: true });
    } catch {
      setError("Email ou senha inválidos.");
    } finally {
      setActionLoading(false);
    }
  };

  // 2) Login com Google
  const loginWithGoogle = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await fetchUserProfile(result.user.uid);
      navigate("/", { replace: true });
    } catch {
      setError("Falha no login com Google.");
    } finally {
      setActionLoading(false);
    }
  };

  // 3) Logout
  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setUserProfile(null);
    navigate("/login", { replace: true });
  };

  // 4) Reset de senha
  const resetPassword = async (email) => {
    setActionLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      setError({
        "auth/user-not-found": "Email não encontrado.",
        "auth/invalid-email": "Email inválido."
      }[err.code] || "Erro ao enviar email de redefinição.");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    user,
    userProfile,
    // aqui entregamos o *carregamento inicial* (auth + perfil)
    loading: initialLoading,
    // pra formulários de login / reset, use actionLoading
    actionLoading,
    error,
    login,
    loginWithGoogle,
    logout,
    resetPassword
  };
}
