import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
import api from '../../services/api';
import styles from './Profile.module.css';
import Ranking from '../../components/Ranking/Ranking';
import UserStats from '../../components/UserStats/UserStats';

const Profile = () => {
  const { user, logout } = useAuthValue();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    telefone: '',
    cidade: '',
    estado: '',
    especialidade: '',
    registroProfissional: '',
    experienciaAutismo: '',
    atendimentoOnline: false,
    atendimentoPresencial: false,
    // Novos campos para coordenadas
    latitude: '',
    longitude: '',
    endereco: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const data = await api.get(`/profile/${user.uid}`);
          setUserData(data);
          setFormData({
            displayName: data.displayName || '',
            bio: data.bio || '',
            telefone: data.telefone || '',
            cidade: data.cidade || '',
            estado: data.estado || '',
            especialidade: data.especialidade || '',
            registroProfissional: data.registroProfissional || '',
            experienciaAutismo: data.experienciaAutismo || '',
            atendimentoOnline: data.atendimentoOnline || false,
            atendimentoPresencial: data.atendimentoPresencial || false,
            latitude: data.latitude || '',
            longitude: data.longitude || '',
            endereco: data.endereco || ''
          });
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      const data = await api.put(`/profile/${user.uid}`, formData);
      setUserData(data);
      setIsEditing(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirmDelete = window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.');
    if (!confirmDelete) return;
    try {
      await api.delete(`/users/${user.uid}`);
      alert('Conta excluída com sucesso.');
      await logout();
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert('Erro ao excluir conta. Tente novamente.');
    }
  };

  if (!user || !userData) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>Meu Perfil</h1>
        <p>Gerencie suas informações pessoais e veja suas conquistas</p>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {userData.displayName ? userData.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className={styles.userDetails}>
            <h2 style={{ color: 'var(--text)'}}>{userData.displayName || 'Usuário'}</h2>
            <span className={styles.userType}>
              {userData.userType === 'professional' ? 'Profissional' : 'Usuário'}
            </span>
          </div>
        </div>

        <div className={styles.infoSection}>
          <h3 style={{ color: 'var(--text)'}}>Informações Pessoais</h3>
          <div className={styles.infoCard}>
            <div className={styles.infoItem}>
              <strong style={{ color: 'var(--text)'}}>Email:</strong> {userData.email || user.email || 'Não informado'}
            </div>
            <div className={styles.infoItem}>
              <strong  style={{ color: 'var(--text)'}}>Nome:</strong> {userData.displayName || 'Não informado'}
            </div>
            <div className={styles.infoItem}>
              <strong  style={{ color: 'var(--text)'}}>Bio:</strong> {userData.bio || 'Não informado'}
            </div>
            <div className={styles.infoItem}>
              <strong  style={{ color: 'var(--text)'}}>Telefone:</strong> {userData.telefone || 'Não informado'}
            </div>
            <div className={styles.infoItem}>
              <strong  style={{ color: 'var(--text)'}}>Cidade:</strong> {userData.cidade || 'Não informado'}
            </div>
            <div className={styles.infoItem}>
              <strong  style={{ color: 'var(--text)'}}>Estado:</strong> {userData.estado || 'Não informado'}
            </div>
          </div>
        </div>

        {userData.userType === 'professional' && (
          <div className={styles.infoSection}>
            <h3>Informações Profissionais</h3>
            <div className={styles.infoCard}>
              <div className={styles.infoItem}>
                <strong>Especialidade:</strong> {userData.especialidade || 'Não informado'}
              </div>
              <div className={styles.infoItem}>
                <strong>Registro Profissional:</strong> {userData.registroProfissional || 'Não informado'}
              </div>
              <div className={styles.infoItem}>
                <strong>Experiência com Autismo:</strong> {userData.experienciaAutismo || 'Não informado'}
              </div>
              <div className={styles.infoItem}>
                <strong>Endereço:</strong> {userData.endereco || 'Não informado'}
              </div>
              <div className={styles.infoItem}>
                <strong>Localização:</strong> {userData.latitude && userData.longitude ? `${userData.latitude}, ${userData.longitude}` : 'Não informado'}
              </div>
              <div className={styles.infoItem}>
                <strong>Atendimento Online:</strong> {userData.atendimentoOnline ? 'Sim' : 'Não'}
              </div>
              <div className={styles.infoItem}>
                <strong>Atendimento Presencial:</strong> {userData.atendimentoPresencial ? 'Sim' : 'Não'}
              </div>
            </div>
          </div>
        )}

        <div className={styles.statsSection}>
          <UserStats />
        </div>

        {!isEditing ? (
          <div className={styles.formActions}>
            <button 
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              Editar Perfil
            </button>
            <button 
              className={styles.cancelButton}
              onClick={handleDeleteAccount}
            >
              Excluir Conta
            </button>
          </div>
        ) : (
          <div className={styles.editForm}>
            <h3 style={{ color: 'var(--text)'}}>Editar Perfil</h3>
            
            <div className={styles.formGroup}>
              <label style={{ color: 'var(--text)'}}>Nome de Exibição:</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label style={{ color: 'var(--text)'}}>Bio:</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className={styles.formTextarea}
                rows="3"
              />
            </div>

            <div className={styles.formGroup}>
              <label style={{ color: 'var(--text)'}}>Telefone:</label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label style={{ color: 'var(--text)'}}>Cidade:</label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label style={{ color: 'var(--text)'}}>Estado:</label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>

            {userData.userType === 'professional' && (
              <>
                <div className={styles.formGroup}>
                  <label>Especialidade:</label>
                  <input
                    type="text"
                    name="especialidade"
                    value={formData.especialidade}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Registro Profissional:</label>
                  <input
                    type="text"
                    name="registroProfissional"
                    value={formData.registroProfissional}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Endereço Completo:</label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Rua, número, bairro, cidade, estado"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Latitude:</label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Ex: -23.5505"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Longitude:</label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Ex: -46.6333"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Experiência com Autismo:</label>
                  <textarea
                    name="experienciaAutismo"
                    value={formData.experienciaAutismo}
                    onChange={handleInputChange}
                    className={styles.formTextarea}
                    rows="3"
                  />
                </div>

                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="atendimentoOnline"
                      checked={formData.atendimentoOnline}
                      onChange={handleInputChange}
                    />
                    Atendimento Online
                  </label>
                </div>

                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="atendimentoPresencial"
                      checked={formData.atendimentoPresencial}
                      onChange={handleInputChange}
                    />
                    Atendimento Presencial
                  </label>
                </div>
              </>
            )}

            <div className={styles.formActions}>
              <button 
                className={styles.saveButton}
                onClick={handleSave}
              >
                Salvar
              </button>
              <button 
                className={styles.cancelButton}
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </button>
              <button 
                className={styles.cancelButton}
                onClick={handleDeleteAccount}
              >
                Excluir Conta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;