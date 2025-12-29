import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartoesProvider } from './contextos/CartoesContext';
import Layout from './componentes/layout/Layout';
import Dashboard from './paginas/Dashboard';
import Funcionarios from './paginas/Funcionarios';
import CriarCartao from './paginas/CriarCartao';
import Configuracoes from './paginas/Configuracoes';
import Ajuda from './paginas/Ajuda';
import './App.css';

function App() {
  return (
    <CartoesProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/criar" element={<CriarCartao />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/ajuda" element={<Ajuda />} />
        </Routes>
      </Layout>
    </CartoesProvider>
  );
}

export default App;
