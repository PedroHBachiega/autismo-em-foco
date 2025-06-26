import { useState, useEffect } from 'react'; 
import { db } from '../../../firebase/config';
import { useAuthValue } from '../../../context/AuthContext';
import { useDeleteDocument } from '../../../Hooks/useDeleteDocument';
import { useUpdateDocument } from '../../../Hooks/useUpdateDocument';
import { collection, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useGamification } from '../../../Hooks/useGamification';
import toast from 'react-hot-toast';

export const useComunidade = () => {
  const { user } = useAuthValue();
  const uid = user?.uid;
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  const { deleteDocument } = useDeleteDocument("posts");
  const { toggleLike, addComment, editComment, deleteComment, loading: updateLoading, error: updateError, success: updateSuccess } = useUpdateDocument("posts");
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
    try {
        await toggleLike(postId, uid);
        // Atualize o estado local dos posts
        setFetchedPosts(prevPosts => prevPosts.map(post => 
            post.id === postId 
            ? { ...post, likes: post.likes.includes(uid) 
                ? post.likes.filter(id => id !== uid) 
                : [...post.likes, uid] }
            : post
        ));
        await trackAction('LIKE');
    } catch (error) {
        console.error('Erro ao curtir o post:', error);
    }
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
    // Atualize os comentários localmente:
    setFetchedPosts((prev) => prev.map(post =>
      post.id === postId
        ? { ...post, comments: [...(post.comments || []), {
            userId: uid,
            userName: user.displayName || user.email,
            text: commentText,
            createdAt: new Date()
          }] }
        : post
    ));
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
  const handleEditCommentInternal = async (postId, comment, newText) => {
    await editComment(postId, uid, comment.createdAt, newText);
    // Atualize os comentários localmente:
    setFetchedPosts((prev) => prev.map(post =>
      post.id === postId
        ? { ...post, comments: post.comments.map(c =>
            c.createdAt === comment.createdAt ? { ...c, text: newText } : c
          ) }
        : post
    ));
  };

  const handleDeletePost = async (postId) => {
    try {
      await deleteDocument(postId);
      setFetchedPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Erro ao excluir o post: ", error)
    }
  };

  // Função para deletar comentário
  const handleDeleteComment = async (postId, comment) => {
    try {
      await deleteComment(postId, comment.userId, comment.createdAt);
      setFetchedPosts((prev) => prev.map(post =>
        post.id === postId
          ? { ...post, comments: post.comments.filter(c => {
              let cTime = c.createdAt;
              let oTime = comment.createdAt;
              if (cTime?.seconds) cTime = cTime.seconds;
              else if (cTime instanceof Date) cTime = cTime.getTime();
              if (oTime?.seconds) oTime = oTime.seconds;
              else if (oTime instanceof Date) oTime = oTime.getTime();
              return !(c.userId === comment.userId && cTime === oTime);
            }) }
          : post
      ));
      toast.success('Comentário excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir comentário.');
    }
  };

  // Adicione feedback visual ao editar comentário
  const handleEditComment = async (postId, comment, newText) => {
    try {
      await editComment(postId, uid, comment.createdAt, newText);
      setFetchedPosts((prev) => prev.map(post =>
        post.id === postId
          ? { ...post, comments: post.comments.map(c =>
              c.createdAt === comment.createdAt ? { ...c, text: newText } : c
            ) }
          : post
      ));
      toast.success('Comentário editado com sucesso!');
    } catch (error) {
      toast.error('Erro ao editar comentário.');
    }
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
    handleDeleteComment, 
    handleDeletePost,
    groups
  };
};
