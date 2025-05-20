import React from 'react'
import styles from './Sobre.module.css'

const Sobre = () => {
  return (
    <div className={styles.sobreContainer}>
      <section className={styles.header}>
        <h1>Sobre o Autismo em Foco</h1>
        <p>Conheça nossa missão e equipe</p>
      </section>

      <section className={styles.mission}>
        <div className={styles.missionContent}>
          <h2>Nossa Missão</h2>
          <p>O Autismo em Foco nasceu da necessidade de criar um espaço de apoio, informação e conexão para famílias e pessoas com Transtorno do Espectro Autista (TEA).</p>
          <p>Nosso objetivo é proporcionar recursos de qualidade, promover a inclusão e contribuir para uma sociedade mais consciente e acolhedora.</p>
        </div>
        <div className={styles.missionImage}>
          {/* Imagem ilustrativa */}
        </div>
      </section>

      <section className={styles.values}>
        <h2>Nossos Valores</h2>
        <div className={styles.valuesList}>
          <div className={styles.valueItem}>
            <h3>Respeito</h3>
            <p>Valorizamos a neurodiversidade e respeitamos as características individuais de cada pessoa.</p>
          </div>
          <div className={styles.valueItem}>
            <h3>Inclusão</h3>
            <p>Trabalhamos para promover uma sociedade inclusiva, onde todos possam participar plenamente.</p>
          </div>
          <div className={styles.valueItem}>
            <h3>Informação</h3>
            <p>Compartilhamos conhecimento baseado em evidências científicas e experiências reais.</p>
          </div>
          <div className={styles.valueItem}>
            <h3>Comunidade</h3>
            <p>Acreditamos no poder da conexão e do apoio mútuo entre famílias e profissionais.</p>
          </div>
        </div>
      </section>

      <section className={styles.team}>
        <h2>Nossa Equipe</h2>
        <div className={styles.teamMembers}>
          <div className={styles.teamMember}>
            <div className={styles.memberPhoto}></div>
            <h3>Dra. Ana Silva</h3>
            <p>Neuropsicóloga</p>
            <p>Especialista em TEA</p>
          </div>
          <div className={styles.teamMember}>
            <div className={styles.memberPhoto}></div>
            <h3>Dr. Carlos Mendes</h3>
            <p>Neuropediatra</p>
            <p>Pesquisador em Neurodesenvolvimento</p>
          </div>
          <div className={styles.teamMember}>
            <div className={styles.memberPhoto}></div>
            <h3>Patrícia Oliveira</h3>
            <p>Terapeuta Ocupacional</p>
            <p>Especialista em Integração Sensorial</p>
          </div>
        </div>
      </section>

      <section className={styles.contact}>
        <h2>Entre em Contato</h2>
        <p>Estamos à disposição para esclarecer dúvidas e receber sugestões.</p>
        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <h3>Email</h3>
            <p>contato@autismoemfoco.com.br</p>
          </div>
          <div className={styles.contactItem}>
            <h3>Telefone</h3>
            <p>(11) 9999-9999</p>
          </div>
          <div className={styles.contactItem}>
            <h3>Redes Sociais</h3>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>Instagram</a>
              <a href="#" className={styles.socialLink}>Facebook</a>
              <a href="#" className={styles.socialLink}>YouTube</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Sobre