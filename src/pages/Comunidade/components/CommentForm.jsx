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
        id="comment-textarea"
        aria-label="Escreva seu comentário"
        aria-required="true"
      />
      <button 
        onClick={() => handleAddComment(postId)}
        disabled={updateLoading}
        className={styles.commentButton}
        aria-label="Enviar comentário"
        aria-busy={updateLoading ? "true" : "false"}
      >
        {updateLoading ? "Enviando..." : "Enviar"}
      </button>
    </div>
  );
};

export default CommentForm;