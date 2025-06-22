import React, { useState } from 'react';
import styles from './ReadAloudButton.module.css';

const ReadAloudButton = ({ text, getTextFunction, label = "Ler conteúdo" }) => {
  const [isReading, setIsReading] = useState(false);
  
  const speak = () => {
    // Verifica se a API está disponível no navegador
    if (!('speechSynthesis' in window)) {
      alert("Seu navegador não suporta a funcionalidade de leitura de texto.");
      return;
    }
    
    // Se já estiver lendo, para a leitura
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }
    
    // Obtém o texto no momento do clique, se a função estiver disponível
    const contentText = getTextFunction ? getTextFunction() : text;
    
    if (!contentText || contentText.trim() === "") {
      alert("Não foi possível encontrar conteúdo para ler.");
      return;
    }
    
    // Configura a leitura
    const utterance = new SpeechSynthesisUtterance(contentText);
    utterance.lang = 'pt-BR'; // Define o idioma como português do Brasil
    utterance.rate = 1.0; // Velocidade normal
    utterance.pitch = 1.0; // Tom normal
    
    // Evento para quando a leitura terminar
    utterance.onend = () => {
      setIsReading(false);
    };
    
    // Inicia a leitura
    setIsReading(true);
    window.speechSynthesis.speak(utterance);
  };
  
  return (
    <button 
      className={`${styles.readAloudButton} ${isReading ? styles.reading : ''}`}
      onClick={speak}
      aria-label={isReading ? "Parar leitura" : label}
      title={isReading ? "Parar leitura" : label}
    >
      {isReading ? "🔊 Parar" : "🔊 Ler"}
    </button>
  );
};

export default ReadAloudButton;