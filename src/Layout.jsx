import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ReadInstructions from './components/ReadInstructions/ReadInstructions';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <ReadInstructions />
      <Footer />
    </>
  );
};

export default Layout;