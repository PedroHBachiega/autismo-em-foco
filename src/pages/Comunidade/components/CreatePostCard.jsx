import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../Comunidade.module.css';
import { MdCheckCircle } from 'react-icons/md';

const CreatePostCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (location.state?.postCriado) {
      setShowSuccess(true);
      navigate(location.pathname, { replace: true });
      const timeout = setTimeout(() => {
        setShowSuccess(false);
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [location, navigate])
  return (
    <>
      {showSuccess && (

        <div className={styles.successMessage}>
          <MdCheckCircle size={22} />
          Post criado com sucesso!
        </div>
      )}
      <div className={styles.createPost}>
      <h2>Compartilhe algo com a comunidade...</h2>
      <Link to="/posts/create">
        <button className={styles.postButton}>Criar Post</button>
      </Link>
    </div>
    </>


  );
};

export default CreatePostCard;