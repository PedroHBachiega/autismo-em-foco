import React from 'react';
import styles from '../Comunidade.module.css';

const FeedFilter = () => {
  return (
    <div className={styles.feedFilter}>
      <button className={`${styles.filterButton} ${styles.active}`}>Recentes</button>
      <button className={styles.filterButton}>Populares</button>
      <button className={styles.filterButton}>Meus Grupos</button>
    </div>
  );
};

export default FeedFilter;