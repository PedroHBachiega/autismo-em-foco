import React from 'react';
import styles from './Comunidade.module.css';
import { useComunidade } from './hooks/useComunidade';

// Componentes
import LoadingSpinner from './components/LoadingSpinner';
import CreatePostCard from './components/CreatePostCard';
import FeedFilter from './components/FeedFilter';
import PostCard from './components/PostCard';
import ProfileCard from './components/ProfileCard';
import GroupList from './components/GroupList';

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
    deleteDocument,
    updateLoading,
    handleLike,
    toggleCommentForm,
    handleAddComment,
    groups
  } = useComunidade();

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

          <div className={styles.postsList}>
            {isLoading && <LoadingSpinner />}
            {fetchError && <p className={styles.errorMessage}>{fetchError}</p>}
            
            {!isLoading && !fetchError && fetchedPosts.length === 0 && (
              <p className={styles.emptyMessage}>Nenhum post encontrado. Seja o primeiro a compartilhar!</p>
            )}
            
            {fetchedPosts.length > 0 && 
              fetchedPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  user={user}
                  uid={uid}
                  deleteDocument={deleteDocument}
                  handleLike={handleLike}
                  updateLoading={updateLoading}
                  toggleCommentForm={toggleCommentForm}
                  activeCommentPost={activeCommentPost}
                  commentText={commentText}
                  setCommentText={setCommentText}
                  handleAddComment={handleAddComment}
                />
              ))
            }
          </div>
        </main>

        <aside className={styles.sidebar}>
          <ProfileCard user={user} />
          <GroupList groups={groups} />
        </aside>
      </div>
    </div>
  );
};

export default Comunidade;