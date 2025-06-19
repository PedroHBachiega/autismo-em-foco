import React from 'react';
import styles from '../Comunidade.module.css';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

const PostCard = ({
  post,
  user,
  uid,
  deleteDocument,
  handleLike,
  updateLoading,
  toggleCommentForm,
  activeCommentPost,
  commentText,
  setCommentText,
  handleAddComment
}) => {
  return (
    <div className={styles.postCard}>
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
      <CommentList comments={post.comments} />
      
      {/* Formulário de comentário */}
      {activeCommentPost === post.id && (
        <CommentForm 
          commentText={commentText}
          setCommentText={setCommentText}
          handleAddComment={handleAddComment}
          postId={post.id}
          updateLoading={updateLoading}
        />
      )}
    </div>
  );
};

export default PostCard;