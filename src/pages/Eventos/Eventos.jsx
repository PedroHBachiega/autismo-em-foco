<<<<<<< HEAD
import React, { useState } from 'react'
import styles from './Eventos.module.css'
import { useFetchEventos } from '../../Hooks/useFetchEventos'
import { useDeleteDocument } from '../../Hooks/useDeleteDocument'
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
  const { deleteDocument, loading: deleteLoading } = useDeleteDocument("eventos");

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
      await deleteDocument(selectedEvento.id);
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
=======
import React from 'react'
import styles from './Eventos.module.css'

const Eventos = () => {
  // Dados simulados de eventos
  const eventos = [
    {
      id: 1,
      titulo: "Workshop sobre Comunicação Alternativa",
      data: "15/12/2023",
      horario: "14:00 - 17:00",
      local: "Centro Cultural São Paulo",
      descricao: "Workshop prático sobre métodos de comunicação alternativa para crianças com TEA.",
      imagem: "https://placehold.co/600x400/2361ad/FFF?text=Comunicação",
      categoria: "Workshop"
    },
    {
      id: 2,
      titulo: "Palestra: Inclusão Escolar na Prática",
      data: "20/12/2023",
      horario: "19:00 - 21:00",
      local: "Auditório Municipal",
      descricao: "Especialistas discutem estratégias efetivas para inclusão escolar de crianças com TEA.",
      imagem: "https://placehold.co/600x400/2361ad/FFF?text=Inclusão",
      categoria: "Palestra"
    },
    {
      id: 3,
      titulo: "Encontro de Famílias",
      data: "07/01/2024",
      horario: "10:00 - 13:00",
      local: "Parque Ibirapuera",
      descricao: "Encontro para troca de experiências entre famílias de pessoas com TEA.",
      imagem: "https://placehold.co/600x400/2361ad/FFF?text=Famílias",
      categoria: "Encontro"
    },
    {
      id: 4,
      titulo: "Curso: Manejo de Comportamentos Desafiadores",
      data: "15/01/2024 - 17/01/2024",
      horario: "18:30 - 20:30",
      local: "Online (Zoom)",
      descricao: "Curso de 3 dias sobre estratégias para lidar com comportamentos desafiadores.",
      imagem: "https://placehold.co/600x400/2361ad/FFF?text=Comportamento",
      categoria: "Curso"
    },
    {
      id: 5,
      titulo: "Feira de Tecnologias Assistivas",
      data: "28/01/2024",
      horario: "09:00 - 18:00",
      local: "Centro de Exposições Anhembi",
      descricao: "Exposição de tecnologias e recursos para apoio a pessoas com TEA e outras condições.",
      imagem: "https://placehold.co/600x400/2361ad/FFF?text=Tecnologia",
      categoria: "Feira"
    },
    {
      id: 6,
      titulo: "Grupo de Apoio para Pais e Cuidadores",
      data: "Todo primeiro sábado do mês",
      horario: "09:30 - 11:30",
      local: "Centro Comunitário Vila Mariana",
      descricao: "Grupo de apoio mensal para pais e cuidadores compartilharem experiências e desafios.",
      imagem: "https://placehold.co/600x400/2361ad/FFF?text=Apoio",
      categoria: "Grupo de Apoio"
    }
  ];

  // Filtros de categorias disponíveis
  const categorias = ["Todos", "Workshop", "Palestra", "Encontro", "Curso", "Feira", "Grupo de Apoio"];
  const [filtroCategoria, setFiltroCategoria] = React.useState("Todos");
  
  // Função para filtrar eventos por categoria
  const eventosFiltrados = filtroCategoria === "Todos" 
    ? eventos 
    : eventos.filter(evento => evento.categoria === filtroCategoria);
>>>>>>> origin/main

  return (
    <div className={styles.eventosContainer}>
      <header className={styles.eventosHeader}>
        <h1>Eventos e Atividades</h1>
<<<<<<< HEAD
        <p style={{ color: 'var(--text)'}}>Confira os próximos eventos, workshops e encontros relacionados ao TEA</p>
        
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
=======
        <p>Confira os próximos eventos, workshops e encontros relacionados ao TEA</p>
      </header>

>>>>>>> origin/main
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

<<<<<<< HEAD
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
=======
      <section className={styles.eventosGrid}>
        {eventosFiltrados.length > 0 ? (
          eventosFiltrados.map(evento => (
            <div key={evento.id} className={styles.eventoCard}>
              <div className={styles.eventoImagem}>
                <img src={evento.imagem} alt={evento.titulo} />
                <span className={styles.eventoCategoria}>{evento.categoria}</span>
>>>>>>> origin/main
              </div>
              <div className={styles.eventoConteudo}>
                <h3>{evento.titulo}</h3>
                <div className={styles.eventoInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📅</span>
<<<<<<< HEAD
                    <span >{formatarData(evento.dataEvento)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>⏰</span>
                    <span>{formatarHorario(evento.horario)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📍</span>
                    <span >{evento.local || "Local não definido"}</span>
                  </div>
                </div>
                <p style={{ color: 'var(--text)'}} className={styles.eventoDescricao}>{evento.descricao}</p>
                {isEventoFuturo(evento.dataEvento) ? (
                  <button className={styles.inscricaoBtn}>Inscrever-se</button>
                ) : (
                  <button className={styles.inscricaoBtn} disabled>Evento Finalizado</button>
                )}
=======
                    <span>{evento.data}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>⏰</span>
                    <span>{evento.horario}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📍</span>
                    <span>{evento.local}</span>
                  </div>
                </div>
                <p className={styles.eventoDescricao}>{evento.descricao}</p>
                <button className={styles.inscricaoBtn}>Inscrever-se</button>
>>>>>>> origin/main
              </div>
            </div>
          ))
        ) : (
          <div className={styles.semEventos}>
<<<<<<< HEAD
            <p>Nenhum evento encontrado para os filtros selecionados.</p>
=======
            <p>Nenhum evento encontrado para esta categoria.</p>
>>>>>>> origin/main
          </div>
        )}
      </section>

      <section className={styles.cadastroEventoSection}>
        <h2>Tem um evento para divulgar?</h2>
<<<<<<< HEAD
        <p style={{ color: 'var(--text)'}}>Se você organiza eventos relacionados ao TEA e gostaria de divulgá-los em nossa plataforma, entre em contato conosco.</p>
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
=======
        <p>Se você organiza eventos relacionados ao TEA e gostaria de divulgá-los em nossa plataforma, entre em contato conosco.</p>
        <button className={styles.cadastroEventoBtn}>Cadastrar Evento</button>
      </section>
>>>>>>> origin/main
    </div>
  )
}

export default Eventos