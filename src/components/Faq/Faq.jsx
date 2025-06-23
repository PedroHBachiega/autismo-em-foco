import React, { useState } from 'react';
import styles from './Faq.module.css';
import { FaChevronDown } from 'react-icons/fa';

/*Perguntas Frequentes*/

const faqData = [
    {
        pergunta: "O que é o Transtorno do Espectro Autista (TEA) ?",
        resposta: "É uma condição do neurodesenvolvimento que afeta a comunicação, o comportamento e as habilidades sociais."
    },
    {
        pergunta: "Como posso ajudar alguém com TEA?",
        resposta: "Oferecemos apoio emocional, respeitando os limites da pessoa e buscando informações em fontes confiáveis."
    },
    {
        pergunta: "O TEA tem cura?",
        resposta: "O TEA não tem cura, mas intervenções precoces podem melhorar significativamente a qualidade de vida."
    },
    {
        pergunta: "Quais são os sinais comuns do autismo?",
        resposta: "Dificuldade na comunicação, comportamentos repetitivos, resistência a mudanças e interesse intenso por ddeterminados assuntos são sinais comuns."
    },
    {
        pergunta: "Existe apenas um tipo de autismo?",
        resposta: "Não. O TEA é um espectro, o que significa que existem diferentes níveis de suporte e manifestações que variam de pessoa para pessoa."
    },
    {
        pergunta: "O autismo é uma doença?",
        resposta: "Não. O autismo é uma condição do neurodesenvolvimento, não sendo considerado uma doença e, portanto, não tem cura, mas pode ser acompanhado com intervenções adequadas."
    },
    {
        pergunta: "Qual a importância do diagnóstico precoce?",
        resposta: "O diagnóstico precoce permite iniciar intervenções o quanto antes, o que pode ajudar no desenvolvimento da comunicação, comportamento e autonomia."
    },
    {
        pergunta: "Quais profissionais podem ajudar no tratamento do TEA?",
        resposta: "Psicólogos, fonoaudiólogos, terapeutas ocupacionais, neuropediatras, psiquiatras e educadores especializados são profissionais fundamentais."
    }
];

const Faq = () => {
    const [aberta, setAberta] = useState(null);

    const toggleResposta = (index) => {
        setAberta(aberta === index ? null : index);
    };

    return (
        <div className={styles.faqContainer}>
            <h2 className={styles.faqTitulo}>Perguntas Frequentes</h2>
            {faqData.map((item, index) => (
                <div key={index} className={styles.faqItem}>
                    <button style={{ color: 'var(--text)'}} className={styles.faqPergunta} onClick={() => toggleResposta(index)}>

                        {item.pergunta}
                        <span className={`${styles.faqIcon} ${aberta === index ? styles.aberta : ''}`}>
                            <FaChevronDown />
                        </span>
                    </button>
                    <div style={{ color: 'var(--text)'}} className={`${styles.faqResposta} ${aberta === index ? styles.mostrar : ''}`}>
                        {item.resposta}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Faq;