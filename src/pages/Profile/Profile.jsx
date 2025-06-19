import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useUpdateProfile } from '../../Hooks/useUpdateProfile';
import styles from './Profile.module.css';

const Profile = () => {
  const { user } = useAuthValue();
  const navigate = useNavigate();
  const [setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    telefone: '',
    cidade: '',
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
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setFormData({
              displayName: user.displayName || '',
              bio: data.bio || '',
              telefone: data.telefone || '',
              cidade: data.cidade || '',
              estado: data.estado || ''
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
  }, [user, success, setUserData]);

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
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
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