import React, { useState, useEffect } from 'react';
import styles from './Agendamento.module.css';
import { useAuthValue } from '../../context/AuthContext';
import { useInsertDocument } from '../../Hooks/useInsertDocument';
import { useFetchDocuments } from '../../Hooks/useFetchDocuments';
import { useGTM } from '../../context/GTMContext';
import { googleMapsApi, useGoogleMapsPlaces } from '../../services/googleMapsApi';
// Remova ou comente a importação da cnesApi
// import { cnesApi } from '../../services/cnesApi';

const Agendamento = () => {
  const [especialidade, setEspecialidade] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [message, setMessage] = useState('');
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profissionais, setProfissionais] = useState([]);
  const [error, setError] = useState(null);
  

  const { user } = useAuthValue();
  const { insertDocument, response } = useInsertDocument('agendamentos');
  const { documents: existingAppointments } = useFetchDocuments('agendamentos');
  const { trackAppointmentScheduled } = useGTM();

  // Adicione o hook para carregar o script do Google Maps
  const { isLoaded, loadError, loadGoogleMapsScript } = useGoogleMapsPlaces();
  
  // Carregue o script do Google Maps quando o componente for montado
  useEffect(() => {
    loadGoogleMapsScript();
  }, [loadGoogleMapsScript]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowResults(false);
    
    try {
      // Usar a nova API do Google Maps Places
      const filters = {
        city: cidade,
        specialty: especialidade
      };
      
      const establishments = await googleMapsApi.getEstablishments(filters);
      
      if (establishments && establishments.length > 0) {
        setProfissionais(establishments);
      } else {
        // Se a API não retornar dados, usar o fallback com dados simulados
        const mockData = googleMapsApi.getMockEstablishments(cidade, especialidade);
        setProfissionais(mockData);
      }
      
      setShowResults(true);
    } catch (err) {
      console.error('Erro ao buscar estabelecimentos:', err);
      setError('Não foi possível buscar os estabelecimentos. Usando dados simulados.');
      
      // Em caso de erro, usar dados simulados como fallback
      const mockData = googleMapsApi.getMockEstablishments(cidade, especialidade);
      setProfissionais(mockData);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleClick = (profissional) => {
    setSelectedProfessional(profissional);
    setShowScheduleForm(true);
    setSelectedDate('');
    setSelectedTime('');
    setAvailableTimes([]);
    setMessage('');
    setScheduleSuccess(false);
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3);
    return futureDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (selectedDate && selectedProfessional) {
      const booked = existingAppointments?.filter(app =>
        app.profissionalId === selectedProfessional.id &&
        app.data === selectedDate
      ).map(app => app.horario) || [];

      const available = selectedProfessional.horarios.filter(h => !booked.includes(h));
      setAvailableTimes(available);
      setMessage(available.length === 0 ? 'Não há horários disponíveis para esta data.' : '');
    }
  }, [selectedDate, selectedProfessional, existingAppointments]);

  const isWeekend = (date) => [0, 6].includes(new Date(date).getDay());

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime('');

    if (isWeekend(date)) {
      setMessage('Não há atendimentos nos finais de semana.');
      setAvailableTimes([]);
    } else {
      setMessage('');
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      setMessage('Por favor, selecione data e horário.');
      return;
    }

    const agendamento = {
      profissionalId: selectedProfessional.id,
      profissionalNome: selectedProfessional.nome,
      especialidade: selectedProfessional.especialidade,
      data: selectedDate,
      horario: selectedTime,
      status: 'agendado',
      uid: user.uid,
      userName: user.displayName || user.email,
      userEmail: user.email,
      createdAt: new Date()
    };

    await insertDocument(agendamento);

    // Rastrear evento de agendamento
    trackAppointmentScheduled(
      selectedProfessional.especialidade,
      selectedProfessional.id
    );

    setScheduleSuccess(true);
    setMessage('Agendamento realizado com sucesso!');
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

          <button 
            type="submit" 
            className={styles.searchButton}
            disabled={loading}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>
      </section>

      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
        </div>
      )}

      {showResults && (
        <section className={styles.resultsSection}>
          <h2>Resultados da Busca</h2>
          {profissionais.length === 0 ? (
            <p className={styles.noResults}>Nenhum resultado encontrado para os critérios de busca.</p>
          ) : (
            <div className={styles.resultsGrid}>
              {profissionais.map(profissional => (
                <div key={profissional.id} className={styles.resultCard}>
                  <div className={styles.resultImage}>
                    <img src={profissional.imagem} alt={profissional.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                    <button
                      className={styles.scheduleButton}
                      onClick={() => handleScheduleClick(profissional)}
                    >
                      Agendar Consulta
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* O restante do componente permanece o mesmo */}
      {showScheduleForm && selectedProfessional && (
        <section className={styles.scheduleFormSection}>
          <h2>Agendar Consulta com {selectedProfessional.nome}</h2>
          <div className={styles.scheduleFormContainer}>
            {scheduleSuccess ? (
              <div className={styles.successMessage}>
                <h3>Agendamento realizado com sucesso!</h3>
                <p>Você agendou uma consulta com {selectedProfessional.nome} para o dia {selectedDate} às {selectedTime}.</p>
                <p>Um PDF com os detalhes do agendamento foi enviado para o seu email: {user.email}</p>
                <p>Você pode visualizar seus agendamentos na página "Meus Agendamentos".</p>
                <button
                  className={styles.primaryButton}
                  onClick={() => setShowScheduleForm(false)}
                >
                  Voltar para a busca
                </button>
              </div>
            ) : (
              <form onSubmit={handleScheduleSubmit} className={styles.scheduleForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="date">Data da Consulta</label>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={getMinDate()}
                    max={getMaxDate()}
                    required
                  />
                </div>

                {selectedDate && !isWeekend(selectedDate) && (
                  <div className={styles.formGroup}>
                    <label htmlFor="time">Horário da Consulta</label>
                    <select
                      id="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      required
                      disabled={availableTimes.length === 0}
                    >
                      <option value="">Selecione um horário</option>
                      {availableTimes.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                )}

                {message && <p className={response.error ? styles.errorMessage : styles.infoMessage}>{message}</p>}

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setShowScheduleForm(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.confirmButton}
                    disabled={!selectedDate || !selectedTime || response.loading}
                  >
                    {response.loading ? 'Agendando...' : 'Confirmar Agendamento'}
                  </button>
                </div>
              </form>
            )}
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