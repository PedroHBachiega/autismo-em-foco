import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthentication } from '../Hooks/UseAuthentication';
import logotipoImage from '../assets/logotipo.png';

const MobileNavbar = () => {
  const { user, logout } = useAuthentication();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#2361ad] px-4 py-2 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center font-bold text-white text-xl">
          <Link to="/">
            <img src={logotipoImage} alt="logotipo" className="w-24 h-auto" />
          </Link>
        </div>
        <button 
          onClick={toggleMenu} 
          className="text-white focus:outline-none"
          aria-label="Menu"
        >
          {isMenuOpen ? (
            // Ícone X quando o menu está aberto
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Ícone de hambúrguer quando o menu está fechado
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Menu dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#2361ad] shadow-lg z-50 transition-all duration-300 ease-in-out">
          <div className="flex flex-col py-2 px-4 space-y-3">
            <Link 
              to="/" 
              className="text-white font-bold text-base hover:text-blue-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/sobreautismo" 
              className="text-white font-bold text-base hover:text-blue-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              O que é o autismo?
            </Link>
            <Link 
              to="/leisedireitos" 
              className="text-white font-bold text-base hover:text-blue-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Leis e direitos
            </Link>
            <Link 
              to="/eventos" 
              className="text-white font-bold text-base hover:text-blue-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Eventos
            </Link>
            <Link 
              to="/tratamentos" 
              className="text-white font-bold text-base hover:text-blue-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Tratamento
            </Link>
            <Link 
              to="/agendamento" 
              className="text-white font-bold text-base hover:text-blue-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Agendamento
            </Link>
            <Link 
              to="/comunidade" 
              className="text-white font-bold text-base hover:text-blue-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Comunidade
            </Link>
            
            {/* Botões de autenticação */}
            <div className="pt-2 border-t border-blue-400">
              {!user ? (
                <Link 
                  to="/login" 
                  className="block w-full bg-[#5c9ded] text-white rounded-lg px-5 py-2 font-bold text-base text-center hover:bg-[#4a7fc5] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/profile" 
                    className="block w-full bg-[#5c9ded] text-white rounded-lg px-5 py-2 font-bold text-base text-center hover:bg-[#4a7fc5] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Perfil
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }} 
                    className="w-full bg-red-500 text-white rounded-lg px-5 py-2 font-bold text-base hover:bg-red-700 transition-colors"
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