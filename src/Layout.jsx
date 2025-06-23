import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ReadInstructions from './components/ReadInstructions/ReadInstructions';
import ThemeToggle from './components/ThemeToggle';
import NotificationManager from './components/NotificationManager/NotificationManager';
import ToastProvider from './components/ToastProvider/ToastProvider';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ReadInstructions />
      <ThemeToggle />
      <NotificationManager />
      <ToastProvider />
    </>
  );
};

export default Layout;