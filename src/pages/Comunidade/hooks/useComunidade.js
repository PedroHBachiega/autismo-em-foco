import { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { useAuthValue } from '../../../context/AuthContext';
import { useDeleteDocument } from '../../../Hooks/useDeleteDocument';
import { useUpdateDocument } from '../../../Hooks/useUpdateDocument';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export const useComunidade = () => {
  const { user } = useAuthValue();
  const uid = user?.uid;
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  const { deleteDocument } = useDeleteDocument("posts");
  const { toggleLike, addComment, loading: updateLoading } = useUpdateDocument("posts");

  useEffect(() => {
    let isMounted = true;
    
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        if (isMounted) {
          console.log("Posts fetched:", posts.length);
          setFetchedPosts(posts);
          setFetchError(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        if (isMounted) {
          setFetchError("Erro ao carregar os posts");
          setIsLoading(false);
        }
      }
    };

    fetchPosts();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [updateLoading]); // Recarregar quando houver atualizações

  // Função para lidar com likes
  const handleLike = async (postId) => {
    if (!user) {
      alert("Você precisa estar logado para curtir posts");
      return;
    }
    await toggleLike(postId, uid);
  };

  // Função para mostrar/esconder o formulário de comentário
  const toggleCommentForm = (postId) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null);
    } else {
      setActiveCommentPost(postId);
      setCommentText("");
    }
  };

  // Função para enviar comentário
  const handleAddComment = async (postId) => {
    if (!user) {
      alert("Você precisa estar logado para comentar");
      return;
    }
    
    if (!commentText.trim()) {
      alert("O comentário não pode estar vazio");
      return;
    }
    
    await addComment(postId, uid, user.displayName || user.email, commentText);
    setCommentText("");
    setActiveCommentPost(null);
  };

  // Dados simulados para os grupos da comunidade
  const groups = [
    {
      id: 1,
      name: "Pais e Mães de Autistas",
      members: 1250,
      posts: 320
    },
    {
      id: 2,
      name: "TEA na Adolescência",
      members: 845,
      posts: 210
    },
    {
      id: 3,
      name: "Autismo e Educação Inclusiva",
      members: 930,
      posts: 275
    },
    {
      id: 4,
      name: "Profissionais do TEA",
      members: 680,
      posts: 190
    }
  ];

  return {
    user,
    uid,
    fetchedPosts,
    isLoading,
    fetchError,
    commentText,
    setCommentText,
    activeCommentPost,
    deleteDocument,
    updateLoading,
    handleLike,
    toggleCommentForm,
    handleAddComment,
    groups
  };
};