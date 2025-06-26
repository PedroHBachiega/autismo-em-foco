import React from 'react'
import styles from './Tratamentos.module.css'
import abaImage from '../../assets/aba.jpg'
import fonoaudiologiaImage from '../../assets/fonoaudiologia.jpg'
import mulherAutistaImage from '../../assets/mulher-autista.jpg'
import psicoterapiaImage from '../../assets/psicoterapia.jpg'

const Tratamentos = () => {
  return (
    <div className={styles.tratamentosContainer}>
      <section className={styles.header}>
        <h1>Tratamentos e Terapias</h1>
        <p style={{ color: 'var(--text)'}}>Conheça as principais abordagens terapêuticas para o TEA</p>
      </section>

      <section className={styles.intro}>
        <p style={{ color: 'var(--text)'}}>O tratamento para o Transtorno do Espectro Autista (TEA) é multidisciplinar e deve ser personalizado para atender às necessidades específicas de cada pessoa. Quanto mais cedo for iniciado, melhores são os resultados.</p>
        <p style={{ color: 'var(--text)'}}>Abaixo, apresentamos algumas das principais abordagens terapêuticas utilizadas no tratamento do TEA:</p>
      </section>

      <section className={styles.therapies}>
        <div className={styles.therapyCard}>
          <h2>ABA (Análise do Comportamento Aplicada)</h2>
          <div className={styles.therapyContent}>
            <div className={styles.therapyImage}>
              <img src={abaImage} alt="Método ABA" className={styles.imagemTerapias}/>
            </div>
            <div className={styles.therapyInfo}>
              <p style={{ color: 'var(--text)'}}>A ABA é uma abordagem baseada em evidências científicas que utiliza técnicas de modificação do comportamento para desenvolver habilidades importantes e reduzir comportamentos inadequados.</p>
              <h3>Benefícios:</h3>
              <ul>
                <li style={{ color: 'var(--text)'}}>Desenvolvimento de habilidades de comunicação</li>
                <li style={{ color: 'var(--text)'}}>Melhora nas interações sociais</li>
                <li style={{ color: 'var(--text)'}}>Redução de comportamentos desafiadores</li>
                <li style={{ color: 'var(--text)'}}>Aumento da independência</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.therapyCard}>
          <h2>Fonoaudiologia</h2>
          <div className={styles.therapyContent}>
            <div className={styles.therapyImage}>
              <img src={fonoaudiologiaImage} alt="Fonoaudióloga" className={styles.imagemTerapias} />
            </div>
            <div className={styles.therapyInfo}>
              <p style={{ color: 'var(--text)'}}>A terapia fonoaudiológica trabalha o desenvolvimento da comunicação, linguagem e habilidades sociais, fundamentais para pessoas com TEA.</p>
              <h3>Benefícios:</h3>
              <ul>
                <li style={{ color: 'var(--text)'}}>Desenvolvimento da linguagem verbal e não-verbal</li>
                <li style={{ color: 'var(--text)'}}>Melhora na articulação e fluência</li>
                <li style={{ color: 'var(--text)'}}>Desenvolvimento de habilidades pragmáticas</li>
                <li style={{ color: 'var(--text)'}}>Suporte para comunicação alternativa quando necessário</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.therapyCard}>
          <h2>Terapia Ocupacional</h2>
          <div className={styles.therapyContent}>
            <div className={styles.therapyImage}>
              <img src={mulherAutistaImage} alt="Mulher autista" className={styles.imagemTerapias}/>
            </div>
            <div className={styles.therapyInfo}>
              <p style={{ color: 'var(--text)'}}>A Terapia Ocupacional auxilia no desenvolvimento de habilidades para a vida diária e na regulação sensorial, frequentemente alterada em pessoas com TEA.</p>
              <h3>Benefícios:</h3>
              <ul>
                <li style={{ color: 'var(--text)'}}>Melhora na integração sensorial</li>
                <li style={{ color: 'var(--text)'}}>Desenvolvimento de habilidades motoras</li>
                <li style={{ color: 'var(--text)'}}>Maior independência nas atividades diárias</li>
                <li style={{ color: 'var(--text)'}}>Adaptação de ambientes para melhor funcionalidade</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.therapyCard}>
          <h2>Psicoterapia</h2>
          <div className={styles.therapyContent}>
            <div className={styles.therapyImage}>
              <img src={psicoterapiaImage} alt="Psicóloga" className={styles.imagemTerapias}/>
            </div>
            <div className={styles.therapyInfo}>
              <p style={{ color: 'var(--text)'}}>A psicoterapia, especialmente a Terapia Cognitivo-Comportamental adaptada, pode ajudar pessoas com TEA a lidar com ansiedade, depressão e desenvolver habilidades sociais.</p>
              <h3>Benefícios:</h3>
              <ul>
                <li style={{ color: 'var(--text)'}}>Manejo da ansiedade e estresse</li>
                <li style={{ color: 'var(--text)'}}>Desenvolvimento de habilidades sociais</li>
                <li style={{ color: 'var(--text)'}}>Compreensão de emoções próprias e alheias</li>
                <li style={{ color: 'var(--text)'}}>Estratégias para lidar com mudanças e transições</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.findProfessional}>
        <h2>Encontre Profissionais Especializados</h2>
        <p style={{ color: 'var(--text)'}}>Estamos desenvolvendo um diretório de profissionais especializados em TEA. Em breve, você poderá buscar especialistas em sua região.</p>
        <button className={styles.primaryButton}>Cadastre-se para ser notificado</button>
      </section>
    </div>
  )
}

export default Tratamentos