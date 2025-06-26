import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.module.css'
import puzzleHandImage from '../../assets/puzzle-hand.jpg'

const Home = () => {
  return (
    <div className={styles.container}>
      {/* Banner principal */}
      <section 
        className={styles.heroBanner}
        style={{ backgroundImage: `url(${puzzleHandImage})` }}
      >
        <div className={styles.heroContent}>
          <div className={styles.heroTextBox}>
<<<<<<< HEAD
            <h2 style={{ color: 'var(--text)'}}>Compreender Para Incluir</h2>
            <h1 style={{ color: 'var(--text)'}}>Autismo em Foco</h1>
=======
            <h2>Compreender Para Incluir</h2>
            <h1>Autismo em Foco</h1>
>>>>>>> origin/main
            <Link to="/sobre" className={styles.heroButton}>Saiba mais</Link>
          </div>
        </div>
      </section>

      {/* Cards informativos */}
      <section className={styles.infoCards}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>
<<<<<<< HEAD
            <span style={{ color: 'var(--text)'}}>?</span>
          </div>
          <h3 style={{ color: 'var(--text)'}}>O que é o autismo?</h3>
          <p style={{ color: 'var(--text)'}}>Conheça as principais características do transtorno do espectro autista e como ele se manifesta.</p>
=======
            <span>?</span>
          </div>
          <h3>O que é o autismo?</h3>
          <p>Conheça as principais características do transtorno do espectro autista e como ele se manifesta.</p>
>>>>>>> origin/main
          <Link to="/sobreautismo" className={styles.cardButton}>Acessar</Link>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <span>⚖️</span>
          </div>
<<<<<<< HEAD
          <h3 style={{ color: 'var(--text)'}}>Leis relacionadas</h3>
          <p style={{ color: 'var(--text)'}}>Confira os direitos das pessoas com autismo garantidos por lei.</p>
=======
          <h3>Leis relacionadas</h3>
          <p>Confira os direitos das pessoas com autismo garantidos por lei.</p>
>>>>>>> origin/main
          <Link to="/leisedireitos" className={styles.cardButton}>Acessar</Link>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <span>📅</span>
          </div>
<<<<<<< HEAD
          <h3 style={{ color: 'var(--text)'}}>Datas Especiais</h3>
          <p style={{ color: 'var(--text)'}}>Descubra eventos e datas importantes para a conscientização sobre o autismo.</p>
=======
          <h3>Datas Especiais</h3>
          <p>Descubra eventos e datas importantes para a conscientização sobre o autismo.</p>
>>>>>>> origin/main
          <Link to="/eventos" className={styles.cardButton}>Acessar</Link>
        </div>
      </section>

      {/* Seção sobre comunidade */}
      <section className={styles.communitySection}>
        <div className={styles.communityIcon}>
          <span>👥</span>
        </div>
        <h2>Sobre nossa comunidade</h2>
        <p>A comunidade Autismo em Foco é um espaço online criado para todos que convivem com o Transtorno do Espectro Autista (TEA) – sejam pais, familiares, profissionais ou pessoas autistas. Aqui, compartilhamos experiências, conhecimentos e apoio mútuo.</p>
        <p>Nosso objetivo é proporcionar um ambiente acolhedor onde todos possam encontrar informações confiáveis, trocar experiências e construir uma rede de apoio. Acreditamos que juntos somos mais fortes e podemos criar um mundo mais inclusivo para as pessoas com autismo.</p>
        <p>Faça parte dessa comunidade, participe das conversas e ajude a construir um espaço onde todos se sintam acolhidos e compreendidos.</p>
      </section>
    </div>
  )
}

export default Home