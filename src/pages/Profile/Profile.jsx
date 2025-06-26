import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
<<<<<<< HEAD
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from './Profile.module.css';
import Ranking from '../../components/Ranking/Ranking';
import UserStats from '../../components/UserStats/UserStats';
=======
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useUpdateProfile } from '../../Hooks/useUpdateProfile';
import styles from './Profile.module.css';
>>>>>>> origin/main

const Profile = () => {
  const { user } = useAuthValue();
  const navigate = useNavigate();
<<<<<<< HEAD
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
=======
  const [setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
>>>>>>> origin/main
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    telefone: '',
    cidade: '',
<<<<<<< HEAD
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

=======
    estado: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const { updateUserProfile, loading: updateLoading, error: updateError, success } = useUpdateProfile();

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Buscar dados do usuário
>>>>>>> origin/main
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
<<<<<<< HEAD
          const userDoc = await getDoc(doc(db, 'users', user.uid));
=======
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
>>>>>>> origin/main
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setFormData({
<<<<<<< HEAD
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
              // Novos campos
              latitude: data.latitude || '',
              longitude: data.longitude || '',
              endereco: data.endereco || ''
=======
              displayName: user.displayName || '',
              bio: data.bio || '',
              telefone: data.telefone || '',
              cidade: data.cidade || '',
              estado: data.estado || ''
>>>>>>> origin/main
            });
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
<<<<<<< HEAD
=======
        } finally {
          setLoading(false);
>>>>>>> origin/main
        }
      }
    };

    fetchUserData();
<<<<<<< HEAD
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
      await updateDoc(doc(db, 'users', user.uid), formData);
      setUserData({ ...userData, ...formData });
      setIsEditing(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    }
  };

  if (!user || !userData) {
    return <div className={styles.loading}>Carregando...</div>;
=======
  }, [user, success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserProfile(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Carregando perfil...</p>
      </div>
    );
>>>>>>> origin/main
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
<<<<<<< HEAD
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
              <strong style={{ color: 'var(--text)'}}>Email:</strong> {user.email}
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
          <button 
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            Editar Perfil
          </button>
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
=======
        <div className={styles.profileAvatar}>
          {user?.displayName ? user.displayName[0].toUpperCase() : user?.email[0].toUpperCase()}
        </div>
        <h1>{user?.displayName || 'Perfil do Usuário'}</h1>
      </div>

      {!isEditing ? (
        <div className={styles.profileInfo}>
          <div className={styles.infoCard}>
            <h2>Informações Pessoais</h2>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Nome:</strong> {formData.displayName || 'Não informado'}</p>
            <p><strong>Bio:</strong> {formData.bio || 'Não informada'}</p>
            <p><strong>Telefone:</strong> {formData.telefone || 'Não informado'}</p>
            <p><strong>Cidade:</strong> {formData.cidade || 'Não informada'}</p>
            <p><strong>Estado:</strong> {formData.estado || 'Não informado'}</p>
            <button 
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              Editar Perfil
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.profileForm}>
          <h2>Editar Perfil</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="displayName">Nome de Exibição</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Seu nome"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="bio">Biografia</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Conte um pouco sobre você"
                rows="4"
              ></textarea>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="telefone">Telefone</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="Seu telefone"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cidade">Cidade</label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="Sua cidade"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="estado">Estado</label>
              <input
                type="text"
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                placeholder="Seu estado"
              />
            </div>
            {updateError && <p className={styles.error}>{updateError}</p>}
            <div className={styles.formButtons}>
              <button 
                type="button" 
>>>>>>> origin/main
                className={styles.cancelButton}
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </button>
<<<<<<< HEAD
            </div>
          </div>
        )}
      </div>
=======
              <button 
                type="submit" 
                className={styles.saveButton}
                disabled={updateLoading}
              >
                {updateLoading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}
>>>>>>> origin/main
    </div>
  );
};

export default Profile;