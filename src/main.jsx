// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Mantemos somente um BrowserRouter e um AuthProvider aqui
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GTMProvider } from './context/GTMContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* 3) GTMProvider para rastreamento de eventos */}
        <GTMProvider>
          <App />
        </GTMProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
