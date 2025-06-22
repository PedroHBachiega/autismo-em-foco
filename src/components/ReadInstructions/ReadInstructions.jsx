import React, { useRef } from 'react';
import ReadAloudButton from '../ReadAloudButton/ReadAloudButton';
import styles from './ReadInstructions.module.css';

const ReadInstructions = ({ contentSelector, title = "esta página" }) => {
  const contentRef = useRef(null);
  
  const getTextFromElement = (element) => {
    if (!element) return "";
    
    const clone = element.cloneNode(true);
    const elementsToRemove = clone.querySelectorAll('button, input, textarea, select');
    elementsToRemove.forEach(el => el.remove());
    
    return clone.textContent || clone.innerText || "";
  };
  
  const handleReadContent = () => {
    let targetElement;
    
    if (contentSelector) {
      targetElement = document.querySelector(contentSelector);
    }
    
    if (!targetElement) {
      targetElement = document.querySelector('main') || document.body;
    }
    
    if (!targetElement) {
      return "Não foi possível encontrar o conteúdo para leitura. Por favor, tente novamente.";
    }
    
    const text = getTextFromElement(targetElement);
    return text || "Não foi possível extrair o texto do conteúdo.";
  };
  
  return (
    <div className={styles.readInstructionsContainer} ref={contentRef}>
      <ReadAloudButton 
        getTextFunction={handleReadContent} 
        label={`Ler ${title}`}
      />
    </div>
  );
};

export default ReadInstructions;