import React, { useState, useEffect } from 'react';
import { useAuthentication } from '../../Hooks/UseAuthentication';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
  const { userProfile } = useAuthentication();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar se o usuário é admin
  useEffect(() => {
    if (userProfile && userProfile.userType !== 'admin') {
      navigate('/');
    }
  }, [userProfile, navigate]);

  // Buscar todos os usuários
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const list = await api.get('/users');
        setUsers(list);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        setError('Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Função para alterar o tipo de usuário
  const changeUserType = async (userId, newType) => {
    try {
      const updated = await api.put(`/users/${userId}/type`, { userType: newType });
      setUsers(prevUsers => prevUsers.map(u => u.id === userId ? updated : u));
    } catch (err) {
      console.error('Erro ao atualizar tipo de usuário:', err);
      alert('Erro ao atualizar tipo de usuário');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando usuários...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.adminPanel}>
      <h1>Painel de Administração</h1>
      
      {/* Seção de Ações Rápidas */}
      <div className={styles.quickActions}>
        <h2>Ações Rápidas</h2>
        <div className={styles.actionButtons}>
          <Link to="/cadastro-evento" className={styles.actionBtn}>
            📅 Cadastrar Evento
          </Link>
          <Link to="/eventos" className={styles.actionBtn}>
            👁️ Ver Eventos
          </Link>
          <Link to="/admin/posts" className={styles.actionBtn}>
            📝 Curadoria de Posts
          </Link>
        </div>
      </div>
      
      <div className={styles.usersSection}>
        <h2>Gerenciar Usuários</h2>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.nome || 'Não informado'}</td>
                <td>{user.userType || 'usuario'}</td>
                <td>
                  {user.criadoEm ? new Date(user.criadoEm).toLocaleDateString('pt-BR') : 'N/A'}
                </td>
                <td>
                  <select
                    value={user.userType || 'usuario'}
                    onChange={(e) => changeUserType(user.id, e.target.value)}
                    className={styles.typeSelect}
                  >
                    <option value="usuario">Usuário</option>
                    <option value="profissional">Profissional</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;