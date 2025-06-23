/* eslint-env node */
/* eslint-disable no-undef */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const os = require('os');
const path = require('path');

admin.initializeApp();
const db = admin.firestore();

/**
 * Função para registrar logs de atividades críticas no Firestore
 * @param {string} uid - ID do usuário que realizou a ação
 * @param {string} action - Tipo de ação (create, update, delete)
 * @param {string} collection - Coleção onde a ação foi realizada
 * @param {string} documentId - ID do documento afetado
 * @param {Object} data - Dados relacionados à ação
 */
const logActivity = async (uid, action, collection, documentId, data) => {
  try {
    await db.collection('activity_logs').add({
      uid,
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
      data.uid || "sem-uid",
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

// Configuração do transporte de email
const configureMailTransport = () => {
  // Verificar se as configurações de email estão definidas
  const emailUser = functions.config().email?.user;
  const emailPass = functions.config().email?.pass;
  
  if (!emailUser || !emailPass || emailUser === 'seu-email@gmail.com' || emailPass === 'sua-senha-app') {
    console.error('Credenciais de email não configuradas corretamente');
    throw new Error('Credenciais de email não configuradas');
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
};

// Função para formatar a data
const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

// Função para gerar PDF de confirmação de agendamento
const generateAppointmentPDF = async (agendamento) => {
  return new Promise((resolve, reject) => {
    try {
      // Criar um arquivo temporário para o PDF
      const tempFilePath = path.join(os.tmpdir(), `confirmacao-${agendamento.id}.pdf`);
      
      // Criar um novo documento PDF
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });
      
      // Pipe o PDF para o arquivo temporário
      const stream = fs.createWriteStream(tempFilePath);
      doc.pipe(stream);
      
      // Adicionar conteúdo ao PDF
      doc.fontSize(20).text('Autismo em Foco', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text('Confirmação de Agendamento', { align: 'center' });
      doc.moveDown();
      
      // Informações do agendamento
      doc.fontSize(12).text(`Profissional: ${agendamento.profissionalNome}`);
      doc.fontSize(12).text(`Especialidade: ${agendamento.especialidade}`);
      doc.fontSize(12).text(`Data: ${formatDate(agendamento.data)}`);
      doc.fontSize(12).text(`Horário: ${agendamento.horario}`);
      doc.fontSize(12).text(`Status: ${agendamento.status}`);
      doc.moveDown();
      
      // Informações adicionais
      doc.fontSize(10).text('Observações:', { underline: true });
      doc.fontSize(10).text('- Chegue com 15 minutos de antecedência.');
      doc.fontSize(10).text('- Traga documentos de identificação e cartão do convênio (se aplicável).');
      doc.fontSize(10).text('- Em caso de impossibilidade de comparecimento, favor cancelar com pelo menos 24h de antecedência.');
      doc.moveDown();
      
      // Rodapé
      doc.fontSize(10).text('Autismo em Foco - Plataforma de Apoio a Pessoas com TEA', { align: 'center' });
      
      // Finalizar o PDF
      doc.end();
      
      // Quando o stream for fechado, o PDF estará pronto
      stream.on('finish', () => {
        resolve(tempFilePath);
      });
      
      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Função para enviar email com o PDF anexado
const sendAppointmentEmail = async (userEmail, userName, pdfPath, agendamento) => {
  const mailTransport = configureMailTransport();
  
  const mailOptions = {
    from: '"Autismo em Foco" <pedrosouza1001000@gmail.com>',
    to: userEmail,
    subject: 'Confirmação de Agendamento - Autismo em Foco',
    text: `Olá ${userName},\n\nSeu agendamento foi confirmado com sucesso!\n\nDetalhes do agendamento:\nProfissional: ${agendamento.profissionalNome}\nEspecialidade: ${agendamento.especialidade}\nData: ${formatDate(agendamento.data)}\nHorário: ${agendamento.horario}\n\nEm anexo está o comprovante do seu agendamento.\n\nAtenciosamente,\nEquipe Autismo em Foco`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2e5eaa;">Confirmação de Agendamento</h2>
        <p>Olá <strong>${userName}</strong>,</p>
        <p>Seu agendamento foi confirmado com sucesso!</p>
        
        <div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #2e5eaa; margin-top: 0;">Detalhes do agendamento:</h3>
          <p><strong>Profissional:</strong> ${agendamento.profissionalNome}</p>
          <p><strong>Especialidade:</strong> ${agendamento.especialidade}</p>
          <p><strong>Data:</strong> ${formatDate(agendamento.data)}</p>
          <p><strong>Horário:</strong> ${agendamento.horario}</p>
        </div>
        
        <p>Em anexo está o comprovante do seu agendamento.</p>
        
        <p>Atenciosamente,<br>Equipe Autismo em Foco</p>
      </div>
    `,
    attachments: [
      {
        filename: `confirmacao-agendamento.pdf`,
        path: pdfPath,
        contentType: 'application/pdf'
      }
    ]
  };
  
  return mailTransport.sendMail(mailOptions);
};

// Cloud Function para gerar PDF e enviar email após agendamento
exports.generateAppointmentConfirmation = functions.firestore
  .document('agendamentos/{documentId}')
  .onCreate(async (snapshot, context) => {
    try {
      const agendamento = {
        id: context.params.documentId,
        ...snapshot.data()
      };

      console.log('Dados do agendamento:', JSON.stringify(agendamento));

      // Usar diretamente o email do agendamento se disponível
      let userEmail = agendamento.userEmail;
      let userName = agendamento.userName || 'Paciente';

      // Se não tiver email direto, buscar do perfil do usuário
      if (!userEmail && agendamento.uid) {
        const userRef = db.collection('users').doc(agendamento.uid);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          userEmail = userData.email;
          userName = userData.displayName || userName;
        }
      }

      // Verificar se o email foi encontrado
      if (!userEmail) {
        console.error('Nenhum email foi encontrado para envio. Dados do agendamento:', JSON.stringify(agendamento));
        return null;
      }

      console.log(`Enviando email para: ${userEmail}`);

      // Gerar o PDF de confirmação
      const pdfPath = await generateAppointmentPDF(agendamento);
      console.log(`PDF gerado em: ${pdfPath}`);

      // Enviar o email com o PDF anexado
      const emailResult = await sendAppointmentEmail(userEmail, userName, pdfPath, agendamento);
      console.log('Resultado do envio de email:', emailResult);

      // Limpar o arquivo temporário
      fs.unlinkSync(pdfPath);

      // Atualizar o documento de agendamento com a informação de que o email foi enviado
      await snapshot.ref.update({
        confirmationEmailSent: true,
        confirmationEmailSentAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return null;
    } catch (error) {
      console.error('Erro ao gerar confirmação de agendamento:', error);
      // Registrar o erro no Firestore para diagnóstico
      await db.collection('error_logs').add({
        function: 'generateAppointmentConfirmation',
        error: error.toString(),
        stack: error.stack,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      return null;
    }
  });

// Função para enviar notificação para todos os usuários
const sendNotificationToAll = async (title, body, data = {}) => {
  try {
    const tokensSnapshot = await db.collection('fcmTokens').get();
    const tokens = [];
    
    tokensSnapshot.forEach(doc => {
      const tokenData = doc.data();
      if (tokenData.token) {
        tokens.push(tokenData.token);
      }
    });

    if (tokens.length === 0) {
      console.log('Nenhum token FCM encontrado');
      return;
    }

    const message = {
      notification: {
        title,
        body
      },
      data,
      tokens
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log(`Notificação enviada para ${response.successCount} dispositivos`);
    
    return response;
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
  }
};

// Notificação para nova postagem
exports.notifyNewPost = functions.firestore
  .document('posts/{postId}')
  .onCreate(async (snapshot, context) => {
    const postData = snapshot.data();
    const postId = context.params.postId;
    
    await sendNotificationToAll(
      '📝 Nova Postagem!',
      `${postData.createdBy} publicou: ${postData.title}`,
      {
        type: 'new_post',
        postId,
        postTitle: postData.title
      }
    );
  });

// Notificação para novo evento
exports.notifyNewEvent = functions.firestore
  .document('eventos/{eventId}')
  .onCreate(async (snapshot, context) => {
    const eventData = snapshot.data();
    const eventId = context.params.eventId;
    
    await sendNotificationToAll(
      '🎉 Novo Evento!',
      `Evento: ${eventData.titulo} - ${eventData.dataEvento}`,
      {
        type: 'new_event',
        eventId,
        eventTitle: eventData.titulo
      }
    );
  });

// Notificação para nova resposta/comentário
exports.notifyNewComment = functions.firestore
  .document('posts/{postId}/comments/{commentId}')
  .onCreate(async (snapshot, context) => {
    const commentData = snapshot.data();
    const postId = context.params.postId;
    
    // Buscar dados do post
    const postDoc = await db.collection('posts').doc(postId).get();
    const postData = postDoc.data();
    
    if (postData && postData.uid !== commentData.uid) {
      // Buscar token do autor do post
      const tokenDoc = await db.collection('fcmTokens').doc(postData.uid).get();
      
      if (tokenDoc.exists) {
        const tokenData = tokenDoc.data();
        
        const message = {
          notification: {
            title: '💬 Nova Resposta!',
            body: `${commentData.displayName} comentou no seu post: ${postData.title}`
          },
          data: {
            type: 'new_comment',
            postId,
            commentId: context.params.commentId
          },
          token: tokenData.token
        };

        await admin.messaging().send(message);
      }
    }
  });