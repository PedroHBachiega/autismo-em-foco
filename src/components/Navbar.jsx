import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthentication } from '../Hooks/UseAuthentication'; 
import { useAuthValue } from '../context/AuthContext'; // ⬅️ Pega o userProfile aqui
import logotipoImage from '../assets/logotipo.png';
import MobileNavbar from './MobileNavbar';

const Navbar = () => {
  const { user, logout } = useAuthentication();
  const { userProfile } = useAuthValue(); 

  const isAdmin = userProfile?.userType === 'admin';
  const location = useLocation();

  const linkUnderline = (path) =>
    `${location.pathname === path ? 'border-b-4 border-white' : ''}`;

  const DesktopNavbar = () => (
    <nav className="flex items-center justify-between bg-[#2361ad] dark:bg-[#2361ad] high-contrast:bg-black high-contrast:border-b-2 high-contrast:border-yellow-300 px-8 py-2 h-14">
      <div className="flex items-center font-bold text-white high-contrast:text-yellow-300 text-2xl font-['Arial Rounded MT Bold']">
        <Link to="/">
          <img src={logotipoImage} alt="logotipo" className="mx-auto w-28 h-auto" />
        </Link>
      </div>

      <div className="flex gap-4">
        {isAdmin ? (
          <>
            <Link to="/" className="text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-400 high-contrast:hover:text-yellow-100 transition-colors">Home</Link>
            <Link to="/comunidade" className="text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors">Comunidade</Link>
            <Link to="/admin" className="text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors">Painel Admin</Link>
          </>
        ) : (
          <>
            <Link to="/" className={`text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors ${linkUnderline('/')}`}>Home</Link>
            <Link to="/sobreautismo" className={`text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors ${linkUnderline('/sobreautismo')}`}>O que é o autismo?</Link>
            <Link to="/leisedireitos" className={`text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors ${linkUnderline('/leisedireitos')}`}>Leis e direitos</Link>
            <Link to="/eventos" className={`text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors ${linkUnderline('/eventos')}`}>Eventos</Link>
            <Link to="/tratamentos" className={`text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors ${linkUnderline('/tratamentos')}`}>Tratamento</Link>
            <Link to="/agendamento" className={`text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors ${linkUnderline('/agendamento')}`}>Agendamento</Link>
            <Link to="/meus-agendamentos" className={`text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors ${linkUnderline('/meus-agendamentos')}`}>Meus agendamentos</Link>
            <Link to="/comunidade" className={`text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors ${linkUnderline('/comunidade')}`}>Comunidade</Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {!user ? (
          <Link to="/login" className="bg-[#5c9ded] high-contrast:bg-yellow-300 text-white high-contrast:text-black rounded-lg px-5 py-1 font-bold text-base hover:bg-[#2361ad] high-contrast:hover:bg-yellow-400 hover:border hover:border-white high-contrast:hover:border-black transition-colors">Login</Link>
        ) : (
          <>
            <Link to="/profile" className="text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors">
              Perfil
            </Link>
            <button onClick={logout} className="bg-red-500 high-contrast:bg-yellow-300 text-white high-contrast:text-black rounded-lg px-5 py-1 font-bold text-base hover:bg-red-700 high-contrast:hover:bg-yellow-400 hover:border hover:border-white high-contrast:hover:border-black transition-colors">Sair</button>
          </>
        )}
      </div>
    </nav>
  );

  return (
    <>
      <div className="block md:hidden">
        <MobileNavbar />
      </div>
      <div className="hidden md:block">
        <DesktopNavbar />
      </div>
    </>
  );
};

export default Navbar;
