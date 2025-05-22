import React from 'react'
import styles from './Tratamentos.module.css'

const Tratamentos = () => {
  return (
    <div className={styles.tratamentosContainer}>
      <section className={styles.header}>
        <h1>Tratamentos e Terapias</h1>
        <p>Conheça as principais abordagens terapêuticas para o TEA</p>
      </section>

      <section className={styles.intro}>
        <p>O tratamento para o Transtorno do Espectro Autista (TEA) é multidisciplinar e deve ser personalizado para atender às necessidades específicas de cada pessoa. Quanto mais cedo for iniciado, melhores são os resultados.</p>
        <p>Abaixo, apresentamos algumas das principais abordagens terapêuticas utilizadas no tratamento do TEA:</p>
      </section>

      <section className={styles.therapies}>
        <div className={styles.therapyCard}>
          <h2>ABA (Análise do Comportamento Aplicada)</h2>
          <div className={styles.therapyContent}>
            <div className={styles.therapyImage}>
              <img src="/src/assets/aba.jpg" alt="Método ABA" className={styles.imagemTerapias}/>
            </div>
            <div className={styles.therapyInfo}>
              <p>A ABA é uma abordagem baseada em evidências científicas que utiliza técnicas de modificação do comportamento para desenvolver habilidades importantes e reduzir comportamentos inadequados.</p>
              <h3>Benefícios:</h3>
              <ul>
                <li>Desenvolvimento de habilidades de comunicação</li>
                <li>Melhora nas interações sociais</li>
                <li>Redução de comportamentos desafiadores</li>
                <li>Aumento da independência</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.therapyCard}>
          <h2>Fonoaudiologia</h2>
          <div className={styles.therapyContent}>
            <div className={styles.therapyImage}>
              <img src="/src/assets/fonoaudiologia.jpg" alt="Fonoaudióloga" className={styles.imagemTerapias} />
            </div>
            <div className={styles.therapyInfo}>
              <p>A terapia fonoaudiológica trabalha o desenvolvimento da comunicação, linguagem e habilidades sociais, fundamentais para pessoas com TEA.</p>
              <h3>Benefícios:</h3>
              <ul>
                <li>Desenvolvimento da linguagem verbal e não-verbal</li>
                <li>Melhora na articulação e fluência</li>
                <li>Desenvolvimento de habilidades pragmáticas</li>
                <li>Suporte para comunicação alternativa quando necessário</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.therapyCard}>
          <h2>Terapia Ocupacional</h2>
          <div className={styles.therapyContent}>
            <div className={styles.therapyImage}>
              <img src="/src/assets/mulher-autista.jpg" alt="Mulher autista" className={styles.imagemTerapias}/>
            </div>
            <div className={styles.therapyInfo}>
              <p>A Terapia Ocupacional auxilia no desenvolvimento de habilidades para a vida diária e na regulação sensorial, frequentemente alterada em pessoas com TEA.</p>
              <h3>Benefícios:</h3>
              <ul>
                <li>Melhora na integração sensorial</li>
                <li>Desenvolvimento de habilidades motoras</li>
                <li>Maior independência nas atividades diárias</li>
                <li>Adaptação de ambientes para melhor funcionalidade</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.therapyCard}>
          <h2>Psicoterapia</h2>
          <div className={styles.therapyContent}>
            <div className={styles.therapyImage}>
              <img src="/src/assets/psicoterapia.jpg" alt="Psicóloga" className={styles.imagemTerapias}/>
            </div>
            <div className={styles.therapyInfo}>
              <p>A psicoterapia, especialmente a Terapia Cognitivo-Comportamental adaptada, pode ajudar pessoas com TEA a lidar com ansiedade, depressão e desenvolver habilidades sociais.</p>
              <h3>Benefícios:</h3>
              <ul>
                <li>Manejo da ansiedade e estresse</li>
                <li>Desenvolvimento de habilidades sociais</li>
                <li>Compreensão de emoções próprias e alheias</li>
                <li>Estratégias para lidar com mudanças e transições</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.findProfessional}>
        <h2>Encontre Profissionais Especializados</h2>
        <p>Estamos desenvolvendo um diretório de profissionais especializados em TEA. Em breve, você poderá buscar especialistas em sua região.</p>
        <button className={styles.primaryButton}>Cadastre-se para ser notificado</button>
      </section>
    </div>
  )
}

export default Tratamentos