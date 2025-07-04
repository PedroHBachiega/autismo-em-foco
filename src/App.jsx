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

function App() {
  return (
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