import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Comunidade from './pages/Comunidade/Comunidade'
import Sobre from './pages/Sobre/Sobre'
import SobreAutismo from './pages/SobreAutismo/SobreAutismo'
import Tratamentos from './pages/Tratamentos/Tratamentos'
import Leisedireitos from './pages/Leisedireitos/Leisedireitos'
import Eventos from './pages/Eventos/Eventos'
import Layout from './Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/Login" element={
          <Layout>
            <Login />
          </Layout>
        } />
        <Route path="/Register" element={
          <Layout>
            <Register />
          </Layout>
        } />
        <Route path="/Comunidade" element={
          <Layout>
            <Comunidade />
          </Layout>
        } />
        <Route path="/Sobre" element={
          <Layout>
            <Sobre />
          </Layout>
        } />
         <Route path="/SobreAutismo" element={
          <Layout>
            <SobreAutismo />
          </Layout>
        } />
         <Route path="/Tratamentos" element={
          <Layout>
            <Tratamentos />
          </Layout>
        } />
         <Route path="/Leisedireitos" element={
          <Layout>
            <Leisedireitos />
          </Layout>
        } />
                 <Route path="/Eventos" element={
          <Layout>
            <Eventos />
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
