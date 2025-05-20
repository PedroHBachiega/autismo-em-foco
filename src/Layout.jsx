import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/footer';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;