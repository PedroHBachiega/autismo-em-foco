import React from 'react'
import styles from './SobreAutismo.module.css'
import HeaderInfoTEA from '../../components/HeaderInfoTEA/HeaderInfoTEA'

const SobreAutismo = () => {
  return (
    <div className={styles.container}>
      <HeaderInfoTEA />

      <section className={styles.characteristicsSection}>
        <h2>Principais Características</h2>
        <div className={styles.characteristicsGrid}>
          <div className={styles.characteristicCard}>
            <div className={styles.characteristicIcon}>🗣️</div>
            <h3 style={{ color: 'var(--text)'}}>Comunicação</h3>
            <p style={{ color: 'var(--text)'}}>Dificuldades na comunicação verbal e não-verbal, que podem variar desde atraso na fala até dificuldades em manter conversas ou entender expressões faciais.</p>
          </div>
          <div className={styles.characteristicCard}>
            <div className={styles.characteristicIcon}>👥</div>
            <h3 style={{ color: 'var(--text)'}}>Interação Social</h3>
            <p style={{ color: 'var(--text)'}}>Desafios em desenvolver e manter relacionamentos, compreender regras sociais implícitas e demonstrar empatia da maneira convencional.</p>
          </div>
          <div className={styles.characteristicCard}>
            <div className={styles.characteristicIcon}>🔄</div>
            <h3 style={{ color: 'var(--text)'}}>Comportamentos Repetitivos</h3>
            <p style={{ color: 'var(--text)'}}>Movimentos repetitivos, rotinas rígidas, interesses intensos e específicos, e sensibilidade sensorial aumentada ou diminuída.</p>
          </div>
        </div>
      </section>

      <section className={styles.diagnosisSection}>
        <h2>Diagnóstico</h2>
        <p style={{ color: 'var(--text)'}}>O diagnóstico do TEA é clínico, realizado por profissionais especializados como neurologistas, psiquiatras e neuropsicólogos. Geralmente envolve observação comportamental, entrevistas com familiares e aplicação de instrumentos específicos de avaliação.</p>
        <p style={{ color: 'var(--text)'}}>Os sinais podem aparecer nos primeiros anos de vida, mas em alguns casos, especialmente quando os sintomas são mais sutis, o diagnóstico pode ocorrer mais tarde.</p>
        <div className={styles.warningBox}>
          <h3>Sinais de Alerta</h3>
          <ul>
            <li>Pouco ou nenhum contato visual</li>
            <li>Não responder ao nome por volta dos 12 meses</li>
            <li>Atraso no desenvolvimento da fala</li>
            <li>Movimentos repetitivos com as mãos, corpo ou objetos</li>
            <li>Dificuldade com mudanças na rotina</li>
            <li>Interesses intensos e restritos</li>
            <li>Reações incomuns a estímulos sensoriais</li>
          </ul>
        </div>
      </section>

      <section className={styles.mythsSection}>
        <h2>Mitos e Verdades</h2>
        <div className={styles.mythsGrid}>
          <div className={styles.mythCard}>
            <h3 className={styles.mythTitle}>Mito: Pessoas com autismo não demonstram afeto</h3>
            <p style={{ color: 'var(--text)'}}>Verdade: Pessoas com TEA sentem e demonstram afeto, mas podem fazê-lo de maneiras diferentes das convencionais.</p>
          </div>
          <div className={styles.mythCard}>
            <h3 className={styles.mythTitle}>Mito: Autismo é uma doença</h3>
            <p style={{ color: 'var(--text)'}}>Verdade: O autismo não é uma doença, mas uma condição de neurodesenvolvimento que faz parte da identidade da pessoa.</p>
          </div>
          <div className={styles.mythCard}>
            <h3 className={styles.mythTitle}>Mito: Todas as pessoas com autismo têm habilidades extraordinárias</h3>
            <p style={{ color: 'var(--text)'}}>Verdade: Algumas pessoas com TEA podem ter habilidades específicas notáveis, mas isso não ocorre em todos os casos.</p>
          </div>
          <div className={styles.mythCard}>
            <h3 className={styles.mythTitle}>Mito: O autismo tem cura</h3>
            <p style={{ color: 'var(--text)'}}>Verdade: O autismo não tem cura, mas intervenções adequadas podem melhorar significativamente a qualidade de vida.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SobreAutismo