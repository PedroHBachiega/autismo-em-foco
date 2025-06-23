// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.jsx';
// Mantemos somente um BrowserRouter e um AuthProvider aqui
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GTMProvider } from './context/GTMContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GTMProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </GTMProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
