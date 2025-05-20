import React, { useState } from 'react'
import styles from './Agendamento.module.css'

const Agendamento = () => {
  const [especialidade, setEspecialidade] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Dados simulados de profissionais
  const profissionais = [
    {
      id: 1,
      nome: "Dra. Ana Silva",
      especialidade: "Neuropsicóloga",
      endereco: "Av. Paulista, 1000 - Bela Vista",
      cidade: "São Paulo",
      telefone: "(11) 3456-7890",
      avaliacao: 4.9,
      imagem: "https://placehold.co/600x400/2361ad/FFF?text=Profissional"
    },
    {
      id: 2,
      nome: "Dr. Carlos Mendes",
      especialidade: "Neuropediatra",
      endereco: "Rua Augusta, 500 - Consolação",
      cidade: "São Paulo",
      telefone: "(11) 2345-6789",
      avaliacao: 4.8,
      imagem: "https://placehold.co/600x400/2361ad/FFF?text=Profissional"
    },
    {
      id: 3,
      nome: "Centro Especializado TEA",
      especialidade: "Clínica Multidisciplinar",
      endereco: "Rua Oscar Freire, 200 - Jardins",
      cidade: "São Paulo",
      telefone: "(11) 3333-4444",
      avaliacao: 4.7,
      imagem: "https://placehold.co/600x400/2361ad/FFF?text=Clínica"
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setShowResults(true);
    // Aqui seria implementada a lógica de busca real
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Agendamento de Consultas</h1>
        <p>Encontre profissionais e clínicas especializadas em TEA na sua região</p>
      </header>

      <section className={styles.searchSection}>
        <h2>Buscar Profissionais</h2>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.formGroup}>
            <label htmlFor="especialidade">Especialidade</label>
            <select 
              id="especialidade" 
              value={especialidade} 
              onChange={(e) => setEspecialidade(e.target.value)}
            >
              <option value="">Selecione uma especialidade</option>
              <option value="neuropediatra">Neuropediatra</option>
              <option value="neuropsicólogo">Neuropsicólogo</option>
              <option value="fonoaudiólogo">Fonoaudiólogo</option>
              <option value="terapeuta-ocupacional">Terapeuta Ocupacional</option>
              <option value="psicólogo">Psicólogo</option>
              <option value="clinica">Clínica Especializada</option>
            </select>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="cidade">Cidade</label>
              <input 
                type="text" 
                id="cidade" 
                placeholder="Digite sua cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="bairro">Bairro (opcional)</label>
              <input 
                type="text" 
                id="bairro" 
                placeholder="Digite seu bairro"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
            </div>
          </div>
          
          <button type="submit" className={styles.searchButton}>Buscar</button>
        </form>
      </section>

      {showResults && (
        <section className={styles.resultsSection}>
          <h2>Resultados da Busca</h2>
          <div className={styles.resultsGrid}>
            {profissionais.map(profissional => (
              <div key={profissional.id} className={styles.resultCard}>
                <div className={styles.resultImage}>
                  <img src={profissional.imagem} alt={profissional.nome} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
                <div className={styles.resultContent}>
                  <h3>{profissional.nome}</h3>
                  <span className={styles.resultType}>{profissional.especialidade}</span>
                  <div className={styles.resultInfo}>
                    <p><span>📍</span> <span>{profissional.endereco}</span></p>
                    <p><span>🏙️</span> <span>{profissional.cidade}</span></p>
                    <p><span>📞</span> <span>{profissional.telefone}</span></p>
                    <p><span>⭐</span> <span>{profissional.avaliacao} (avaliação)</span></p>
                  </div>
                  <button className={styles.scheduleButton}>Agendar Consulta</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.registerSection}>
        <h2>É um profissional ou clínica especializada em TEA?</h2>
        <p>Cadastre-se em nossa plataforma para aumentar sua visibilidade e ajudar mais pessoas a encontrarem seus serviços.</p>
        <a href="#" className={styles.registerButton}>Cadastrar Serviço</a>
      </section>
    </div>
  )
}

export default Agendamento