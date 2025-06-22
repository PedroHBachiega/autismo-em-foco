import React, { useState } from 'react';
import { useGamification } from '../../Hooks/useGamification';
import Badge from '../Badge/Badge';
import styles from './Ranking.module.css';

const Ranking = () => {
  const { ranking, loading, BADGES_CONFIG } = useGamification();
  const [showFullRanking, setShowFullRanking] = useState(false);

  if (loading) {
    return <div className={styles.loading}>Carregando ranking...</div>;
  }

  const displayRanking = showFullRanking ? ranking : ranking.slice(0, 5);

  return (
    <div className={styles.ranking}>
      <div className={styles.header}>
        <h3>🏆 Ranking da Comunidade</h3>
        <p>Os membros mais ativos da nossa comunidade</p>
      </div>

      <div className={styles.rankingList}>
        {displayRanking.map((user, index) => {
          const position = index + 1;
          const topBadge = user.badges?.length > 0 ? 
            BADGES_CONFIG[user.badges[user.badges.length - 1]] : null;
          
          return (
            <div key={user.id} className={`${styles.rankingItem} ${position <= 3 ? styles.topThree : ''}`}>
              <div className={styles.position}>
                {position === 1 && <span className={styles.crown}>👑</span>}
                {position === 2 && <span className={styles.medal}>🥈</span>}
                {position === 3 && <span className={styles.medal}>🥉</span>}
                {position > 3 && <span className={styles.number}>{position}</span>}
              </div>
              
              <div className={styles.userInfo}>
                <div className={styles.userName}>
                  {user.displayName || 'Usuário Anônimo'}
                </div>
                {topBadge && (
                  <Badge badge={topBadge} size="small" showTooltip={false} />
                )}
              </div>
              
              <div className={styles.stats}>
                <div className={styles.points}>
                  <span className={styles.pointsValue}>{user.totalPoints}</span>
                  <span className={styles.pointsLabel}>pontos</span>
                </div>
                <div className={styles.badges}>
                  <span className={styles.badgeCount}>{user.badges?.length || 0}</span>
                  <span className={styles.badgeLabel}>badges</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {ranking.length > 5 && (
        <button 
          className={styles.toggleButton}
          onClick={() => setShowFullRanking(!showFullRanking)}
        >
          {showFullRanking ? 'Ver menos' : `Ver todos (${ranking.length})`}
        </button>
      )}

      {ranking.length === 0 && (
        <div className={styles.emptyRanking}>
          <p>Ainda não há dados de ranking.</p>
          <p>Seja o primeiro a participar e ganhar pontos!</p>
        </div>
      )}
    </div>
  );
};

export default Ranking;