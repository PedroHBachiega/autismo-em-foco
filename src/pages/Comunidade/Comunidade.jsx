import React, { useState, useEffect } from 'react'
import styles from './Comunidade.module.css'
import { Link } from 'react-router-dom'
import { db } from '../../firebase/config'
import { useAuthValue } from '../../context/AuthContext'
import { useDeleteDocument } from '../../hooks/useDeleteDocument'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

const Comunidade = () => {
  const { user } = useAuthValue();
  const uid = user?.uid;
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const { deleteDocument } = useDeleteDocument("posts");

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
  }, []);

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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Comunidade</h1>
        <p>Compartilhe experiências e conecte-se com outras pessoas</p>
      </header>

      <div className={styles.contentGrid}>
        <main className={styles.mainContent}>
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
                    <button className={styles.actionButton}>
                      ❤️ 0
                    </button>
                    <button className={styles.actionButton}>
                      💬 0
                    </button>
                    <button className={styles.actionButton}>
                      🔗 Compartilhar
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </main>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <h2>Meu Perfil</h2>
            <div className={styles.profilePreview}>
              <div className={styles.profileAvatar}>👤</div>
              <h3>{user ? user.email || "Usuário" : "Visitante"}</h3>
              <p>{user ? "Complete seu perfil para conectar-se melhor" : "Faça login para participar da comunidade"}</p>
              {user ? (
                <button className={styles.editProfileButton}>Editar Perfil</button>
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