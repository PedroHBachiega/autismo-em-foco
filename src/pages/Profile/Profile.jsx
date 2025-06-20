import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useUpdateProfile } from '../../Hooks/useUpdateProfile';
import styles from './Profile.module.css';

const Profile = () => {

  const { user, userProfile } = useAuthValue();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    telefone: '',
    cidade: '',

    estado: '',
    // Campos específicos para profissionais
    especialidade: '',
    registroProfissional: '',
    experienciaAutismo: '',
    atendimentoOnline: false,
    atendimentoPresencial: false

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
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();

            setFormData({
              displayName: user.displayName || '',
              bio: data.bio || '',
              telefone: data.telefone || '',
              cidade: data.cidade || '',

              estado: data.estado || '',
              // Campos específicos para profissionais
              especialidade: data.especialidade || '',
              registroProfissional: data.registroProfissional || '',
              experienciaAutismo: data.experienciaAutismo || '',
              atendimentoOnline: data.atendimentoOnline || false,
              atendimentoPresencial: data.atendimentoPresencial || false

            });
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();

  }, [user, success]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value

    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
      isProfileComplete: true
    };
    await updateUserProfile(updatedData);

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
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileAvatar}>
          {user?.displayName ? user.displayName[0].toUpperCase() : user?.email[0].toUpperCase()}
        </div>
        <h1>{user?.displayName || 'Perfil do Usuário'}</h1>

        {userProfile?.userType === 'profissional' && (
          <span className={styles.profileBadge}>Profissional</span>
        )}
        {userProfile?.userType === 'admin' && (
          <span className={styles.profileBadge}>Administrador</span>
        )}

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

            
            {/* Informações específicas para profissionais */}
            {userProfile?.userType === 'profissional' && (
              <div className={styles.professionalInfo}>
                <h3>Informações Profissionais</h3>
                <p><strong>Especialidade:</strong> {formData.especialidade || 'Não informada'}</p>
                <p><strong>Registro Profissional:</strong> {formData.registroProfissional || 'Não informado'}</p>
                <p><strong>Experiência com Autismo:</strong> {formData.experienciaAutismo || 'Não informada'}</p>
                <p><strong>Atendimento Online:</strong> {formData.atendimentoOnline ? 'Sim' : 'Não'}</p>
                <p><strong>Atendimento Presencial:</strong> {formData.atendimentoPresencial ? 'Sim' : 'Não'}</p>
              </div>
            )}

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

            
            {/* Campos específicos para profissionais */}
            {userProfile?.userType === 'profissional' && (
              <>
                <h3 className={styles.formSectionTitle}>Informações Profissionais</h3>
                <div className={styles.formGroup}>
                  <label htmlFor="especialidade">Especialidade</label>
                  <input
                    type="text"
                    id="especialidade"
                    name="especialidade"
                    value={formData.especialidade}
                    onChange={handleChange}
                    placeholder="Sua especialidade"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="registroProfissional">Registro Profissional</label>
                  <input
                    type="text"
                    id="registroProfissional"
                    name="registroProfissional"
                    value={formData.registroProfissional}
                    onChange={handleChange}
                    placeholder="Seu registro profissional"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="experienciaAutismo">Experiência com Autismo</label>
                  <textarea
                    id="experienciaAutismo"
                    name="experienciaAutismo"
                    value={formData.experienciaAutismo}
                    onChange={handleChange}
                    placeholder="Descreva sua experiência com autismo"
                    rows="4"
                  ></textarea>
                </div>
                <div className={styles.checkboxGroup}>
                  <div className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      id="atendimentoOnline"
                      name="atendimentoOnline"
                      checked={formData.atendimentoOnline}
                      onChange={handleChange}
                    />
                    <label htmlFor="atendimentoOnline">Atendimento Online</label>
                  </div>
                  <div className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      id="atendimentoPresencial"
                      name="atendimentoPresencial"
                      checked={formData.atendimentoPresencial}
                      onChange={handleChange}
                    />
                    <label htmlFor="atendimentoPresencial">Atendimento Presencial</label>
                  </div>
                </div>
              </>
            )}

            {updateError && <p className={styles.error}>{updateError}</p>}
            <div className={styles.formButtons}>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </button>
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
    </div>
  );
};

export default Profile;