import React, { useState } from 'react'
import styles from './Eventos.module.css'
import { useFetchEventos } from '../../Hooks/useFetchEventos'
import api from '../../services/apiClient'
import { Timestamp } from 'firebase/firestore'
import { Link } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
import Modal from '../../components/Modal';

const Eventos = () => {
  const { userProfile } = useAuthValue();
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [filtroData, setFiltroData] = useState("todos"); // "todos", "futuros", "passados"
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);
  
  const { eventos, loading, error } = useFetchEventos(filtroData, filtroCategoria);
  const deleteLoading = false;

  // Categorias disponíveis
  const categorias = ["Todos", "Workshop", "Palestra", "Encontro", "Curso", "Feira", "Grupo de Apoio"];
  
  // Função para formatar data do Firestore
  const formatarData = (timestamp) => {
    if (!timestamp) return "Data não definida";
    const data = timestamp.toDate();
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Função para formatar horário
  const formatarHorario = (horario) => {
    return horario || "Horário não definido";
  };

  // Verificar se evento é futuro
  const isEventoFuturo = (dataEvento) => {
    if (!dataEvento) return false;
    const agora = new Date();
    const dataEventoDate = dataEvento.toDate();
    return dataEventoDate >= agora;
  };
  
  // Função para abrir o modal de confirmação de exclusão
  const handleDeleteClick = (evento) => {
    setSelectedEvento(evento);
    setShowDeleteModal(true);
  };
  
  // Função para confirmar a exclusão do evento
  const handleConfirmDelete = async () => {
    if (selectedEvento) {
      await api.del(`/eventos/${selectedEvento.id}`);
      setShowDeleteModal(false);
      setSelectedEvento(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.eventosContainer}>
        <div className={styles.loading}>
          <p>Carregando eventos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.eventosContainer}>
        <div className={styles.error}>
          <p>Erro ao carregar eventos: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.eventosContainer}>
      <header className={styles.eventosHeader}>
        <h1>Eventos e Atividades</h1>
        <p>Confira os próximos eventos, workshops e encontros relacionados ao TEA</p>
        
        {/* Botão para cadastrar evento (apenas para admins e profissionais) */}
        {userProfile && ['admin', 'profissional'].includes(userProfile.userType) && (
          <Link to="/cadastro-evento" className={styles.cadastrarEventoBtn}>
            ➕ Cadastrar Novo Evento
          </Link>
        )}
      </header>

      {/* Filtros por Data */}
      <section className={styles.filtrosSection}>
        <h2>Filtrar por período</h2>
        <div className={styles.filtrosBotoes}>
          <button 
            className={`${styles.filtroBotao} ${filtroData === "todos" ? styles.ativo : ''}`}
            onClick={() => setFiltroData("todos")}
          >
            Todos os Eventos
          </button>
          <button 
            className={`${styles.filtroBotao} ${filtroData === "futuros" ? styles.ativo : ''}`}
            onClick={() => setFiltroData("futuros")}
          >
            Eventos Futuros
          </button>
          <button 
            className={`${styles.filtroBotao} ${filtroData === "passados" ? styles.ativo : ''}`}
            onClick={() => setFiltroData("passados")}
          >
            Eventos Passados
          </button>
        </div>
      </section>

      {/* Filtros por Categoria */}
      <section className={styles.filtrosSection}>
        <h2>Filtrar por categoria</h2>
        <div className={styles.filtrosBotoes}>
          {categorias.map(categoria => (
            <button 
              key={categoria}
              className={`${styles.filtroBotao} ${filtroCategoria === categoria ? styles.ativo : ''}`}
              onClick={() => setFiltroCategoria(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>
      </section>

      {/* Grid de Eventos */}
      <section className={styles.eventosGrid}>
        {eventos.length > 0 ? (
          eventos.map(evento => (
            <div key={evento.id} className={`${styles.eventoCard} ${!isEventoFuturo(evento.dataEvento) ? styles.eventoPassado : ''}`}>
              <div className={styles.eventoImagem}>
                <img 
                  src={evento.imagem || "https://placehold.co/600x400/2361ad/FFF?text=Evento"} 
                  alt={evento.titulo} 
                />
                <span className={styles.eventoCategoria}>{evento.categoria}</span>
                {!isEventoFuturo(evento.dataEvento) && (
                  <span className={styles.eventoStatus}>Finalizado</span>
                )}
                {userProfile && ['admin', 'profissional'].includes(userProfile.userType) && (
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDeleteClick(evento)}
                    title="Excluir evento"
                  >
                    🗑️
                  </button>
                )}
              </div>
              <div className={styles.eventoConteudo}>
                <h3>{evento.titulo}</h3>
                <div className={styles.eventoInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📅</span>
                    <span>{formatarData(evento.dataEvento)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>⏰</span>
                    <span>{formatarHorario(evento.horario)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📍</span>
                    <span>{evento.local || "Local não definido"}</span>
                  </div>
                </div>
                <p className={styles.eventoDescricao}>{evento.descricao}</p>
                {isEventoFuturo(evento.dataEvento) ? (
                  <button className={styles.inscricaoBtn}>Inscrever-se</button>
                ) : (
                  <button className={styles.inscricaoBtn} disabled>Evento Finalizado</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.semEventos}>
            <p>Nenhum evento encontrado para os filtros selecionados.</p>
          </div>
        )}
      </section>

      <section className={styles.cadastroEventoSection}>
        <h2>Tem um evento para divulgar?</h2>
        <p>Se você organiza eventos relacionados ao TEA e gostaria de divulgá-los em nossa plataforma, entre em contato conosco.</p>
        <button className={styles.cadastroEventoBtn}>Cadastrar Evento</button>
      </section>
      
      {/* Modal de confirmação de exclusão */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Exclusão"
        confirmText="Excluir Evento"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
      >
        {selectedEvento && (
          <>
            <p>Tem certeza que deseja excluir o evento <strong>{selectedEvento.titulo}</strong>?</p>
            <p>Esta ação não pode ser desfeita.</p>
          </>
        )}
      </Modal>
    </div>
  )
}

export default Eventos