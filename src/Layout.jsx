import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
<<<<<<< HEAD
import ReadInstructions from './components/ReadInstructions/ReadInstructions';
import ThemeToggle from './components/ThemeToggle';
import HighContrastToggle from './components/HighContrastToggle';
import NotificationManager from './components/NotificationManager/NotificationManager';
import ToastProvider from './components/ToastProvider/ToastProvider';
=======
>>>>>>> origin/main

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
<<<<<<< HEAD
      <ReadInstructions />
      <ThemeToggle />
      <HighContrastToggle />
      <NotificationManager />
      <ToastProvider />
=======
>>>>>>> origin/main
    </>
  );
};

<<<<<<< HEAD
export default Layout;
=======
export default Layout;
>>>>>>> origin/main
