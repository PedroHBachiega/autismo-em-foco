import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { usePageTracking } from './Hooks/usePageTracking';

const Layout = () => {
  // Rastreia mudanças de página
  usePageTracking();
  
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;