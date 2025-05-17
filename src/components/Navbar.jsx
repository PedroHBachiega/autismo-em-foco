import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-[#2361ad] px-8 py-2 h-14">
      <div className="flex items-center font-bold text-white text-2xl font-[\'Arial Rounded MT Bold\']">
        <span className="mr-1">autism</span>
        <span className="text-xl mx-0.5" style={{ color: '#f44336' }}>•</span>
        <span className="text-xl mx-0.5" style={{ color: '#4caf50' }}>•</span>
        <span className="text-xl mx-0.5" style={{ color: '#2196f3' }}>•</span>
        <span className="text-base italic ml-2 font-normal">em foco</span>
      </div>
      <div className="flex gap-4">
        <Link to="/Home" className="text-white font-bold text-base hover:text-blue-200 transition-colors">Home</Link>
        <Link to="/SobreAutismo" className="text-white font-bold text-base hover:text-blue-200 transition-colors">O que é o autismo?</Link>
        <Link to="/Leisedireitos" className="text-white font-bold text-base hover:text-blue-200 transition-colors">Leis e direitos</Link>
        <Link to="/Eventos" className="text-white font-bold text-base hover:text-blue-200 transition-colors">Eventos</Link>
        <Link to="/Tratamentos" className="text-white font-bold text-base hover:text-blue-200 transition-colors">Tratamento</Link>
        <Link to="/Agendamento" className="text-white font-bold text-base hover:text-blue-200 transition-colors">Agendamento</Link>
        <Link to="/Sobre" className="text-white font-bold text-base hover:text-blue-200 transition-colors">Sobre nós</Link>
      </div>
      <div>
        <Link to="/Login" className="bg-[#5c9ded] text-white rounded-lg px-5 py-1 font-bold text-base hover:bg-[#2361ad] hover:border hover:border-white transition-colors">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar; 