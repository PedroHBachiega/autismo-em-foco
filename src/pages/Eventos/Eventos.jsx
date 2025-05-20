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

  return (
    <div className={styles.eventosContainer}>
      <header className={styles.eventosHeader}>
        <h1>Eventos e Atividades</h1>
        <p>Confira os próximos eventos, workshops e encontros relacionados ao TEA</p>
      </header>

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

      <section className={styles.eventosGrid}>
        {eventosFiltrados.length > 0 ? (
          eventosFiltrados.map(evento => (
            <div key={evento.id} className={styles.eventoCard}>
              <div className={styles.eventoImagem}>
                <img src={evento.imagem} alt={evento.titulo} />
                <span className={styles.eventoCategoria}>{evento.categoria}</span>
              </div>
              <div className={styles.eventoConteudo}>
                <h3>{evento.titulo}</h3>
                <div className={styles.eventoInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📅</span>
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
              </div>
            </div>
          ))
        ) : (
          <div className={styles.semEventos}>
            <p>Nenhum evento encontrado para esta categoria.</p>
          </div>
        )}
      </section>

      <section className={styles.cadastroEventoSection}>
        <h2>Tem um evento para divulgar?</h2>
        <p>Se você organiza eventos relacionados ao TEA e gostaria de divulgá-los em nossa plataforma, entre em contato conosco.</p>
        <button className={styles.cadastroEventoBtn}>Cadastrar Evento</button>
      </section>
    </div>
  )
}

export default Eventos