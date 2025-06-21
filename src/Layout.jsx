import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

const Layout = () => {
  return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--text)'}}>
          <Navbar />
          <main>
            <Outlet />
          </main>
          <Footer />
          <ThemeToggle />
      </div>
  );
};

export default Layout;