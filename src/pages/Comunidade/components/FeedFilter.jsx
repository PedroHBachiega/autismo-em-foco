import React, { useState, useEffect, useRef } from 'react';
import styles from '../Comunidade.module.css';

const FeedFilter = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('recentes');
  const searchTimeout = useRef(null);

  // Função para lidar com a mudança no campo de busca com debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Implementação do debounce
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      onSearch(value);
    }, 300); // 300ms de debounce
  };

  // Limpar o timeout quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  // Função para lidar com a mudança de filtro
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    // Aqui você pode adicionar lógica adicional para filtrar por recentes, populares, etc.
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar por título ou autor..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <span className={styles.searchIcon}>🔍</span>
      </div>
      <div className={styles.feedFilter}>
        <button 
          className={`${styles.filterButton} ${activeFilter === 'recentes' ? styles.active : ''}`}
          onClick={() => handleFilterClick('recentes')}
        >
          Recentes
        </button>
        <button 
          className={`${styles.filterButton} ${activeFilter === 'populares' ? styles.active : ''}`}
          onClick={() => handleFilterClick('populares')}
        >
          Populares
        </button>
        <button 
          className={`${styles.filterButton} ${activeFilter === 'grupos' ? styles.active : ''}`}
          onClick={() => handleFilterClick('grupos')}
        >
          Meus Grupos
        </button>
      </div>
    </div>
  );
};

export default FeedFilter;