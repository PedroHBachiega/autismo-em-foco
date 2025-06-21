/**
 * Exemplo de como consultar logs de atividades
 * 
 * Este arquivo é apenas um exemplo e não é parte das funções implantadas.
 * Pode ser usado como referência para implementar consultas aos logs em outras partes da aplicação.
 */

const admin = require('firebase-admin');

// Inicializar o app (em um ambiente real, isso já estaria inicializado)
// admin.initializeApp();
const db = admin.firestore();

/**
 * Consulta logs por tipo de ação
 * @param {string} action - Tipo de ação (create, update, delete)
 * @param {number} limit - Número máximo de resultados
 */
async function queryLogsByAction(action, limit = 10) {
  try {
    const snapshot = await db.collection('activity_logs')
      .where('action', '==', action)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    
    const logs = [];
    snapshot.forEach(doc => {
      logs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return logs;
  } catch (error) {
    console.error('Erro ao consultar logs:', error);
    throw error;
  }
}

/**
 * Consulta logs por usuário
 * @param {string} userId - ID do usuário
 * @param {number} limit - Número máximo de resultados
 */
async function queryLogsByUser(userId, limit = 10) {
  try {
    const snapshot = await db.collection('activity_logs')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    
    const logs = [];
    snapshot.forEach(doc => {
      logs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return logs;
  } catch (error) {
    console.error('Erro ao consultar logs:', error);
    throw error;
  }
}

/**
 * Consulta logs por coleção
 * @param {string} collection - Nome da coleção
 * @param {number} limit - Número máximo de resultados
 */
async function queryLogsByCollection(collection, limit = 10) {
  try {
    const snapshot = await db.collection('activity_logs')
      .where('collection', '==', collection)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    
    const logs = [];
    snapshot.forEach(doc => {
      logs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return logs;
  } catch (error) {
    console.error('Erro ao consultar logs:', error);
    throw error;
  }
}

/**
 * Consulta logs por período
 * @param {Date} startDate - Data inicial
 * @param {Date} endDate - Data final
 * @param {number} limit - Número máximo de resultados
 */
async function queryLogsByDateRange(startDate, endDate, limit = 10) {
  try {
    const startTimestamp = admin.firestore.Timestamp.fromDate(startDate);
    const endTimestamp = admin.firestore.Timestamp.fromDate(endDate);
    
    const snapshot = await db.collection('activity_logs')
      .where('timestamp', '>=', startTimestamp)
      .where('timestamp', '<=', endTimestamp)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    
    const logs = [];
    snapshot.forEach(doc => {
      logs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return logs;
  } catch (error) {
    console.error('Erro ao consultar logs:', error);
    throw error;
  }
}

// Exemplos de uso:
// queryLogsByAction('create', 5).then(logs => console.log(logs));
// queryLogsByUser('user123', 5).then(logs => console.log(logs));
// queryLogsByCollection('agendamentos', 5).then(logs => console.log(logs));
// queryLogsByDateRange(new Date('2023-01-01'), new Date(), 5).then(logs => console.log(logs));