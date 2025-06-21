import React from 'react'
import styles from './HeaderInfoTEA.module.css'

const HeaderInfoTEA = () => {
  return (
    <div className={styles.headerContainer}>
      <h1>O que é o Autismo?</h1>
      <p>Entendendo o Transtorno do Espectro Autista (TEA)</p>
      <div className={styles.introText}>
        <p>
          O Transtorno do Espectro Autista (TEA) é uma condição de neurodesenvolvimento que afeta a comunicação, 
          interação social e pode incluir padrões repetitivos de comportamento, interesses ou atividades.
        </p>
        <p>
          O autismo é considerado um espectro porque se manifesta de maneiras muito diferentes em cada pessoa, 
          variando em grau de intensidade e combinação de sintomas.
        </p>
      </div>
    </div>
  )
}

export default HeaderInfoTEA