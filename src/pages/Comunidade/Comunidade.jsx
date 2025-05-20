import React from 'react'
import styles from './Comunidade.module.css'

const Comunidade = () => {
  // Dados simulados para os posts da comunidade
  const posts = [
    {
      id: 1,
      author: "Maria Silva",
      avatar: "👩",
      date: "15/10/2023",
      content: "Ontem meu filho teve uma crise no supermercado. Alguém tem dicas de como lidar com situações assim em locais públicos?",
      likes: 24,
      comments: 15
    },
    {
      id: 2,
      author: "João Pereira",
      avatar: "👨",
      date: "14/10/2023",
      content: "Descobrimos que nosso filho de 3 anos está no espectro. Alguém pode recomendar bons profissionais em São Paulo?",
      likes: 18,
      comments: 22
    },
    {
      id: 3,
      author: "Dra. Ana Mendes",
      avatar: "👩‍⚕️",
      date: "12/10/2023",
      content: "Estou organizando um grupo de apoio para pais de crianças autistas em Campinas. Interessados podem entrar em contato por mensagem.",
      likes: 45,
      comments: 8
    },
    {
      id: 4,
      author: "Carlos Oliveira",
      avatar: "👨‍🦱",
      date: "10/10/2023",
      content: "Minha filha de 7 anos começou a usar comunicação alternativa e tem sido incrível ver seu progresso! Recomendo muito para quem está com dificuldades na comunicação verbal.",
      likes: 36,
      comments: 12
    }
  ];

  // Dados simulados para os grupos da comunidade
  const groups = [
    {
      id: 1,
      name: "Pais e Mães de Autistas",
      members: 1250,
      posts: 320
    },
    {
      id: 2,
      name: "TEA na Adolescência",
      members: 845,
      posts: 210
    },
    {
      id: 3,
      name: "Autismo e Educação Inclusiva",
      members: 930,
      posts: 275
    },
    {
      id: 4,
      name: "Profissionais do TEA",
      members: 680,
      posts: 190
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Comunidade</h1>
        <p>Compartilhe experiências e conecte-se com outras pessoas</p>
      </header>

      <div className={styles.contentGrid}>
        <main className={styles.mainContent}>
          <div className={styles.createPost}>
            <textarea 
              placeholder="Compartilhe algo com a comunidade..." 
              className={styles.postInput}
            />
            <button className={styles.postButton}>Publicar</button>
          </div>

          <div className={styles.feedFilter}>
            <button className={`${styles.filterButton} ${styles.active}`}>Recentes</button>
            <button className={styles.filterButton}>Populares</button>
            <button className={styles.filterButton}>Meus Grupos</button>
          </div>

          <div className={styles.postsList}>
            {posts.map(post => (
              <div key={post.id} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <div className={styles.postAuthor}>
                    <div className={styles.authorAvatar}>{post.avatar}</div>
                    <div>
                      <h3>{post.author}</h3>
                      <span className={styles.postDate}>{post.date}</span>
                    </div>
                  </div>
                  <button className={styles.moreButton}>•••</button>
                </div>
                <div className={styles.postContent}>
                  <p>{post.content}</p>
                </div>
                <div className={styles.postActions}>
                  <button className={styles.actionButton}>
                    ❤️ {post.likes}
                  </button>
                  <button className={styles.actionButton}>
                    💬 {post.comments}
                  </button>
                  <button className={styles.actionButton}>
                    🔗 Compartilhar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <h2>Meu Perfil</h2>
            <div className={styles.profilePreview}>
              <div className={styles.profileAvatar}>👤</div>
              <h3>Usuário</h3>
              <p>Complete seu perfil para conectar-se melhor</p>
              <button className={styles.editProfileButton}>Editar Perfil</button>
            </div>
          </div>

          <div className={styles.sidebarCard}>
            <h2>Grupos Populares</h2>
            <div className={styles.groupsList}>
              {groups.map(group => (
                <div key={group.id} className={styles.groupItem}>
                  <div className={styles.groupInfo}>
                    <h3>{group.name}</h3>
                    <p>{group.members} membros • {group.posts} posts</p>
                  
                    <div className={styles.groupInfo}>
                      <h3>{group.name}</h3>
                      <p>{group.members} membros • {group.posts} posts</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Comunidade