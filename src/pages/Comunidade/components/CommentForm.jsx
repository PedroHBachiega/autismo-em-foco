import React from 'react';
import Button from '../../../components/Button';
import styles from '../Comunidade.module.css';
import { MdSend } from 'react-icons/md';

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
      <Button 
        onClick={() => handleAddComment(postId)}
        loading={updateLoading}
        variant="primary"
        size="small"
        icon={<MdSend />}
        ariaLabel="Enviar comentário"
        loadingText="Enviando..."
      >
        Enviar
      </Button>
    </div>
  );
};

export default CommentForm;