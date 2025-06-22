import React, { useState } from 'react'
import styles from './MeusAgendamentos.module.css'
import { useAuthValue } from '../../context/AuthContext'
import { useFetchDocuments } from '../../Hooks/useFetchDocuments'
import { useDeleteDocument } from '../../Hooks/useDeleteDocument'
import { Link } from 'react-router-dom'

const MeusAgendamentos = () => {
  const { user } = useAuthValue();
  const [cancelMessage, setCancelMessage] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const { documents: agendamentos, loading } = useFetchDocuments('agendamentos', null, user?.uid);
  const { deleteDocument } = useDeleteDocument('agendamentos');

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleCancelClick = (agendamento) => {
    setSelectedAppointment(agendamento);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (selectedAppointment) {
      await deleteDocument(selectedAppointment.id);
      setCancelMessage('Agendamento cancelado com sucesso!');
      setShowCancelModal(false);
      
      // Limpar a mensagem após 3 segundos
      setTimeout(() => {
        setCancelMessage('');
      }, 3000);
    }
  };

  const handleCloseModal = () => {
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  // Agrupar agendamentos por status
  const agendamentosAgrupados = agendamentos?.reduce((acc, agendamento) => {
    const status = agendamento.status || 'agendado';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(agendamento);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Meus Agendamentos</h1>
        <p>Gerencie suas consultas agendadas</p>
      </header>

      {!user && (
        <div className={styles.notLoggedIn}>
          <h2>Você precisa estar logado para ver seus agendamentos</h2>
          <p>Faça login para visualizar e gerenciar suas consultas</p>
          <Link to="/login" className={styles.loginButton}>Fazer Login</Link>
        </div>
      )}

      {user && (
        <div className={styles.agendamentosContainer}>
          {loading && <p className={styles.loading}>Carregando agendamentos...</p>}
          
          {cancelMessage && (
            <div className={styles.successMessage}>
              <p>{cancelMessage}</p>
            </div>
          )}

          {!loading && agendamentos?.length === 0 && (
            <div className={styles.emptyState}>
              <h2>Você ainda não tem agendamentos</h2>
              <p>Agende uma consulta para começar seu acompanhamento</p>
              <Link to="/agendamento" className={styles.scheduleButton}>Agendar Consulta</Link>
            </div>
          )}

          {!loading && agendamentos?.length > 0 && (
            <>
              {/* Agendamentos Ativos */}
              {agendamentosAgrupados['agendado'] && agendamentosAgrupados['agendado'].length > 0 && (
                <section className={styles.agendamentosSection}>
                  <h2>Consultas Agendadas</h2>
                  <div className={styles.agendamentosGrid}>
                    {agendamentosAgrupados['agendado'].map((agendamento) => (
                      <div key={agendamento.id} className={styles.agendamentoCard}>
                        <div className={styles.cardHeader}>
                          <span className={styles.statusBadge}>Agendado</span>
                        </div>
                        <div className={styles.cardBody}>
                          <h3>{agendamento.profissionalNome}</h3>
                          <p className={styles.especialidade}>{agendamento.especialidade}</p>
                          <div className={styles.agendamentoInfo}>
                            <p><span>📅</span> <span>Data: {formatDate(agendamento.data)}</span></p>
                            <p><span>🕒</span> <span>Horário: {agendamento.horario}</span></p>
                          </div>
                        </div>
                        <div className={styles.cardFooter}>
                          <button 
                            className={styles.cancelButton}
                            onClick={() => handleCancelClick(agendamento)}
                          >
                            Cancelar Agendamento
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Agendamentos Cancelados */}
              {agendamentosAgrupados['cancelado'] && agendamentosAgrupados['cancelado'].length > 0 && (
                <section className={styles.agendamentosSection}>
                  <h2>Consultas Canceladas</h2>
                  <div className={styles.agendamentosGrid}>
                    {agendamentosAgrupados['cancelado'].map((agendamento) => (
                      <div key={agendamento.id} className={`${styles.agendamentoCard} ${styles.canceledCard}`}>
                        <div className={styles.cardHeader}>
                          <span className={`${styles.statusBadge} ${styles.canceledBadge}`}>Cancelado</span>
                        </div>
                        <div className={styles.cardBody}>
                          <h3>{agendamento.profissionalNome}</h3>
                          <p className={styles.especialidade}>{agendamento.especialidade}</p>
                          <div className={styles.agendamentoInfo}>
                            <p><span>📅</span> <span>Data: {formatDate(agendamento.data)}</span></p>
                            <p><span>🕒</span> <span>Horário: {agendamento.horario}</span></p>
                          </div>
                        </div>
                        <div className={styles.cardFooter}>
                          <Link 
                            to="/agendamento" 
                            className={styles.rescheduleButton}
                          >
                            Reagendar
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Agendamentos Concluídos */}
              {agendamentosAgrupados['concluido'] && agendamentosAgrupados['concluido'].length > 0 && (
                <section className={styles.agendamentosSection}>
                  <h2>Consultas Concluídas</h2>
                  <div className={styles.agendamentosGrid}>
                    {agendamentosAgrupados['concluido'].map((agendamento) => (
                      <div key={agendamento.id} className={`${styles.agendamentoCard} ${styles.completedCard}`}>
                        <div className={styles.cardHeader}>
                          <span className={`${styles.statusBadge} ${styles.completedBadge}`}>Concluído</span>
                        </div>
                        <div className={styles.cardBody}>
                          <h3>{agendamento.profissionalNome}</h3>
                          <p className={styles.especialidade}>{agendamento.especialidade}</p>
                          <div className={styles.agendamentoInfo}>
                            <p><span>📅</span> <span>Data: {formatDate(agendamento.data)}</span></p>
                            <p><span>🕒</span> <span>Horário: {agendamento.horario}</span></p>
                          </div>
                        </div>
                        <div className={styles.cardFooter}>
                          <Link 
                            to="/agendamento" 
                            className={styles.scheduleButton}
                          >
                            Agendar Nova Consulta
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}

      {/* Modal de Confirmação de Cancelamento */}
      {showCancelModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirmar Cancelamento</h3>
            <p>Tem certeza que deseja cancelar o agendamento com {selectedAppointment?.profissionalNome} para o dia {formatDate(selectedAppointment?.data)} às {selectedAppointment?.horario}?</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.modalCancelButton}
                onClick={handleCloseModal}
              >
                Voltar
              </button>
              <button 
                className={styles.modalConfirmButton}
                onClick={handleConfirmCancel}
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MeusAgendamentos