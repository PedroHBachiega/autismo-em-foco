import React from 'react';
import styles from '../Comunidade.module.css';

const GroupList = ({ groups }) => {
  return (
    <div className={styles.sidebarCard}>
      <h2>Grupos Populares</h2>
      <div className={styles.groupsList}>
        {groups.map(group => (
          <div key={group.id} className={styles.groupItem}>
            <div className={styles.groupInfo}>
              <h3>{group.name}</h3>
              <p>{group.members} membros • {group.posts} posts</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupList;