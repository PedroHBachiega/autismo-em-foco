import { useState } from 'react';
import toast from 'react-hot-toast';
import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuthValue } from '../context/AuthContext';

export const useAgendamentoToast = () => {
  const { user } = useAuthValue();
  const [loading, setLoading] = useState(false);

  // Função para exibir toast de sucesso
  const showSuccessToast = (message) => {
    return toast.success(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#E6F7E8',
        color: '#2E7D32',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      iconTheme: {
        primary: '#2E7D32',
        secondary: '#FFFFFF',
      },
    });
  };

  // Função para exibir toast de erro
  const showErrorToast = (message) => {
    return toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#FEECEC',
        color: '#D32F2F',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      iconTheme: {
        primary: '#D32F2F',
        secondary: '#FFFFFF',
      },
    });
  };

  // Função para exibir toast de lembrete
  const showReminderToast = (message) => {
    return toast(message, {
      duration: 6000,
      position: 'top-right',
      icon: '⏰',
      style: {
        background: '#E3F2FD',
        color: '#1565C0',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    });
  };

  // Função para salvar notificação no Firebase
  const saveNotification = async (type, title, body, agendamentoId) => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Adicionar notificação à coleção de notificações do usuário
      await addDoc(collection(db, 'users', user.uid, 'notifications'), {
        type,
        title,
        body,
        agendamentoId,
        read: false,
        createdAt: serverTimestamp(),
      });

      // Atualizar contador de notificações não lidas
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        unreadNotifications: true
      }, { merge: true });

      return true;
    } catch (error) {
      console.error('Erro ao salvar notificação:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função para notificar agendamento criado
  const notifyAgendamentoCriado = async (agendamento) => {
    const title = 'Agendamento Confirmado';
    const body = `Sua consulta com ${agendamento.profissionalNome} foi agendada para ${agendamento.data} às ${agendamento.horario}.`;
    
    showSuccessToast(body);
    await saveNotification('success', title, body, agendamento.id);
  };

  // Função para notificar erro no agendamento
  const notifyAgendamentoErro = async (mensagem) => {
    const title = 'Erro no Agendamento';
    const body = mensagem || 'Ocorreu um erro ao realizar seu agendamento. Por favor, tente novamente.';
    
    showErrorToast(body);
    await saveNotification('error', title, body);
  };

  // Função para notificar lembrete de agendamento
  const notifyAgendamentoLembrete = async (agendamento) => {
    const title = 'Lembrete de Consulta';
    const body = `Lembrete: Você tem uma consulta com ${agendamento.profissionalNome} amanhã às ${agendamento.horario}.`;
    
    showReminderToast(body);
    await saveNotification('reminder', title, body, agendamento.id);
  };

  return {
    loading,
    notifyAgendamentoCriado,
    notifyAgendamentoErro,
    notifyAgendamentoLembrete,
    showSuccessToast,
    showErrorToast,
    showReminderToast
  };
};