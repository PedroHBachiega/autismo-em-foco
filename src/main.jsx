// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Mantemos somente um BrowserRouter e um AuthProvider aqui
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1) BrowserRouter define todo o contexto de rota */}
    <BrowserRouter>
      {/* 2) AuthProvider fica dentro do Router, pois precisa de useNavigate/useLocation */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
