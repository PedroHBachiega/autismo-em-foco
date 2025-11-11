import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import api from "../services/apiClient";

export const useUpdateDocument = (docCollection) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      action();
    }
  };

  const updateDocument = async (id, data) => {
    checkCancelBeforeDispatch(() => {
      setLoading(true);
      setError(null);
      setSuccess(false);
    });

    try {
      if (docCollection === 'agendamentos') {
        await api.put(`/agendamentos/${id}`, data)
      } else {
        const docRef = doc(db, docCollection, id);
        await updateDoc(docRef, data);
      }

      checkCancelBeforeDispatch(() => {
        setSuccess(true);
        setLoading(false);
      });
    } catch (error) {
      checkCancelBeforeDispatch(() => {
        console.error("Erro ao atualizar documento:", error);
        setError(error.message);
        setLoading(false);
      });
    }
  };

  // Função específica para lidar com likes
  const toggleLike = async (postId, userId) => {
    if (!userId) {
      setError("Usuário não está autenticado");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post(`/posts/${postId}/like/toggle`, {})
      
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao atualizar likes:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Função para adicionar comentários
  const addComment = async (postId, userId, userName, commentText) => {
    if (!userId) {
      setError("Usuário não está autenticado");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post(`/posts/${postId}/comments`, {
        text: commentText,
        userName,
      })
      
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Função para editar comentários
  const editComment = async (postId, userId, originalCreatedAt, newText) => {
    if (!userId) {
      setError("Usuário não está autenticado");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const originalSeconds = originalCreatedAt?.seconds
        ? originalCreatedAt.seconds
        : (originalCreatedAt instanceof Date ? Math.floor(originalCreatedAt.getTime() / 1000) : null)
      await api.put(`/posts/${postId}/comments`, {
        OriginalCreatedAtSeconds: originalSeconds,
        NewText: newText,
      })
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Função para deletar comentários
  const deleteComment = async (postId, userId, createdAt) => {
    if (!userId) {
      setError("Usuário não está autenticado");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const originalSeconds = createdAt?.seconds
        ? createdAt.seconds
        : (createdAt instanceof Date ? Math.floor(createdAt.getTime() / 1000) : null)
      await api.del(`/posts/${postId}/comments`, {
        body: JSON.stringify({ CreatedAtSeconds: originalSeconds }),
        headers: { 'Content-Type': 'application/json' },
      })
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { updateDocument, toggleLike, addComment, editComment, deleteComment, loading, error, success };
};