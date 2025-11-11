// src/hooks/useAuthentication.jsx
import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import api from "../services/apiClient";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

export function useAuthentication() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const googleProvider = new GoogleAuthProvider();

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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        try {
          const token = await u.getIdToken(/* forceRefresh */ true);
          localStorage.setItem('api_token', token);
        } catch (_) {
          // se não conseguir obter token, garante que não há lixo
          localStorage.removeItem('api_token');
        }
        await fetchUserProfile(u.uid);
      } else {
        setUser(null);
        setUserProfile(null);
        localStorage.removeItem('api_token');
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
      // Opcional: validar via API antes de logar no Firebase
      const useApi = import.meta.env.VITE_AUTH_VIA_API === 'true';
      if (useApi) {
        try {
          const res = await api.post('/auth/login', { email, password });
          localStorage.setItem('api_token', res?.token || '');
          localStorage.setItem('api_user', JSON.stringify(res));
        } catch (e) {
          setError(e.message || "Falha ao autenticar via API.");
          return false;
        }
      }

      const cred = await signInWithEmailAndPassword(auth, email, password);
      const profile = await fetchUserProfile(cred.user.uid);

      if (!profile) {
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || "",
          cidade: "",
          estado: "",
          telefone: "",
          bio: "",
          createdAt: new Date(),
        });
      }

      await fetchUserProfile(cred.user.uid);
      return true;
    } catch {
      setError("Email ou senha inválidos.");
      return false;
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
      const googleUser = result.user;

      const profile = await fetchUserProfile(googleUser.uid);

      if (!profile) {
        await setDoc(doc(db, "users", googleUser.uid), {
          uid: googleUser.uid,
          email: googleUser.email,
          displayName: googleUser.displayName || "",
          cidade: "",
          estado: "",
          telefone: "",
          bio: "",
          createdAt: new Date(),
        });
      }

      await fetchUserProfile(googleUser.uid);
      return true;
    } catch {
      setError("Falha no login com Google.");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // 3) Logout
  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('api_token');
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
      setError(
        {
          "auth/user-not-found": "Email não encontrado.",
          "auth/invalid-email": "Email inválido.",
        }[err.code] || "Erro ao enviar email de redefinição."
      );
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    user,
    userProfile,
    loading: initialLoading,
    actionLoading,
    error,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
  };
}
