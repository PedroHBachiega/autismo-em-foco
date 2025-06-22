import { useState, useEffect } from 'react'; // Adicionar useEffect
import { db } from '../../../firebase/config';
import { useAuthValue } from '../../../context/AuthContext';
import { useDeleteDocument } from '../../../Hooks/useDeleteDocument';
import { useUpdateDocument } from '../../../Hooks/useUpdateDocument';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useGamification } from '../../../Hooks/useGamification';

export const useComunidade = () => {
  const { user } = useAuthValue();
  const uid = user?.uid;
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  const { deleteDocument } = useDeleteDocument("posts");
  const { toggleLike, addComment, editComment, loading: updateLoading } = useUpdateDocument("posts");
  const { trackAction } = useGamification();

  // Adicionar useEffect para buscar os posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);
        
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push({ id: doc.id, ...doc.data() });
        });
        
        setFetchedPosts(posts);
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
        setFetchError('Erro ao carregar os posts. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []); // Array de dependências vazio para executar apenas uma vez
  
  const handleLike = async (postId) => {
    if (!user) {
      alert("Você precisa estar logado para curtir posts");
      return;
    }
    await toggleLike(postId, uid);
    await trackAction('LIKE');
  };
  
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
    await trackAction('COMMENT');
    setCommentText("");
    setActiveCommentPost(null);
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

  // Função para editar comentário
  const handleEditComment = async (postId, comment, newText) => {
    await editComment(postId, uid, comment.createdAt, newText);
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
    handleEditComment,
    groups
  };
};
