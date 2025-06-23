import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import styles from '../Comunidade/Comunidade.module.css';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsRef = collection(db, 'posts');
        const snapshot = await getDocs(postsRef);
        const postsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsList);
      } catch (err) {
        setError('Erro ao carregar posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) return;
    setDeletingId(postId);
    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      alert('Erro ao excluir post.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Painel de Curadoria de Posts</h1>
      {loading && <p className={styles.loadingMessage}>Carregando posts...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && posts.length === 0 && (
        <p className={styles.emptyMessage}>Nenhum post encontrado.</p>
      )}
      <div className={styles.postsList}>
        {posts.map(post => (
          <div key={post.id} className={styles.postCard}>
            <div className={styles.postHeader}>
              <div className={styles.postAuthor}>
                <div className={styles.authorAvatar}>👤</div>
                <div>
                  <h3>{post.createdBy || 'Usuário'}</h3>
                  <span className={styles.postDate}>
                    {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('pt-BR') : 'Data desconhecida'}
                  </span>
                </div>
              </div>
              <button
                className={styles.moreButton}
                onClick={() => handleDelete(post.id)}
                disabled={deletingId === post.id}
                title="Excluir post"
                style={{ color: '#d32f2f' }}
              >
                🗑️
              </button>
            </div>
            <div className={styles.postContent}>
              <h4>{post.title}</h4>
              <p>{post.body}</p>
            </div>
            {post.imageUrl && (
              <div className={styles.postImageWrapper}>
                <img src={post.imageUrl} alt="Imagem do post" className={styles.postImage} />
              </div>
            )}
            <div className={styles.postTags}>
              {post.tags && post.tags.map(tag => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPosts;