import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Comunidade.module.css';

const ProfileCard = ({ user }) => {
  return (
    <div className={styles.sidebarCard}>
      <h2>Meu Perfil</h2>
      <div className={styles.profilePreview}>
        <div className={styles.profileAvatar}>👤</div>
        <h3>{user ? user.email || "Usuário" : "Visitante"}</h3>
        <p>{user ? "Complete seu perfil para conectar-se melhor" : "Faça login para participar da comunidade"}</p>
        {user ? (
          <Link to="/profile">
            <button className={styles.editProfileButton}>Editar Perfil</button>
          </Link>
        ) : (
          <Link to="/login">
            <button className={styles.editProfileButton}>Fazer Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;