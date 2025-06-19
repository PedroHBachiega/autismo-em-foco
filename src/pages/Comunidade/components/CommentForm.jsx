import React from 'react';
import styles from '../Comunidade.module.css';

const CommentForm = ({ commentText, setCommentText, handleAddComment, postId, updateLoading }) => {
  return (
    <div className={styles.commentForm}>
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Escreva seu comentário..."
        rows="3"
      />
      <button 
        onClick={() => handleAddComment(postId)}
        disabled={updateLoading}
        className={styles.commentButton}
      >
        Enviar
      </button>
    </div>
  );
};

export default CommentForm;