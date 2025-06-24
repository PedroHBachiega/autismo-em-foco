import React, { useEffect, useState, useMemo } from 'react'; 
import styles from './Comunidade.module.css'; 
import { useComunidade } from './hooks/useComunidade'; 

// Componentes 
import LoadingSpinner from './components/LoadingSpinner'; 
import CreatePostCard from './components/CreatePostCard'; 
import FeedFilter from './components/FeedFilter'; 
import PostCard from './components/PostCard'; 
import ProfileCard from './components/ProfileCard'; 
import GroupList from './components/GroupList'; 
import Ranking from '../../components/Ranking/Ranking'; 

// ⬅️ ADICIONE AQUI: imports do chat 
import { useAuthValue } from '../../context/AuthContext'; 
import { collection, getDocs } from 'firebase/firestore'; 
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
  
  // Função para lidar com a busca
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  // Filtragem de posts com base no termo de busca usando useMemo para otimização
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) {
      return fetchedPosts; // Retorna todos os posts se não houver termo de busca
    }
    
    const termLower = searchTerm.toLowerCase();
    return fetchedPosts.filter(post => {
      // Filtrar por título
      const titleMatch = post.title?.toLowerCase().includes(termLower);
      // Filtrar por autor
      const authorMatch = post.createdBy?.toLowerCase().includes(termLower);
      
      return titleMatch || authorMatch;
    });
  }, [fetchedPosts, searchTerm]); 

  return ( 
    <div className={styles.container}> 
      <header className={styles.header}> 
        <h1>Comunidade</h1> 
        <p>Compartilhe experiências e conecte-se com outras pessoas</p> 
      </header> 

      <div className={styles.contentGrid}> 
        <main className={styles.mainContent}> 
          <CreatePostCard /> 
          <FeedFilter onSearch={handleSearch} /> 

          <div className={styles.postsList}> 
            {isLoading && <LoadingSpinner />} 
            {fetchError && <p className={styles.errorMessage}>{fetchError}</p>} 

            {!isLoading && !fetchError && fetchedPosts.length === 0 && ( 
              <p className={styles.emptyMessage}>Nenhum post encontrado. Seja o primeiro a compartilhar!</p> 
            )} 

            {!isLoading && !fetchError && fetchedPosts.length > 0 && filteredPosts.length === 0 && ( 
              <p className={styles.emptyMessage}>Nenhum post encontrado para a busca realizada.</p> 
            )} 

            {filteredPosts.length > 0 && 
              filteredPosts.map(post => ( 
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
              )) 
            } 
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
};

export default Comunidade;