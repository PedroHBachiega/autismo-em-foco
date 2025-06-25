import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
import { useInsertDocument } from '../../Hooks/useInsertDocument';
import { Timestamp } from 'firebase/firestore';
import styles from './CadastroEvento.module.css';
import LoadingButton from '../../components/LoadingButton';

const CadastroEvento = () => {
  const { userProfile } = useAuthValue();
  const navigate = useNavigate();
  const { insertDocument, response } = useInsertDocument('eventos');
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    dataEvento: '',
    horarioInicio: '',
    horarioFim: '',
    local: '',
    categoria: 'Workshop',
    imagem: '',
    vagas: '',
    preco: '',
    organizador: '',
    contato: '',
    observacoes: ''
  });

  // Verificar se o usuário tem permissão (admin ou profissional)
  React.useEffect(() => {
    if (userProfile && !['admin', 'profissional'].includes(userProfile.userType)) {
      navigate('/');
    }
  }, [userProfile, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.titulo || !formData.descricao || !formData.dataEvento) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    try {
      // Converter data e horário para Timestamp
      const dataHora = new Date(`${formData.dataEvento}T${formData.horarioInicio || '00:00'}`);
      
      const eventoData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        dataEvento: Timestamp.fromDate(dataHora),
        horario: formData.horarioInicio && formData.horarioFim 
          ? `${formData.horarioInicio} - ${formData.horarioFim}`
          : formData.horarioInicio || 'Horário não definido',
        local: formData.local || 'Local não definido',
        categoria: formData.categoria,
        imagem: formData.imagem || '',
        vagas: formData.vagas ? parseInt(formData.vagas) : null,
        preco: formData.preco || 'Gratuito',
        organizador: formData.organizador || userProfile?.displayName || 'Não informado',
        contato: formData.contato || userProfile?.email || '',
        observacoes: formData.observacoes || '',
        criadoPor: userProfile?.uid || '',
        status: 'ativo'
      };

      await insertDocument(eventoData);
      
      if (!response.error) {
        alert('Evento cadastrado com sucesso!');
        navigate('/eventos');
      }
    } catch (error) {
      console.error('Erro ao cadastrar evento:', error);
      alert('Erro ao cadastrar evento. Tente novamente.');
    }
  };

  const categorias = [
    'Workshop',
    'Palestra',
    'Encontro',
    'Curso',
    'Feira',
    'Grupo de Apoio',
    'Seminário',
    'Conferência',
    'Webinar',
    'Outro'
  ];

  return (
    <div className={styles.cadastroContainer}>
      <header className={styles.header}>
        <h1>Cadastrar Novo Evento</h1>
        <p>Preencha as informações do evento relacionado ao TEA</p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Informações Básicas */}
          <div className={styles.section}>
            <h2>Informações Básicas</h2>
            
            <div className={styles.inputGroup}>
              <label htmlFor="titulo">Título do Evento *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                required
                aria-required="true"
                aria-invalid={!formData.titulo && formData.titulo !== undefined ? "true" : "false"}
                aria-describedby="titulo-error"
                placeholder="Ex: Workshop sobre Comunicação Alternativa"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="descricao">Descrição *</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                required
                aria-required="true"
                aria-invalid={!formData.descricao && formData.descricao !== undefined ? "true" : "false"}
                aria-describedby="descricao-error"
                rows="4"
                placeholder="Descreva o evento, objetivos e público-alvo..."
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="categoria">Categoria *</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                required
                aria-required="true"
                aria-invalid={!formData.categoria ? "true" : "false"}
                aria-describedby="categoria-error"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Data e Horário */}
          <div className={styles.section}>
            <h2>Data e Horário</h2>
            
            <div className={styles.inputGroup}>
              <label htmlFor="dataEvento">Data do Evento *</label>
              <input
                type="date"
                id="dataEvento"
                name="dataEvento"
                value={formData.dataEvento}
                onChange={handleInputChange}
                required
                aria-required="true"
                aria-invalid={!formData.dataEvento && formData.dataEvento !== undefined ? "true" : "false"}
                aria-describedby="dataEvento-error"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="horarioInicio">Horário de Início</label>
                <input
                  type="time"
                  id="horarioInicio"
                  name="horarioInicio"
                  value={formData.horarioInicio}
                  onChange={handleInputChange}
                  aria-describedby="horarioInicio-desc"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="horarioFim">Horário de Término</label>
                <input
                  type="time"
                  id="horarioFim"
                  name="horarioFim"
                  value={formData.horarioFim}
                  onChange={handleInputChange}
                  aria-describedby="horarioFim-desc"
                />
              </div>
            </div>
          </div>

          {/* Local e Logística */}
          <div className={styles.section}>
            <h2>Local e Logística</h2>
            
            <div className={styles.inputGroup}>
              <label htmlFor="local">Local do Evento</label>
              <input
                type="text"
                id="local"
                name="local"
                value={formData.local}
                onChange={handleInputChange}
                placeholder="Ex: Centro Cultural São Paulo, Online (Zoom), etc."
              />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="vagas">Número de Vagas</label>
                <input
                  type="number"
                  id="vagas"
                  name="vagas"
                  value={formData.vagas}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="Ex: 50"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="preco">Preço</label>
                <input
                  type="text"
                  id="preco"
                  name="preco"
                  value={formData.preco}
                  onChange={handleInputChange}
                  placeholder="Ex: Gratuito, R$ 50,00, etc."
                />
              </div>
            </div>
          </div>

          {/* Contato e Organização */}
          <div className={styles.section}>
            <h2>Contato e Organização</h2>
            
            <div className={styles.inputGroup}>
              <label htmlFor="organizador">Organizador</label>
              <input
                type="text"
                id="organizador"
                name="organizador"
                value={formData.organizador}
                onChange={handleInputChange}
                placeholder="Nome da pessoa ou instituição organizadora"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="contato">Contato para Inscrições</label>
              <input
                type="text"
                id="contato"
                name="contato"
                value={formData.contato}
                onChange={handleInputChange}
                placeholder="Email, telefone ou link para inscrições"
              />
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className={styles.section}>
            <h2>Informações Adicionais</h2>
            
            <div className={styles.inputGroup}>
              <label htmlFor="imagem">URL da Imagem</label>
              <input
                type="url"
                id="imagem"
                name="imagem"
                value={formData.imagem}
                onChange={handleInputChange}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="observacoes">Observações</label>
              <textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Informações adicionais, requisitos, materiais necessários, etc."
              />
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button 
            type="button" 
            onClick={() => navigate('/eventos')}
            className={styles.cancelBtn}
            aria-label="Cancelar cadastro e voltar para a lista de eventos"
          >
            Cancelar
          </button>
          <LoadingButton 
            type="submit" 
            className={styles.submitBtn}
            loading={response.loading}
            loadingText="Cadastrando..."
            ariaLabel="Cadastrar novo evento"
          >
            Cadastrar Evento
          </LoadingButton>
        </div>

        {response.error && (
          <div className={styles.error} role="alert" aria-live="assertive" id="form-error">
            Erro: {response.error}
          </div>
        )}
      </form>
    </div>
  );
};

export default CadastroEvento;
