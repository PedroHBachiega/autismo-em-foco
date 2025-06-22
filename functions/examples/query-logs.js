/* eslint-env node */
/* eslint-disable no-undef, no-unused-vars */

const admin = require('firebase-admin');


const db = admin.firestore();

/**
 * Consulta logs por tipo de ação
 * @param {string} action - Tipo de ação (create, update, delete)
 * @param {number} limit - Número máximo de resultados
 * @returns {Promise<Array<Object>>}
 */
async function queryLogsByAction(action, limit = 10) {
  try {
    const snapshot = await db
      .collection('activity_logs')
      .where('action', '==', action)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao consultar logs por ação:', error);
    throw error;
  }
}

/**
 * Consulta logs por usuário
 * @param {string} userId - ID do usuário
 * @param {number} limit - Número máximo de resultados
 * @returns {Promise<Array<Object>>}
 */
async function queryLogsByUser(userId, limit = 10) {
  try {
    const snapshot = await db
      .collection('activity_logs')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao consultar logs por usuário:', error);
    throw error;
  }
}

/**
 * Consulta logs por coleção
 * @param {string} collectionName - Nome da coleção
 * @param {number} limit - Número máximo de resultados
 * @returns {Promise<Array<Object>>}
 */
async function queryLogsByCollection(collectionName, limit = 10) {
  try {
    const snapshot = await db
      .collection('activity_logs')
      .where('collection', '==', collectionName)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao consultar logs por coleção:', error);
    throw error;
  }
}

/**
 * Consulta logs por período
 * @param {Date} startDate - Data inicial
 * @param {Date} endDate - Data final
 * @param {number} limit - Número máximo de resultados
 * @returns {Promise<Array<Object>>}
 */
async function queryLogsByDateRange(startDate, endDate, limit = 10) {
  try {
    const startTimestamp = admin.firestore.Timestamp.fromDate(startDate);
    const endTimestamp = admin.firestore.Timestamp.fromDate(endDate);

    const snapshot = await db
      .collection('activity_logs')
      .where('timestamp', '>=', startTimestamp)
      .where('timestamp', '<=', endTimestamp)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao consultar logs por data:', error);
    throw error;
  }
}


