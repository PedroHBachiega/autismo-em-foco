import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, increment, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useAuthValue } from '../context/AuthContext';

// Configuração de pontos por ação
const POINTS_CONFIG = {
  CREATE_POST: 10,
  COMMENT: 5,
  LIKE: 2,
  SHARE: 3,
  PROFILE_COMPLETE: 20,
  FIRST_LOGIN: 5,
  DAILY_LOGIN: 1
};

// Configuração de badges
const BADGES_CONFIG = {
  NEWCOMER: { name: 'Bem-vindo', description: 'Primeiro login', icon: '👋', points: 0 },
  CONTRIBUTOR: { name: 'Contribuidor', description: '5 posts criados', icon: '✍️', points: 50 },
  SOCIAL: { name: 'Social', description: '20 comentários', icon: '💬', points: 100 },
  POPULAR: { name: 'Popular', description: '50 likes recebidos', icon: '❤️', points: 100 },
  VETERAN: { name: 'Veterano', description: '100 pontos', icon: '🏆', points: 100 },
  EXPERT: { name: 'Especialista', description: '500 pontos', icon: '🌟', points: 500 },
  LEGEND: { name: 'Lenda', description: '1000 pontos', icon: '👑', points: 1000 }
};

export const useGamification = () => {
  const { user } = useAuthValue();
  const [userStats, setUserStats] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inicializar stats do usuário
  const initializeUserStats = async (userId) => {
    try {
      const statsRef = doc(db, 'userStats', userId);
      const statsDoc = await getDoc(statsRef);
      
      if (!statsDoc.exists()) {
        const initialStats = {
          userId,
          totalPoints: 0,
          badges: ['NEWCOMER'],
          actions: {
            postsCreated: 0,
            commentsCreated: 0,
            likesGiven: 0,
            likesReceived: 0,
            sharesGiven: 0
          },
          lastLoginDate: new Date().toDateString(),
          createdAt: new Date()
        };
        
        await setDoc(statsRef, initialStats);
        await addPoints(userId, POINTS_CONFIG.FIRST_LOGIN);
        return initialStats;
      }
      
      return statsDoc.data();
    } catch (err) {
      console.error('Erro ao inicializar stats:', err);
      throw err;
    }
  };

  // Adicionar pontos
  const addPoints = async (userId, points, action = null) => {
    try {
      const statsRef = doc(db, 'userStats', userId);
      
      await updateDoc(statsRef, {
        totalPoints: increment(points),
        ...(action && { [`actions.${action}`]: increment(1) })
      });
      
      // Verificar novos badges
      await checkAndAwardBadges(userId);
      
      // Atualizar estado local
      if (userId === user?.uid) {
        await fetchUserStats();
      }
    } catch (err) {
      console.error('Erro ao adicionar pontos:', err);
      throw err;
    }
  };

  // Verificar e conceder badges
  const checkAndAwardBadges = async (userId) => {
    try {
      const statsRef = doc(db, 'userStats', userId);
      const statsDoc = await getDoc(statsRef);
      
      if (!statsDoc.exists()) return;
      
      const stats = statsDoc.data();
      const currentBadges = stats.badges || [];
      const newBadges = [];
      
      // Verificar cada badge
      Object.entries(BADGES_CONFIG).forEach(([badgeKey, badge]) => {
        if (!currentBadges.includes(badgeKey)) {
          let shouldAward = false;
          
          switch (badgeKey) {
            case 'CONTRIBUTOR':
              shouldAward = stats.actions.postsCreated >= 5;
              break;
            case 'SOCIAL':
              shouldAward = stats.actions.commentsCreated >= 20;
              break;
            case 'POPULAR':
              shouldAward = stats.actions.likesReceived >= 50;
              break;
            case 'VETERAN':
              shouldAward = stats.totalPoints >= 100;
              break;
            case 'EXPERT':
              shouldAward = stats.totalPoints >= 500;
              break;
            case 'LEGEND':
              shouldAward = stats.totalPoints >= 1000;
              break;
          }
          
          if (shouldAward) {
            newBadges.push(badgeKey);
          }
        }
      });
      
      if (newBadges.length > 0) {
        await updateDoc(statsRef, {
          badges: [...currentBadges, ...newBadges]
        });
      }
    } catch (err) {
      console.error('Erro ao verificar badges:', err);
    }
  };

  // Buscar stats do usuário
  const fetchUserStats = async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      const stats = await initializeUserStats(user.uid);
      setUserStats(stats);
    } catch (err) {
      setError('Erro ao carregar estatísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Buscar ranking com nomes dos usuários
  const fetchRanking = async () => {
    try {
      const statsRef = collection(db, 'userStats');
      const q = query(statsRef, orderBy('totalPoints', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      
      const rankingData = [];
      
      // Para cada usuário no ranking, buscar seus dados completos
      for (const docSnapshot of querySnapshot.docs) {
        const statsData = docSnapshot.data();
        const userId = docSnapshot.id;
        
        // Buscar dados do usuário na coleção users
        try {
          const userDocRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userDocRef);
          
          let displayName = 'Usuário Anônimo';
          if (userDoc.exists()) {
            const userData = userDoc.data();
            displayName = userData.displayName || userData.name || 'Usuário Anônimo';
          }
          
          rankingData.push({
            id: userId,
            ...statsData,
            displayName
          });
        } catch (userError) {
          console.error(`Erro ao buscar dados do usuário ${userId}:`, userError);
          // Adicionar mesmo sem o nome
          rankingData.push({
            id: userId,
            ...statsData,
            displayName: 'Usuário Anônimo'
          });
        }
      }
      
      setRanking(rankingData);
    } catch (err) {
      console.error('Erro ao buscar ranking:', err);
    }
  };

  // Ações específicas
  const trackAction = async (action, additionalData = {}) => {
    if (!user?.uid) return;
    
    try {
      const points = POINTS_CONFIG[action] || 0;
      await addPoints(user.uid, points, getActionKey(action));
      
      // Ações específicas adicionais
      if (action === 'LIKE' && additionalData.targetUserId) {
        // Adicionar like recebido para o autor do post
        await addPoints(additionalData.targetUserId, 0, 'likesReceived');
      }
    } catch (err) {
      console.error('Erro ao rastrear ação:', err);
    }
  };

  const getActionKey = (action) => {
    const actionMap = {
      CREATE_POST: 'postsCreated',
      COMMENT: 'commentsCreated',
      LIKE: 'likesGiven',
      SHARE: 'sharesGiven'
    };
    return actionMap[action];
  };

  useEffect(() => {
    if (user?.uid) {
      fetchUserStats();
      fetchRanking();
    }
  }, [user?.uid]);

  return {
    userStats,
    ranking,
    loading,
    error,
    trackAction,
    addPoints,
    fetchRanking,
    BADGES_CONFIG,
    POINTS_CONFIG
  };
};