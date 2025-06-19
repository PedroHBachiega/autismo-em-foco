import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Comunidade.module.css';

const CreatePostCard = () => {
  return (
    <div className={styles.createPost}>
      <h2>Compartilhe algo com a comunidade...</h2>
      <Link to="/posts/create">
        <button className={styles.postButton}>Criar Post</button>
      </Link>
    </div>
  );
};

export default CreatePostCard;