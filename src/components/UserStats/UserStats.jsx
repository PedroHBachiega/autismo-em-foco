import React from 'react';
import { useGamification } from '../../Hooks/useGamification';
import Badge from '../Badge/Badge';
import styles from './UserStats.module.css';

const UserStats = ({ compact = false }) => {
  const { userStats, loading, BADGES_CONFIG } = useGamification();

  if (loading) {
    return <div className={styles.loading}>Carregando estatísticas...</div>;
  }

  if (!userStats) {
    return null;
  }

  const userBadges = userStats.badges?.map(badgeKey => ({
    key: badgeKey,
    ...BADGES_CONFIG[badgeKey]
  })) || [];

  if (compact) {
    return (
      <div className={styles.compactStats}>
        <div className={styles.points}>
          <span className={styles.pointsIcon}>⭐</span>
          <span>{userStats.totalPoints} pontos</span>
        </div>
        <div className={styles.badgeCount}>
          <span className={styles.badgeIcon}>🏆</span>
          <span>{userBadges.length} badges</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.userStats}>
      <div className={styles.header}>
        <h3 style={{ color: 'var(--text)'}}>Suas Conquistas</h3>
        <div className={styles.totalPoints}>
          <span className={styles.pointsIcon}>⭐</span>
          <span className={styles.pointsValue}>{userStats.totalPoints}</span>
          <span className={styles.pointsLabel}>pontos</span>
        </div>
      </div>

      <div className={styles.badges}>
        <h4 style={{ color: 'var(--text)'}}>Badges Conquistados</h4>
        <div className={styles.badgeGrid}>
          {userBadges.map(badge => (
            <Badge key={badge.key} badge={badge} size="medium" />
          ))}
        </div>
        {userBadges.length === 0 && (
          <p className={styles.noBadges}>Nenhum badge conquistado ainda. Continue participando!</p>
        )}
      </div>

      <div className={styles.actions}>
        <h4 style={{ color: 'var(--text)'}}>Atividades</h4>
        <div className={styles.actionGrid}>
          <div className={styles.actionItem}>
            <span className={styles.actionIcon}>📝</span>
            <span style={{ color: 'var(--text)'}} className={styles.actionValue}>{userStats.actions?.postsCreated || 0}</span>
            <span className={styles.actionLabel} style={{ color: 'var(--text)'}}>Posts</span>
          </div>
          <div className={styles.actionItem}>
            <span className={styles.actionIcon}>💬</span>
            <span  style={{ color: 'var(--text)'}}className={styles.actionValue}>{userStats.actions?.commentsCreated || 0}</span>
            <span className={styles.actionLabel} style={{ color: 'var(--text)'}}>Comentários</span>
          </div>
          <div className={styles.actionItem}>
            <span className={styles.actionIcon}>❤️</span>
            <span  style={{ color: 'var(--text)'}}className={styles.actionValue}>{userStats.actions?.likesReceived || 0}</span>
            <span className={styles.actionLabel} style={{ color: 'var(--text)'}}>Likes Recebidos</span>
          </div>
          <div className={styles.actionItem}>
            <span className={styles.actionIcon}>👍</span>
            <span  style={{ color: 'var(--text)'}}className={styles.actionValue}>{userStats.actions?.likesGiven || 0}</span>
            <span className={styles.actionLabel} style={{ color: 'var(--text)'}}>Likes Dados</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;