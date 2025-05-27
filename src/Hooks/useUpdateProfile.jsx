import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      action();
    }
  };

  const updateUserProfile = async (userData) => {
    checkCancelBeforeDispatch(() => {
      setLoading(true);
      setError(null);
      setSuccess(false);
    });

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error('Usuário não está autenticado');
      }

      // Atualiza o displayName no Auth se fornecido
      if (userData.displayName) {
        await updateProfile(user, {
          displayName: userData.displayName
        });
      }

      // Atualiza os dados no Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, userData);

      checkCancelBeforeDispatch(() => {
        setSuccess(true);
        setLoading(false);
      });
    } catch (error) {
      checkCancelBeforeDispatch(() => {
        console.error('Erro ao atualizar perfil:', error);
        setError(error.message);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { updateUserProfile, loading, error, success };
};