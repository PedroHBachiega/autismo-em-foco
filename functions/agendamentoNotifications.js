/* eslint-env node */
/* eslint-disable no-undef */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Função para enviar notificação quando um agendamento é criado
 * Esta função é acionada quando um novo documento é criado na coleção 'agendamentos'
 */
exports.onAgendamentoCriado = functions.firestore
  .document('agendamentos/{agendamentoId}')
  .onCreate(async (snapshot, context) => {
    try {
      const agendamentoData = snapshot.data();
      const { uid, profissionalNome, data, horario } = agendamentoData;
      
      // Buscar token FCM do usuário
      const userTokenDoc = await admin.firestore().collection('fcmTokens').doc(uid).get();
      
      if (!userTokenDoc.exists) {
        console.log(`Nenhum token FCM encontrado para o usuário ${uid}`);
        return null;
      }
      
      const { token } = userTokenDoc.data();
      
      // Criar mensagem de notificação
      const message = {
        notification: {
          title: 'Agendamento Confirmado',
          body: `Sua consulta com ${profissionalNome} foi agendada para ${data} às ${horario}.`
        },
        data: {
          agendamentoId: context.params.agendamentoId,
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
          tipo: 'agendamento_criado'
        },
        token: token
      };
      
      // Enviar notificação
      const response = await admin.messaging().send(message);
      console.log('Notificação enviada com sucesso:', response);
      
      // Registrar log de atividade
      await admin.firestore().collection('activity_logs').add({
        action: 'notification_sent',
        collection: 'agendamentos',
        documentId: context.params.agendamentoId,
        userId: uid,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        details: {
          notificationType: 'agendamento_criado',
          messageId: response
        }
      });
      
      return response;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return null;
    }
  });

/**
 * Função para enviar notificação de lembrete 24h antes do agendamento
 * Esta função é executada uma vez por dia às 10:00
 */
exports.enviarLembretesAgendamento = functions.pubsub
  .schedule('0 10 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(async (context) => {
    try {
      // Calcular data para amanhã
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      const dataAmanha = amanha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      
      // Buscar agendamentos para amanhã
      const agendamentosSnapshot = await admin.firestore()
        .collection('agendamentos')
        .where('data', '==', dataAmanha)
        .where('status', '==', 'agendado')
        .get();
      
      if (agendamentosSnapshot.empty) {
        console.log('Nenhum agendamento para amanhã');
        return null;
      }
      
      // Array para armazenar promessas de envio de notificações
      const notificationPromises = [];
      
      // Processar cada agendamento
      agendamentosSnapshot.forEach(doc => {
        const agendamento = doc.data();
        const { uid, profissionalNome, horario } = agendamento;
        
        // Criar promessa para enviar notificação
        const notificationPromise = (async () => {
          // Buscar token FCM do usuário
          const userTokenDoc = await admin.firestore().collection('fcmTokens').doc(uid).get();
          
          if (!userTokenDoc.exists) {
            console.log(`Nenhum token FCM encontrado para o usuário ${uid}`);
            return null;
          }
          
          const { token } = userTokenDoc.data();
          
          // Criar mensagem de notificação
          const message = {
            notification: {
              title: 'Lembrete de Consulta',
              body: `Lembrete: Você tem uma consulta com ${profissionalNome} amanhã às ${horario}.`
            },
            data: {
              agendamentoId: doc.id,
              click_action: 'FLUTTER_NOTIFICATION_CLICK',
              tipo: 'agendamento_lembrete'
            },
            token: token
          };
          
          // Enviar notificação
          return admin.messaging().send(message);
        })();
        
        notificationPromises.push(notificationPromise);
      });
      
      // Aguardar todas as notificações serem enviadas
      const results = await Promise.all(notificationPromises);
      console.log(`Enviados ${results.filter(r => r !== null).length} lembretes de agendamento`);
      
      return results;
    } catch (error) {
      console.error('Erro ao enviar lembretes:', error);
      return null;
    }
  });