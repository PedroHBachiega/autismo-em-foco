import React, { useState } from 'react';
import Button from '../../../components/Button';
import styles from '../Comunidade.module.css';
import { useAuthValue } from '../../../context/AuthContext';
import { MdSave, MdCancel, MdEdit, MdDelete } from 'react-icons/md';

const CommentList = ({ comments, onEditComment, onDeleteComment, updateLoading }) => {
  const { user } = useAuthValue();
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
                <Button 
                  onClick={() => handleSave(comment)} 
                  loading={updateLoading} 
                  variant="success"
                  size="small"
                  icon={<MdSave />}
                  loadingText="Salvando..."
                >
                  Salvar
                </Button>
                <Button 
                  onClick={() => setEditingIndex(null)} 
                  variant="secondary"
                  size="small"
                  icon={<MdCancel />}
                >
                  Cancelar
                </Button>
              </div>
            </>
          ) : (
            <>
              <p>{comment.text}</p>
              {user && user.uid === comment.userId && (
                <div className={styles.commentEditActions}>
                  <Button 
                    onClick={() => handleEditClick(index, comment.text)} 
                    variant="ghost"
                    size="small"
                    icon={<MdEdit />}
                  >
                    Editar
                  </Button>
                  <Button 
                    onClick={() => onDeleteComment(comment)} 
                    variant="danger"
                    size="small"
                    icon={<MdDelete />}
                  >
                    Excluir
                  </Button>
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