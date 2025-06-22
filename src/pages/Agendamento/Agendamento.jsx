import React, { useState, useEffect } from 'react';
import styles from './Agendamento.module.css';
import { useAuthValue } from '../../context/AuthContext';
import { useInsertDocument } from '../../Hooks/useInsertDocument';
import { useFetchDocuments } from '../../Hooks/useFetchDocuments';
import { useGTM } from '../../context/GTMContext';

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
  
  const { user } = useAuthValue();
  const { insertDocument, response } = useInsertDocument('agendamentos');
  const { documents: existingAppointments } = useFetchDocuments('agendamentos');
  const { trackAppointmentScheduled } = useGTM();

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
      imagem: "https://placehold.co/600x400/2361ad/FFF?text=Profissional",
      horarios: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
    },
    {
      id: 2,
      nome: "Dr. Carlos Mendes",
      especialidade: "Neuropediatra",
      endereco: "Rua Augusta, 500 - Consolação",
      cidade: "São Paulo",
      telefone: "(11) 2345-6789",
      avaliacao: 4.8,
      imagem: "https://placehold.co/600x400/2361ad/FFF?text=Profissional",
      horarios: ["08:00", "09:00", "10:00", "13:00", "14:00", "15:00"]
    },
    {
      id: 3,
      nome: "Centro Especializado TEA",
      especialidade: "Clínica Multidisciplinar",
      endereco: "Rua Oscar Freire, 200 - Jardins",
      cidade: "São Paulo",
      telefone: "(11) 3333-4444",
      avaliacao: 4.7,
      imagem: "https://placehold.co/600x400/2361ad/FFF?text=Clínica",
      horarios: ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setShowResults(true);
    // Aqui seria implementada a lógica de busca real
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
      userId: user.uid,
      userName: user.displayName || user.email,
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
        </section>
      )}

      {showScheduleForm && selectedProfessional && (
        <section className={styles.scheduleFormSection}>
          <h2>Agendar Consulta com {selectedProfessional.nome}</h2>
          <div className={styles.scheduleFormContainer}>
            {scheduleSuccess ? (
              <div className={styles.successMessage}>
                <h3>Agendamento realizado com sucesso!</h3>
                <p>Você agendou uma consulta com {selectedProfessional.nome} para o dia {selectedDate} às {selectedTime}.</p>
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