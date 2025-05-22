import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.navLinks}>
        <Link to="/Sobre" className={styles.navLink}>Sobre Nós</Link>
        <Link to="/" className={styles.navLink}>Home</Link>
        <Link to="/Comunidade" className={styles.navLink}>Comunidade</Link>
        <Link to="/SobreAutismo" className={styles.navLink}>O que é o autismo?</Link>
        <Link to="/Contato" className={styles.navLink}>Contato</Link>
      </div>
      
      <div className={styles.message}>
        <p>A inclusão começa com a informação.</p>
        <p>Aprenda sobre o autismo, pratique o respeito e promova a diversidade.</p>
      </div>
      
      <div className={styles.socialLinks}>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
          <img src="/src/assets/facebook.png" alt="Facebook" />
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
          <img src="/src/assets/github.png" alt="GitHub" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
          <img src="/src/assets/instagram.png" alt="Instagram" />
        </a>
      </div>
      
      <div className={styles.copyright}>
        ©2025- Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;