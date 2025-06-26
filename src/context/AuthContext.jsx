<<<<<<< HEAD
import { createContext, useContext, useReducer, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext(null);

const initialState = {
  user: null,
  userProfile: null,
  loading: true,
  actionLoading: false,
  error: null
};

function authReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_USER_PROFILE":
      return { ...state, userProfile: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ACTION_LOADING":
      return { ...state, actionLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [state, dispatch] = useReducer(authReducer, initialState);
  const googleProvider = new GoogleAuthProvider();

  // Função para buscar perfil
  const fetchUserProfile = async (uid) => {
    try {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        dispatch({ type: "SET_USER_PROFILE", payload: { id: snap.id, ...data } });
        return data;
      }
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
    }
    dispatch({ type: "SET_USER_PROFILE", payload: null });
    return null;
  };

  // Monitora o estado de auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      dispatch({ type: "SET_USER", payload: u });
      if (u) {
        await fetchUserProfile(u.uid);
      } else {
        dispatch({ type: "SET_USER_PROFILE", payload: null });
      }
      dispatch({ type: "SET_LOADING", payload: false });
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

  // Métodos de ação
  const login = async (email, password) => {
    dispatch({ type: "SET_ACTION_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
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
          createdAt: new Date()
        });
        await fetchUserProfile(cred.user.uid);
      }
      navigate("/", { replace: true });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Email ou senha inválidos." });
    } finally {
      dispatch({ type: "SET_ACTION_LOADING", payload: false });
    }
  };

  const loginWithGoogle = async () => {
    dispatch({ type: "SET_ACTION_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
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
          createdAt: new Date()
        });
      }
      await fetchUserProfile(googleUser.uid);
      navigate("/", { replace: true });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Falha no login com Google." });
    } finally {
      dispatch({ type: "SET_ACTION_LOADING", payload: false });
    }
  };

  const logout = async () => {
    await auth.signOut();
    dispatch({ type: "SET_USER", payload: null });
    dispatch({ type: "SET_USER_PROFILE", payload: null });
    navigate("/login", { replace: true });
  };

  const resetPassword = async (email) => {
    dispatch({ type: "SET_ACTION_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: {
        "auth/user-not-found": "Email não encontrado.",
        "auth/invalid-email": "Email inválido."
      }[err.code] || "Erro ao enviar email de redefinição."});
      return false;
    } finally {
      dispatch({ type: "SET_ACTION_LOADING", payload: false });
    }
  };

  if (state.loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg">Carregando sessão…</p>
=======
// src/context/AuthContext.jsx

import React, { createContext, useContext } from 'react';
import { useAuthentication } from '../Hooks/UseAuthentication';

// 1. Cria o contexto
const AuthContext = createContext();

// 2. AuthProvider integra TODO o retorno de useAuthentication
export function AuthProvider({ children }) {
  // 🔥 useAuthentication já cuida de onAuthStateChanged, login, logout, erros e loading
  const auth = useAuthentication();
  // auth = { user, loading, error, login, loginWithGoogle, logout }

  // Se quiser apresentação mais sofisticada de “aguarde”, 
  // você pode substituir o return abaixo por um Skeleton ou Spinner corporativo
  if (auth.loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-600">Carregando sessão…</p>
>>>>>>> origin/main
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <AuthContext.Provider value={{
      ...state,
      login,
      loginWithGoogle,
      logout,
      resetPassword
    }}>
=======
    <AuthContext.Provider value={auth}>
>>>>>>> origin/main
      {children}
    </AuthContext.Provider>
  );
}

<<<<<<< HEAD
export function useAuthValue() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthValue deve ser usado dentro de <AuthProvider>");
  }
  return context;
=======
// 3. Hook para consumir o contexto em qualquer componente
export function useAuthValue() {
  return useContext(AuthContext);
>>>>>>> origin/main
}
