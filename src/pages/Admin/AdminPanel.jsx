import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuthValue } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
  const { userProfile } = useAuthValue();
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
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const usersList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
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
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        userType: newType
      });
      
      // Atualizar a lista local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, userType: newType } : user
        )
      );
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
                <td>{user.displayName || 'Não informado'}</td>
                <td>{user.userType || 'usuario'}</td>
                <td>
                  {user.createdAt?.toDate().toLocaleDateString('pt-BR') || 'N/A'}
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