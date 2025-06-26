<<<<<<< HEAD
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import AdminPosts from './pages/Admin/AdminPosts';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import RecuperarSenha from './pages/RecuperarSenha/RecuperarSenha';
import SobreAutismo from './pages/SobreAutismo/SobreAutismo';
import Tratamentos from './pages/Tratamentos/Tratamentos';
import Sobre from './pages/Sobre/Sobre';
import Leisedireitos from './pages/Leisedireitos/Leisedireitos';
import Eventos from './pages/Eventos/Eventos';
import CadastroEvento from './pages/CadastroEvento/CadastroEvento';


import Profile from './pages/Profile/Profile';
import Comunidade from './pages/Comunidade/Comunidade';
import CreatePost from './pages/CreatePost/CreatePost';
import Post from './pages/Post/Post';
import Agendamento from './pages/Agendamento/Agendamento';
import MeusAgendamentos from './pages/MeusAgendamentos/MeusAgendamentos';
import AdminPanel from './pages/Admin/AdminPanel';


import ProtectedRoute from './components/ProtectedRoute';
=======
// src/App.jsx
>>>>>>> origin/main

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Context & Auth (somente para consumir o contexto, não para prover)
import { useAuthValue } from './context/AuthContext';

// Adicione esta importação junto com as outras importações de páginas
import RecuperarSenha from './pages/RecuperarSenha/RecuperarSenha';

// Layout & Pages
import Layout from './Layout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Comunidade from './pages/Comunidade/Comunidade';
import Sobre from './pages/Sobre/Sobre';
import SobreAutismo from './pages/SobreAutismo/SobreAutismo';
import Tratamentos from './pages/Tratamentos/Tratamentos';
import Leisedireitos from './pages/Leisedireitos/Leisedireitos';
import Eventos from './pages/Eventos/Eventos';
import Agendamento from './pages/Agendamento/Agendamento';
import CreatePost from './pages/CreatePost/CreatePost';
import Post from './pages/Post/Post';
import Profile from './pages/Profile/Profile'; // Importar a nova página de perfil

// PrivateRoute para checar autenticação antes de renderizar certos componentes
function PrivateRoute({ children }) {
  const { user } = useAuthValue();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
<<<<<<< HEAD
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rotas públicas */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="recuperar-senha" element={<RecuperarSenha />} />
        <Route path="sobreautismo" element={<SobreAutismo />} />
        <Route path="tratamentos" element={<Tratamentos />} />
        <Route path="sobre" element={<Sobre />} />
        <Route path="leisedireitos" element={<Leisedireitos />} />
        <Route path="eventos" element={<Eventos />} />
        
        {/* Rotas protegidas para qualquer usuário autenticado */}
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="comunidade" element={
          <ProtectedRoute>
            <Comunidade />
          </ProtectedRoute>
        } />
        <Route path="posts/create" element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        } />
        <Route path="posts/:id" element={
          <ProtectedRoute>
            <Post />
          </ProtectedRoute>
        } />
        <Route path="agendamento" element={
          <ProtectedRoute>
            <Agendamento />
          </ProtectedRoute>
        } />
        <Route path="meus-agendamentos" element={
          <ProtectedRoute>
            <MeusAgendamentos />
          </ProtectedRoute>
        } />
        {/* Rotas protegidas para administradores */}
        <Route path="admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/admin/posts" element={<AdminPosts />} />
        <Route path="/cadastro-evento" element={<CadastroEvento />} />
      </Route>
    </Routes>
  );
}

export default App;
=======
    // Aqui NÃO colocamos BrowserRouter nem AuthProvider — já existe em main.jsx
    <Routes>
      {/* Página inicial (público) */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      {/* Rotas de autenticação (público) */}
      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout>
            <Register />
          </Layout>
        }
      />

      {/* Outras páginas institucionais (público) */}
      <Route
        path="/comunidade"
        element={
          <Layout>
            <Comunidade />
          </Layout>
        }
      />
      <Route
        path="/sobre"
        element={
          <Layout>
            <Sobre />
          </Layout>
        }
      />
      <Route
        path="/sobreautismo"
        element={
          <Layout>
            <SobreAutismo />
          </Layout>
        }
      />
      <Route
        path="/tratamentos"
        element={
          <Layout>
            <Tratamentos />
          </Layout>
        }
      />
      <Route
        path="/leisedireitos"
        element={
          <Layout>
            <Leisedireitos />
          </Layout>
        }
      />
      <Route
        path="/eventos"
        element={
          <Layout>
            <Eventos />
          </Layout>
        }
      />
      <Route
        path="/agendamento"
        element={
          <Layout>
            <Agendamento />
          </Layout>
        }
      />

      {/* Rota privada: só acessível com usuário logado */}
      <Route
        path="/posts/create"
        element={
          <Layout>
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          </Layout>
        }
      />

      {/* Nova rota para o perfil do usuário (privada) */}
      <Route
        path="/profile"
        element={
          <Layout>
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          </Layout>
        }
      />

      {/* Visualizar post (público) */}
      <Route
        path="/posts/:id"
        element={
          <Layout>
            <Post />
          </Layout>
        }
      />
      

      {/* Catch-all: qualquer rota não mapeada redireciona para "/" */}
      <Route path="*" element={<Navigate to="/" replace />} />
      // Adicione esta rota junto com as outras rotas públicas
      <Route
        path="/recuperar-senha"
        element={
          <Layout>
            <RecuperarSenha />
          </Layout>
        }
      />
    </Routes>
  );
}
>>>>>>> origin/main
