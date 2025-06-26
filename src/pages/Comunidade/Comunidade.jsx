<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import styles from './Comunidade.module.css';
import { useComunidade } from './hooks/useComunidade';


import LoadingSpinner from './components/LoadingSpinner';
import CreatePostCard from './components/CreatePostCard';
import FeedFilter from './components/FeedFilter';
import PostCard from './components/PostCard';
import ProfileCard from './components/ProfileCard';
import GroupList from './components/GroupList';
import Ranking from '../../components/Ranking/Ranking';


import { useAuthValue } from '../../context/AuthContext';
import { collection, getDocs, query, orderBy, startAt, endAt } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Chat from '../../components/Chat';


const Comunidade = () => {
  const {
    user,
    uid,
    fetchedPosts,
    isLoading,
    fetchError,
    commentText,
    setCommentText,
    activeCommentPost,
    handleDeletePost,
    updateLoading,
    handleLike,
    toggleCommentForm,
    handleAddComment,
    handleEditComment,
    handleDeleteComment, // <-- Adicione aqui
    groups
  } = useComunidade();

  // Estado para o termo de busca
  const [searchTerm, setSearchTerm] = useState('');

  // ⬅️ ADICIONE AQUI: estados do chat 
  const { user: authUser } = useAuthValue();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  // ⬅️ ADICIONE AQUI: useEffect para buscar usuários 
  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const list = snapshot.docs
        .map((doc) => ({ uid: doc.id, ...doc.data() }))
        .filter((u) => u.uid !== authUser?.uid);
      setUsers(list);
    };

    if (authUser?.uid) {
      fetchUsers();
    }
  }, [authUser]);
  {/*começa aqui*/ }
  useEffect(() => {
    const fetchSearchedPosts = async () => {
      try {
        const postsRef = collection(db, 'posts');
        const snapShot = await getDocs(postsRef);

        const results = snapShot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((post) => {
            const lowerSearch = searchTerm.toLowerCase();
            return (
              post.createdBy?.toLowerCase().includes(lowerSearch) ||
              post.body?.toLowerCase().includes(lowerSearch) ||
              post.title?.toLowerCase().includes(lowerSearch)
            );
          });

        setSearchResults(results);
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      }
    };

    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    fetchSearchedPosts();
  }, [searchTerm]);

=======
import React, { useState, useEffect } from 'react'
import styles from './Comunidade.module.css'
import { Link } from 'react-router-dom'
import { db } from '../../firebase/config'
import { useAuthValue } from '../../context/AuthContext'
import { useDeleteDocument } from '../../Hooks/useDeleteDocument'
import { useUpdateDocument } from '../../Hooks/useUpdateDocument'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

const Comunidade = () => {
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
>>>>>>> origin/main

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Comunidade</h1>
<<<<<<< HEAD
        <p 
          style={{ color: 'var(--text)'}}>Compartilhe experiências e conecte-se com outras pessoas</p>
=======
        <p>Compartilhe experiências e conecte-se com outras pessoas</p>
>>>>>>> origin/main
      </header>

      <div className={styles.contentGrid}>
        <main className={styles.mainContent}>
<<<<<<< HEAD
          <CreatePostCard />
          <FeedFilter />

          <input
            type="text"
            placeholder="Buscar posts por palavras-chave, título, autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              backgroundColor: '#fff',
              color: '#333'
            }}
          />

          <div className={styles.postsList}>
            {isLoading && <LoadingSpinner />}
            {fetchError && <p className={styles.errorMessage}>{fetchError}</p>}

            {!isLoading && !fetchError && fetchedPosts.length === 0 && (
              <p className={styles.emptyMessage}>Nenhum post encontrado. Seja o primeiro a compartilhar!</p>
            )}

            {searchTerm && searchResults.length === 0 && (
              <p className={styles.emptyMessage}>Nenhum resultado para <strong>"{searchTerm}"</strong> </p>
            )}

            {(searchTerm ? searchResults : fetchedPosts).map(post => (

              <PostCard
                key={post.id}
                post={post}
                user={user}
                uid={uid}
                deleteDocument={handleDeletePost}
                handleLike={handleLike}
                updateLoading={updateLoading}
                toggleCommentForm={toggleCommentForm}
                activeCommentPost={activeCommentPost}
                commentText={commentText}
                setCommentText={setCommentText}
                handleAddComment={handleAddComment}
                handleEditComment={handleEditComment}
                handleDeleteComment={handleDeleteComment}
              />
            ))}
=======
          <div className={styles.createPost}>
            <h2>Compartilhe algo com a comunidade...</h2>
            <Link to="/posts/create">
              <button className={styles.postButton}>Criar Post</button>
            </Link>
          </div>

          <div className={styles.feedFilter}>
            <button className={`${styles.filterButton} ${styles.active}`}>Recentes</button>
            <button className={styles.filterButton}>Populares</button>
            <button className={styles.filterButton}>Meus Grupos</button>
          </div>

          <div className={styles.postsList}>
            {isLoading && <p className={styles.loadingMessage}>Carregando posts...</p>}
            {fetchError && <p className={styles.errorMessage}>{fetchError}</p>}
            
            {!isLoading && !fetchError && fetchedPosts.length === 0 && (
              <p className={styles.emptyMessage}>Nenhum post encontrado. Seja o primeiro a compartilhar!</p>
            )}
            
            {fetchedPosts.length > 0 && 
              fetchedPosts.map(post => (
                <div key={post.id} className={styles.postCard}>
                  <div className={styles.postHeader}>
                    <div className={styles.postAuthor}>
                      <div className={styles.authorAvatar}>👤</div>
                      <div>
                        <h3>{post.createdBy || "Usuário"}</h3>
                        <span className={styles.postDate}>
                          {post.createdAt?.toDate().toLocaleDateString('pt-BR') || "Data desconhecida"}
                        </span>
                      </div>
                    </div>
                    {user && post.uid === user.uid && (
                      <button 
                        className={styles.moreButton}
                        onClick={() => {
                          if(window.confirm("Tem certeza que deseja excluir este post?")) {
                            deleteDocument(post.id);
                          }
                        }}
                        title="Excluir post"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  <div className={styles.postContent}>
                    <h4>{post.title}</h4>
                    <p>{post.body}</p>
                  </div>
                  <div className={styles.postTags}>
                    {post.tags && post.tags.map(tag => (
                      <span key={tag} className={styles.tag}>#{tag}</span>
                    ))}
                  </div>
                  <div className={styles.postActions}>
                    <button 
                      className={`${styles.actionButton} ${post.likes?.includes(uid) ? styles.liked : ""}`}
                      onClick={() => handleLike(post.id)}
                      disabled={updateLoading}
                    >
                      ❤️ {post.likes?.length || 0}
                    </button>
                    <button 
                      className={styles.actionButton}
                      onClick={() => toggleCommentForm(post.id)}
                    >
                      💬 {post.comments?.length || 0}
                    </button>
                  </div>
                  
                  {/* Exibir comentários existentes */}
                  {post.comments && post.comments.length > 0 && (
                    <div className={styles.commentsSection}>
                      <h5>Comentários:</h5>
                      {post.comments.map((comment, index) => (
                        <div key={index} className={styles.comment}>
                          <div className={styles.commentHeader}>
                            <strong>{comment.userName}</strong>
                            <span>{comment.createdAt?.toDate().toLocaleDateString('pt-BR')}</span>
                          </div>
                          <p>{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Formulário de comentário */}
                  {activeCommentPost === post.id && (
                    <div className={styles.commentForm}>
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Escreva seu comentário..."
                        rows="3"
                      />
                      <button 
                        onClick={() => handleAddComment(post.id)}
                        disabled={updateLoading}
                        className={styles.commentButton}
                      >
                        Enviar
                      </button>
                    </div>
                  )}
                </div>
              ))
            }
>>>>>>> origin/main
          </div>
        </main>

        <aside className={styles.sidebar}>
<<<<<<< HEAD
          <ProfileCard user={user} />
          <Ranking showTitle={true} maxUsers={10} />
          <GroupList groups={groups} />

          {/* ⬇️ Chat */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#fff' }}>Conversar com:</h3>
            <ul>
              {users.map((u) => (
                <li
                  key={u.uid}
                  style={{
                    cursor: 'pointer',
                    color: '#00aaff',
                    marginBottom: '0.5rem'
                  }}
                  onClick={() => setSelectedUser(u)}
                >
                  {u.displayName || u.email}
                </li>
              ))}
            </ul>
          </div>

          {selectedUser && (
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  marginBottom: '0.5rem',
                  background: 'none',
                  color: '#00aaff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Fechar Chat
              </button>
              <Chat otherUser={selectedUser} />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Comunidade;
=======
          <div className={styles.sidebarCard}>
            <h2>Meu Perfil</h2>
            <div className={styles.profilePreview}>
              <div className={styles.profileAvatar}>👤</div>
              <h3>{user ? user.email || "Usuário" : "Visitante"}</h3>
              <p>{user ? "Complete seu perfil para conectar-se melhor" : "Faça login para participar da comunidade"}</p>
              {user ? (
                <Link to="/profile">
                  <button className={styles.editProfileButton}>Editar Perfil</button>
                </Link>
              ) : (
                <Link to="/login">
                  <button className={styles.editProfileButton}>Fazer Login</button>
                </Link>
              )}
            </div>
          </div>

          <div className={styles.sidebarCard}>
            <h2>Grupos Populares</h2>
            <div className={styles.groupsList}>
              {groups.map(group => (
                <div key={group.id} className={styles.groupItem}>
                  <div className={styles.groupInfo}>
                    <h3>{group.name}</h3>
                    <p>{group.members} membros • {group.posts} posts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Comunidade
>>>>>>> origin/main
