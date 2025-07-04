import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthentication } from '../Hooks/UseAuthentication'; 
import { useAuthValue } from '../context/AuthContext';
import logotipoImage from '../assets/logotipo.png';

const MobileNavbar = () => {
  const { user, logout } = useAuthentication();
  const { userProfile } = useAuthValue();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = userProfile?.userType === 'admin';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#2361ad] high-contrast:bg-black high-contrast:border-b-2 high-contrast:border-yellow-300 px-4 py-2 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center font-bold text-white high-contrast:text-yellow-300 text-xl">
          <Link to="/">
            <img src={logotipoImage} alt="logotipo" className="w-24 h-auto" />
          </Link>
        </div>
        <button 
          onClick={toggleMenu} 
          className="text-white high-contrast:text-yellow-300 focus:outline-none"
          aria-label="Menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#2361ad] high-contrast:bg-black high-contrast:border-2 high-contrast:border-yellow-300 shadow-lg z-50 transition-all duration-300 ease-in-out">
          <div className="flex flex-col py-2 px-4 space-y-3">
            {/* Links baseados no tipo de usuário */}
            {isAdmin ? (
              <>
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors py-2">Home</Link>
                <Link to="/comunidade" onClick={() => setIsMenuOpen(false)} className="text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors py-2">Comunidade</Link>
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors py-2">Painel Admin</Link>
              </>
            ) : (
              <>
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors py-2">Home</Link>
                <Link to="/sobreautismo" onClick={() => setIsMenuOpen(false)} className="text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors py-2">O que é o autismo?</Link>
                <Link to="/leisedireitos" onClick={() => setIsMenuOpen(false)} className="text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors py-2">Leis e direitos</Link>
                <Link to="/eventos" onClick={() => setIsMenuOpen(false)} className="text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors py-2">Eventos</Link>
                <Link to="/tratamentos" onClick={() => setIsMenuOpen(false)} className="text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors py-2">Tratamento</Link>
                <Link to="/agendamento" onClick={() => setIsMenuOpen(false)} className="text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors py-2">Agendamento</Link>
                <Link to="/meus-agendamentos" onClick={() => setIsMenuOpen(false)} className="text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors py-2">Meus agendamentos</Link>
                <Link to="/comunidade" onClick={() => setIsMenuOpen(false)} className="text-white high-contrast:text-yellow-300 font-bold text-base hover:text-blue-200 high-contrast:hover:text-yellow-100 transition-colors py-2">Comunidade</Link>
              </>
            )}

            {/* Login/Logout */}
            <div className="pt-2 border-t border-blue-400 high-contrast:border-yellow-300">
              {!user ? (
                <Link 
                  to="/login" 
                  className="block w-full bg-[#5c9ded] high-contrast:bg-yellow-300 text-white high-contrast:text-black rounded-lg px-5 py-2 font-bold text-base text-center hover:bg-[#4a7fc5] high-contrast:hover:bg-yellow-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/profile" 
                    className="block w-full bg-[#5c9ded] high-contrast:bg-yellow-300 text-white high-contrast:text-black rounded-lg px-5 py-2 font-bold text-base text-center hover:bg-[#4a7fc5] high-contrast:hover:bg-yellow-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Perfil
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }} 
                    className="w-full bg-red-500 high-contrast:bg-yellow-300 text-white high-contrast:text-black rounded-lg px-5 py-2 font-bold text-base hover:bg-red-700 high-contrast:hover:bg-yellow-400 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MobileNavbar;
