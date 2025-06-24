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
  const [searchTerm, setSearchTerm] = useState('');
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


  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Comunidade</h1>
        <p>Compartilhe experiências e conecte-se com outras pessoas</p>
      </header>

      <div className={styles.contentGrid}>
        <main className={styles.mainContent}>
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
          </div>
        </main>

        <aside className={styles.sidebar}>
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

export default Comunidade;