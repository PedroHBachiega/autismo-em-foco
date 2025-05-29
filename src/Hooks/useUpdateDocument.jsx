import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";

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
      const docRef = doc(db, docCollection, id);
      await updateDoc(docRef, data);

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
      const postRef = doc(db, docCollection, postId);
      const postDoc = await getDoc(postRef);
      
      if (!postDoc.exists()) {
        throw new Error("Post não encontrado");
      }
      
      const postData = postDoc.data();
      const likes = postData.likes || [];
      
      // Verifica se o usuário já deu like
      if (likes.includes(userId)) {
        // Remove o like
        await updateDoc(postRef, {
          likes: arrayRemove(userId)
        });
      } else {
        // Adiciona o like
        await updateDoc(postRef, {
          likes: arrayUnion(userId)
        });
      }
      
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
      const postRef = doc(db, docCollection, postId);
      
      const comment = {
        userId,
        userName,
        text: commentText,
        createdAt: new Date()
      };
      
      await updateDoc(postRef, {
        comments: arrayUnion(comment)
      });
      
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { updateDocument, toggleLike, addComment, loading, error, success };
};