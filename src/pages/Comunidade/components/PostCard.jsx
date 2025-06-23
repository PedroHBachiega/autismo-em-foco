import React, { useState } from 'react';
import styles from '../Comunidade.module.css';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { useAuthValue } from '../../../context/AuthContext';
import Modal from '../../../components/Modal';

const PostCard = ({
  post,
  deleteDocument,
  handleLike,
  updateLoading,
  toggleCommentForm,
  activeCommentPost,
  commentText,
  setCommentText,
  handleAddComment,
  handleEditComment,
  handleDeleteComment
}) => {
  const { user } = useAuthValue();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
            onClick={() => setShowDeleteModal(true)}
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

      {post.imageUrl && (
        <div className={styles.postImageWrapper}>
          <img 
            src={post.imageUrl} 
            alt="Imagem do post" 
            className={styles.postImage}            
            />
         </div>
      )}

      <div className={styles.postTags}>
        {post.tags && post.tags.map(tag => (
          <span key={tag} className={styles.tag}>#{tag}</span>
        ))}
      </div>
      <div className={styles.postActions}>
        <button 
          className={`${styles.actionButton} ${post.likes?.includes(user?.uid) ? styles.liked : ""}`}
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
      <CommentList
        comments={post.comments}
        onEditComment={(comment, newText) => handleEditComment(post.id, comment, newText)}
        onDeleteComment={comment => handleDeleteComment(post.id, comment)}
        updateLoading={updateLoading}
      />
      
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
      
      {/* Modal de confirmação de exclusão */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Exclusão"
        confirmText="Excluir Post"
        cancelText="Cancelar"
        onConfirm={() => {
          deleteDocument(post.id);
          setShowDeleteModal(false);
        }}
      >
        <p>Tem certeza que deseja excluir este post?</p>
        <p>Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  );
};

export default PostCard;