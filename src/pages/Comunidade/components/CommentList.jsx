import React from 'react';
import styles from '../Comunidade.module.css';

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) return null;
  
  return (
    <div className={styles.commentsSection}>
      <h5>Comentários:</h5>
      {comments.map((comment, index) => (
        <div key={index} className={styles.comment}>
          <div className={styles.commentHeader}>
            <strong>{comment.userName}</strong>
            <span>{comment.createdAt?.toDate().toLocaleDateString('pt-BR')}</span>
          </div>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;