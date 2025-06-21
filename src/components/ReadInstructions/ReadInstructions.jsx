import React, { useRef } from 'react';
import ReadAloudButton from '../ReadAloudButton/ReadAloudButton';
import styles from './ReadInstructions.module.css';

const ReadInstructions = () => {
  const contentRef = useRef(null);
  
  const getTextFromElement = (element) => {
    if (!element) return "";
    
    const clone = element.cloneNode(true);
    const elementsToRemove = clone.querySelectorAll('button, input, textarea, select');
    elementsToRemove.forEach(el => el.remove());
    
    return clone.textContent || clone.innerText || "";
  };
  
  const handleReadContent = () => {
    const mainContent = document.querySelector('main') || document.body;
    
    if (!mainContent) {
      return "Não foi possível encontrar o conteúdo para leitura. Por favor, tente novamente.";
    }
    
    const text = getTextFromElement(mainContent);
    return text || "Não foi possível extrair o texto do conteúdo.";
  };
  
  return (
    <div className={styles.readInstructionsContainer} ref={contentRef}>
      <ReadAloudButton 
        getTextFunction={handleReadContent} 
        label="Ler página" 
      />
    </div>
  );
};

export default ReadInstructions;