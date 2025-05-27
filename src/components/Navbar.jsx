import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthentication } from '../Hooks/UseAuthentication';
// Importar a logotipo
import logotipoImage from '../assets/logotipo.png';

const Navbar = () => {
  const { user, logout } = useAuthentication();
  return (
    <nav className="flex items-center justify-between bg-[#2361ad] px-8 py-2 h-14">
      <div className="flex items-center font-bold text-white text-2xl font-['Arial Rounded MT Bold']">
        <img src={logotipoImage} alt="logotipo" className="mx-auto w-28 h-auto" />
      </div>
      <div className="flex gap-4">
        <Link to="/" className="text-white font-bold text-base hover:text-blue-200 transition-colors">Home</Link>
        <Link to="/sobreautismo" className="text-white font-bold text-base hover:text-blue-200 transition-colors">O que é o autismo?</Link>
        <Link to="/leisedireitos" className="text-white font-bold text-base hover:text-blue-200 transition-colors">Leis e direitos</Link>
        <Link to="/eventos" className="text-white font-bold text-base hover:text-blue-200 transition-colors">Eventos</Link>
        <Link to="/tratamentos" className="text-white font-bold text-base hover:text-blue-200 transition-colors">Tratamento</Link>
        <Link to="/agendamento" className="text-white font-bold text-base hover:text-blue-200 transition-colors">Agendamento</Link>
        <Link to="/comunidade" className="text-white font-bold text-base hover:text-blue-200 transition-colors">Comunidade</Link>
      </div>
      <div className="flex items-center gap-4">
        {!user ? (
          <Link to="/login" className="bg-[#5c9ded] text-white rounded-lg px-5 py-1 font-bold text-base hover:bg-[#2361ad] hover:border hover:border-white transition-colors">Login</Link>
        ) : (
          <>
            <Link to="/profile" className="text-white font-bold text-base hover:text-blue-200 transition-colors">
              Perfil
            </Link>
            <button onClick={logout} className="bg-red-500 text-white rounded-lg px-5 py-1 font-bold text-base hover:bg-red-700 hover:border hover:border-white transition-colors">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;