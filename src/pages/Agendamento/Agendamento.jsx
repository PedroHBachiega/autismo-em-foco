<<<<<<< HEAD
// src/pages/Agendamento.jsx

import React, { useState, useEffect, useRef } from 'react';
import styles from './Agendamento.module.css';
import { useAuthValue } from '../../context/AuthContext';
import { useInsertDocument } from '../../Hooks/useInsertDocument';
import { useFetchDocuments } from '../../Hooks/useFetchDocuments';
import { useGTM } from '../../context/GTMContext';
import { googleMapsApi } from '../../services/googleMapsApi';
import MapView from '../../components/MapView/MapView';
import { useAgendamentoToast } from '../../Hooks/useAgendamentoToast';
import CalendarioVisual from '../../components/CalendarioVisual/CalendarioVisual';
import Button from '../../components/Button';
import { MdSearch, MdMap, MdSchedule, MdArrowBack, MdCancel, MdCheck, MdPersonAdd } from 'react-icons/md';

import { Autocomplete, useLoadScript } from '@react-google-maps/api';

export default function Agendamento() {
  // Estados principais
  const [especialidade, setEspecialidade] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [coords, setCoords] = useState({ lat: null, lng: null });

  const [showResults, setShowResults] = useState(false);
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showMap, setShowMap] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [message, setMessage] = useState('');
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  // Refs e Autocomplete
  const cidadeInputRef = useRef(null);
  const bairroInputRef = useRef(null);
  const cidadeAutoRef = useRef(null);
  const bairroAutoRef = useRef(null);

  // Hooks de contexto e dados
  const { user } = useAuthValue();
  const { insertDocument, response } = useInsertDocument('agendamentos');
  const { documents: existingAppointments } = useFetchDocuments('agendamentos');
  const { trackAppointmentScheduled } = useGTM();
  const { notifyAgendamentoCriado, notifyAgendamentoErro } = useAgendamentoToast();

  // Carrega a API do Google Places
  const { isLoaded: mapsReady, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Busca de profissionais via Google Places (ou mock)
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowResults(false);

    try {
      const filters = { city: cidade, specialty: especialidade , lat: coords.lat,
  lng: coords.lng };
      const establishments = await googleMapsApi.getEstablishments(filters);

      if (establishments?.length) {
        setProfissionais(establishments);
      } else {
        const mockData = googleMapsApi.getMockEstablishments(cidade, especialidade);
        setProfissionais(mockData);
      }

      setShowResults(true);
    } catch (err) {
      console.error(err);
      setError('Erro ao buscar estabelecimentos. Usando dados simulados.');
      setProfissionais(googleMapsApi.getMockEstablishments(cidade, especialidade));
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  // Configura agendamento
  const handleScheduleClick = (prof) => {
    setSelectedProfessional(prof);
    setShowScheduleForm(true);
    setSelectedDate('');
    setSelectedTime('');
    setAvailableTimes([]);
    setMessage('');
    setScheduleSuccess(false);
  };

  // Calcula min/max para o date picker
  const getMinDate = () => new Date().toISOString().split('T')[0];
  const getMaxDate = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split('T')[0];
  };

  // Filtra horários disponíveis
  useEffect(() => {
    if (selectedDate && selectedProfessional) {
      const booked = existingAppointments
        ?.filter(app =>
          app.profissionalId === selectedProfessional.id &&
          app.data === selectedDate
        )
        .map(app => app.horario) || [];

      const free = selectedProfessional.horarios.filter(h => !booked.includes(h));
      setAvailableTimes(free);
      setMessage(free.length ? '' : 'Nenhum horário disponível nesta data.');
    }
  }, [selectedDate, selectedProfessional, existingAppointments]);
  
  // Prepara as datas disponíveis para o calendário visual
  const [availableDates, setAvailableDates] = useState([]);
  
  useEffect(() => {
    if (selectedProfessional) {
      // Gera datas disponíveis para os próximos 3 meses
      const dates = [];
      const today = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);
      
      for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
        // Pula finais de semana
        if (d.getDay() !== 0 && d.getDay() !== 6) {
          const dateString = d.toISOString().split('T')[0];
          dates.push(dateString);
        }
      }
      
      setAvailableDates(dates);
    }
  }, [selectedProfessional]);

  const isWeekend = date => [0, 6].includes(new Date(date).getDay());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    if (isWeekend(date)) {
      setMessage('Não há atendimentos nos finais de semana.');
      setAvailableTimes([]);
    } else {
      setMessage('');
    }
  };

  // Submissão do agendamento
  const handleScheduleSubmit = async e => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setMessage('Selecione data e horário.');
      notifyAgendamentoErro('Selecione data e horário para continuar.');
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
      coords,             // lat & lng do lugar
      createdAt: new Date()
    };

    try {
      const docRef = await insertDocument(agendamento);
      
      // Adicionar o ID do documento ao objeto de agendamento
      const agendamentoComId = { ...agendamento, id: docRef.id };
      
      // Notificar sucesso com toast
      await notifyAgendamentoCriado(agendamentoComId);
      
      // Registrar evento no GTM
      trackAppointmentScheduled(selectedProfessional.especialidade, selectedProfessional.id);
      
      setScheduleSuccess(true);
      setMessage('Agendamento realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao agendar:', error);
      notifyAgendamentoErro('Ocorreu um erro ao realizar o agendamento. Por favor, tente novamente.');
    }
=======
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
>>>>>>> origin/main
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Agendamento de Consultas</h1>
<<<<<<< HEAD
        <p 
          style={{ color: 'var(--text)'}}>Encontre profissionais e clínicas especializadas em TEA na sua região</p>
=======
        <p>Encontre profissionais e clínicas especializadas em TEA na sua região</p>
>>>>>>> origin/main
      </header>

      <section className={styles.searchSection}>
        <h2>Buscar Profissionais</h2>
<<<<<<< HEAD
        <form onSubmit={handleSearch} className={styles.searchForm}>
          {/* Especialidade */}
          <div className={styles.formGroup}>
            <label htmlFor="especialidade">Especialidade</label>
            <select
              id="especialidade"
              value={especialidade}
              onChange={e => setEspecialidade(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="neuropediatra">Neuropediatra</option>
              <option value="neuropsicólogo">Neuropsicólogo</option>
              <option value="psicopedagogo">Psicopedagogo</option>
=======
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
>>>>>>> origin/main
              <option value="fonoaudiólogo">Fonoaudiólogo</option>
              <option value="terapeuta-ocupacional">Terapeuta Ocupacional</option>
              <option value="psicólogo">Psicólogo</option>
              <option value="clinica">Clínica Especializada</option>
            </select>
          </div>
<<<<<<< HEAD

          {/* Cidade e Bairro com Autocomplete */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="cidade">Cidade</label>
              {mapsReady ? (
                <Autocomplete
                  onLoad={auto => (cidadeAutoRef.current = auto)}
                  onPlaceChanged={() => {
                    const place = cidadeAutoRef.current.getPlace();
                    if (place.formatted_address) {
                      setCidade(place.formatted_address);
                    }
                    if (place.geometry) {
                      setCoords({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                      });
                    }
                  }}
                >
                  <input
                    type="text"
                    id="cidade"
                    placeholder="Digite sua cidade"
                    ref={cidadeInputRef}
                    className={styles.input}
                  />
                </Autocomplete>
              ) : (
                <input
                  type="text"
                  id="cidade"
                  placeholder="Digite sua cidade"
                  value={cidade}
                  onChange={e => setCidade(e.target.value)}
                  className={styles.input}
                />
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="bairro">Bairro (opcional)</label>
              {mapsReady ? (
                <Autocomplete
                  onLoad={auto => (bairroAutoRef.current = auto)}
                  onPlaceChanged={() => {
                    const place = bairroAutoRef.current.getPlace();
                    if (place.formatted_address) {
                      setBairro(place.formatted_address);
                    }
                    if (place.geometry) {
                      setCoords({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                      });
                    }
                  }}
                >
                  <input
                    type="text"
                    id="bairro"
                    placeholder="Digite seu bairro"
                    ref={bairroInputRef}
                    className={styles.input}
                  />
                </Autocomplete>
              ) : (
                <input
                  type="text"
                  id="bairro"
                  placeholder="Digite seu bairro"
                  value={bairro}
                  onChange={e => setBairro(e.target.value)}
                  className={styles.input}
                />
              )}
            </div>
          </div>

          {/* Botões */}
          <div className={styles.buttonGroup}>
            <Button 
              type="submit" 
              loading={loading} 
              loadingText="Buscando..." 
              variant="primary" 
              size="medium" 
              icon={<MdSearch />}
            >
              Buscar
            </Button>
            <Button
              type="button"
              onClick={() => setShowMap(prev => !prev)}
              variant="outline"
              size="medium"
              icon={<MdMap />}
            >
              {showMap ? 'Ocultar Mapa' : 'Ver no Mapa'}
            </Button>
          </div>
        </form>
      </section>

      {/* Mapa com marcador dinâmico */}
      {showMap && (
       <section className={styles.mapSection}>
        <MapView profissionais={profissionais} />
       </section>
      )}

      {/* Mensagem de erro */}
      {error && <div className={styles.errorMessage}><p>{error}</p></div>}

      {/* Resultados */}
      {showResults && (
        <section className={styles.resultsSection}>
          <h2>Resultados</h2>
          {profissionais.length === 0 ? (
            <p className={styles.noResults}>Nenhum resultado encontrado.</p>
          ) : (
            <div className={styles.resultsGrid}>
              {profissionais.map(p => (
                <div key={p.id} className={styles.resultCard}>
                  <img src={p.imagem} alt={p.nome} className={styles.resultImage} />
                  <div className={styles.resultContent}>
                    <h3>{p.nome}</h3>
                    <span>{p.especialidade}</span>
                    <p>📍 {p.endereco}</p>
                    <p>🏙️ {p.cidade}</p>
                    <p>⭐ {p.avaliacao}</p>
                    <Button
                      onClick={() => handleScheduleClick(p)}
                      variant="primary"
                      size="small"
                      icon={<MdSchedule />}
                    >
                      Agendar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Formulário de Agendamento */}
      {showScheduleForm && selectedProfessional && (
        <section className={styles.scheduleFormSection}>
          <h2>Agendar com {selectedProfessional.nome}</h2>

          {scheduleSuccess ? (
            <div className={styles.successMessage}>
              <h3>Sucesso!</h3>
              <p>
                Consulta agendada para {selectedDate} às {selectedTime}.
              </p>
              <Button
                onClick={() => setShowScheduleForm(false)}
                variant="primary"
                size="medium"
                icon={<MdArrowBack />}
              >
                Voltar
              </Button>
            </div>
          ) : (
            <form onSubmit={handleScheduleSubmit} className={styles.scheduleForm}>
              <div className={styles.calendarContainer}>
                <label>Selecione uma data</label>
                <CalendarioVisual 
                  onDateSelect={handleDateChange} 
                  availableDates={availableDates} 
                  selectedDate={selectedDate} 
                />
              </div>

              {selectedDate && !isWeekend(selectedDate) && (
                <div className={styles.formGroup}>
                  <label htmlFor="time">Horário</label>
                  <select
                    id="time"
                    value={selectedTime}
                    onChange={e => setSelectedTime(e.target.value)}
                    required
                  >
                    <option value="">Selecione</option>
                    {availableTimes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}

              {message && (
                <p className={
                  response.error
                    ? styles.errorMessage
                    : styles.infoMessage
                }>{message}</p>
              )}

              <div className={styles.formActions}>
                <Button
                  type="button"
                  onClick={() => setShowScheduleForm(false)}
                  variant="secondary"
                  size="medium"
                  icon={<MdCancel />}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  loading={response.loading}
                  loadingText="Agendando..."
                  variant="success"
                  size="medium"
                  icon={<MdCheck />}
                >
                  Confirmar
                </Button>
              </div>
            </form>
          )}
        </section>
      )}

      {/* Chamada para profissionais */}
      <section className={styles.registerSection}>
        <h2>É um profissional ou clínica?</h2>
        <p 
          style={{ color: 'var(--text)'}}>Cadastre-se para aparecer nos resultados.</p>
        <a href="#" className={styles.registerButton}>Cadastrar Serviço</a>
      </section>
    </div>
  );
}
=======
          
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
>>>>>>> origin/main
