import React, { useState } from 'react';
import styles from '../Comunidade.module.css';

const CommentList = ({ comments, uid, onEditComment, updateLoading }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");

  if (!comments || comments.length === 0) return null;

  const handleEditClick = (index, text) => {
    setEditingIndex(index);
    setEditText(text);
  };

  const handleSave = (comment) => {
    onEditComment(comment, editText);
    setEditingIndex(null);
    setEditText("");
  };

  return (
    <div className={styles.commentsSection}>
      <h5>Comentários:</h5>
      {comments.map((comment, index) => (
        <div key={index} className={styles.comment}>
          <div className={styles.commentHeader}>
            <strong>{comment.userName}</strong>
            <span>{comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString('pt-BR') : ''}</span>
          </div>
          {editingIndex === index ? (
            <>
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                rows="2"
                className={styles.commentEditInput}
              />
              <div className={styles.commentEditActions}>
                <button onClick={() => handleSave(comment)} disabled={updateLoading} className={styles.commentButton}>Salvar</button>
                <button onClick={() => setEditingIndex(null)} className={styles.commentButton}>Cancelar</button>
              </div>
            </>
          ) : (
            <>
              <p>{comment.text}</p>
              {uid === comment.userId && (
                <div className={styles.commentEditActions}>
                  <button onClick={() => handleEditClick(index, comment.text)} className={styles.editButton}>Editar</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;