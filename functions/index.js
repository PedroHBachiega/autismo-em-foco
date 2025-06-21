const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

/**
 * Função para registrar logs de atividades críticas no Firestore
 * @param {string} userId - ID do usuário que realizou a ação
 * @param {string} action - Tipo de ação (create, update, delete)
 * @param {string} collection - Coleção onde a ação foi realizada
 * @param {string} documentId - ID do documento afetado
 * @param {Object} data - Dados relacionados à ação
 */
const logActivity = async (userId, action, collection, documentId, data) => {
  try {
    await db.collection('activity_logs').add({
      userId,
      action,
      collection,
      documentId,
      data,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`Log de atividade registrado: ${action} em ${collection}/${documentId}`);
  } catch (error) {
    console.error('Erro ao registrar log de atividade:', error);
  }
};

// Função para registrar logs de agendamentos
exports.logScheduleActivity = functions.firestore
  .document('agendamentos/{documentId}')
  .onCreate((snapshot, context) => {
    const data = snapshot.data();
    const documentId = context.params.documentId;
    
    return logActivity(
      data.uid,
      'create',
      'agendamentos',
      documentId,
      {
        profissionalNome: data.profissionalNome,
        especialidade: data.especialidade,
        data: data.data,
        horario: data.horario,
        status: data.status
      }
    );
  });

// Função para registrar logs de cancelamento de agendamentos
exports.logScheduleDeleteActivity = functions.firestore
  .document('agendamentos/{documentId}')
  .onDelete((snapshot, context) => {
    const data = snapshot.data();
    const documentId = context.params.documentId;
    
    return logActivity(
      data.uid,
      'delete',
      'agendamentos',
      documentId,
      {
        profissionalNome: data.profissionalNome,
        especialidade: data.especialidade,
        data: data.data,
        horario: data.horario,
        status: data.status
      }
    );
  });

// Função para registrar logs de atualização de agendamentos
exports.logScheduleUpdateActivity = functions.firestore
  .document('agendamentos/{documentId}')
  .onUpdate((change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();
    const documentId = context.params.documentId;
    
    // Verificar se houve mudança de status
    if (oldData.status !== newData.status) {
      return logActivity(
        newData.uid,
        'update',
        'agendamentos',
        documentId,
        {
          profissionalNome: newData.profissionalNome,
          especialidade: newData.especialidade,
          data: newData.data,
          horario: newData.horario,
          oldStatus: oldData.status,
          newStatus: newData.status
        }
      );
    }
    
    return null;
  });

// Função para registrar logs de criação de posts na comunidade
exports.logPostActivity = functions.firestore
  .document('posts/{documentId}')
  .onCreate((snapshot, context) => {
    const data = snapshot.data();
    const documentId = context.params.documentId;
    
    return logActivity(
      data.uid,
      'create',
      'posts',
      documentId,
      {
        title: data.title,
        createdAt: data.createdAt
      }
    );
  });

// Função para registrar logs de exclusão de posts na comunidade
exports.logPostDeleteActivity = functions.firestore
  .document('posts/{documentId}')
  .onDelete((snapshot, context) => {
    const data = snapshot.data();
    const documentId = context.params.documentId;
    
    return logActivity(
      data.uid,
      'delete',
      'posts',
      documentId,
      {
        title: data.title,
        createdAt: data.createdAt
      }
    );
  });