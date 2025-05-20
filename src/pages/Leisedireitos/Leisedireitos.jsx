import React from 'react'
import styles from './Leisedireitos.module.css'

const Leisedireitos = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Leis e Direitos</h1>
        <p>Conheça as principais leis e direitos das pessoas com Transtorno do Espectro Autista (TEA) no Brasil</p>
      </header>

      <section className={styles.mainLaw}>
        <h2>Lei Berenice Piana (Lei nº 12.764/2012)</h2>
        <p>A Lei Berenice Piana, instituída em 2012, é um marco na garantia dos direitos das pessoas com Transtorno do Espectro Autista (TEA) no Brasil. Esta lei reconhece o autismo como deficiência para todos os efeitos legais, garantindo às pessoas com TEA os mesmos direitos e proteções assegurados às pessoas com deficiência.</p>
        <p>Entre os principais pontos da lei estão o direito à educação inclusiva, atendimento especializado no Sistema Único de Saúde (SUS), e proteção contra discriminação.</p>
      </section>

      <section className={styles.lawsSection}>
        <h2>Principais Leis</h2>
        <div className={styles.lawsGrid}>
          <div className={styles.lawCard}>
            <h3>Lei nº 13.977/2020 (Lei Romeo Mion)</h3>
            <p>Cria a Carteira de Identificação da Pessoa com Transtorno do Espectro Autista (CIPTEA), que garante atenção integral, prioridade no atendimento e no acesso aos serviços públicos e privados.</p>
            <a href="http://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/L13977.htm" target="_blank" rel="noopener noreferrer">Ver lei completa</a>
          </div>
          
          <div className={styles.lawCard}>
            <h3>Lei nº 13.146/2015 (Lei Brasileira de Inclusão)</h3>
            <p>Também conhecida como Estatuto da Pessoa com Deficiência, esta lei reforça e amplia os direitos das pessoas com deficiência, incluindo as pessoas com TEA.</p>
            <a href="http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm" target="_blank" rel="noopener noreferrer">Ver lei completa</a>
          </div>
          
          <div className={styles.lawCard}>
            <h3>Lei nº 8.742/1993 (LOAS)</h3>
            <p>Lei Orgânica da Assistência Social, que prevê o Benefício de Prestação Continuada (BPC) para pessoas com deficiência, incluindo pessoas com TEA, que comprovem não possuir meios de prover a própria manutenção.</p>
            <a href="http://www.planalto.gov.br/ccivil_03/leis/l8742.htm" target="_blank" rel="noopener noreferrer">Ver lei completa</a>
          </div>
          
          <div className={styles.lawCard}>
            <h3>Lei nº 9.394/1996 (LDB)</h3>
            <p>Lei de Diretrizes e Bases da Educação Nacional, que garante atendimento educacional especializado gratuito aos educandos com deficiência, preferencialmente na rede regular de ensino.</p>
            <a href="http://www.planalto.gov.br/ccivil_03/leis/l9394.htm" target="_blank" rel="noopener noreferrer">Ver lei completa</a>
          </div>
        </div>
      </section>

      <section className={styles.rightsSection}>
        <h2>Direitos Garantidos</h2>
        <div className={styles.rightsList}>
          <div className={styles.rightItem}>
            <h3>Educação Inclusiva</h3>
            <p>Direito à educação em escolas regulares com apoio especializado quando necessário. As escolas não podem recusar a matrícula de alunos com TEA, e devem oferecer adaptações necessárias para garantir o aprendizado.</p>
          </div>
          
          <div className={styles.rightItem}>
            <h3>Saúde</h3>
            <p>Acesso a diagnóstico precoce, atendimento multiprofissional e terapias especializadas pelo Sistema Único de Saúde (SUS). Os planos de saúde são obrigados a cobrir tratamentos e terapias para pessoas com TEA.</p>
          </div>
          
          <div className={styles.rightItem}>
            <h3>Benefícios Sociais</h3>
            <p>Pessoas com TEA têm direito ao Benefício de Prestação Continuada (BPC) quando comprovada a impossibilidade de prover o próprio sustento. Também há isenção de impostos na compra de veículos adaptados e outros benefícios fiscais.</p>
          </div>
          
          <div className={styles.rightItem}>
            <h3>Mercado de Trabalho</h3>
            <p>Empresas com 100 ou mais funcionários devem reservar de 2% a 5% de suas vagas para pessoas com deficiência, incluindo pessoas com TEA. Há também programas de incentivo à contratação e apoio à inclusão no ambiente de trabalho.</p>
          </div>
          
          <div className={styles.rightItem}>
            <h3>Atendimento Prioritário</h3>
            <p>Pessoas com TEA têm direito a atendimento prioritário em serviços públicos e privados, como bancos, supermercados e órgãos públicos.</p>
          </div>
        </div>
      </section>

      <section className={styles.helpSection}>
        <h2>Precisa de ajuda para garantir seus direitos?</h2>
        <p>Se você está enfrentando dificuldades para acessar algum direito garantido por lei, entre em contato com a Defensoria Pública, o Ministério Público ou organizações de apoio às pessoas com TEA.</p>
        <a href="#" className={styles.contactButton}>Fale Conosco</a>
      </section>
    </div>
  )
}

export default Leisedireitos