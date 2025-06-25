import React from 'react';
import styles from '../Comunidade.module.css';
import LoadingButton from '../../../components/LoadingButton';

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
      <LoadingButton 
        onClick={() => handleAddComment(postId)}
        loading={updateLoading}
        className={styles.commentButton}
        ariaLabel="Enviar comentário"
        loadingText="Enviando..."
      >
        Enviar
      </LoadingButton>
    </div>
  );
};

export default CommentForm;