
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CadastroCliente from './pages/CadastroCliente';
import EditarCliente from './pages/EditarCliente';
import ClienteDetalhes from './pages/ClienteDetalhes';

function App() {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0D0A1F 0%, #1A0F2E 30%, #2D1B3D 60%, #7A1E1C 90%, #B22A1F 100%)',
        color: 'white',
        fontSize: '18px'
      }}>
        Carregando...
      </div>
    );
  }

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/cadastro-cliente" element={<CadastroCliente />} />
      
      {/* Rota de Login */}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
      />
      
      {/* Rotas Protegidas (apenas para usuários logados) */}
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/cliente/:id" 
        element={isAuthenticated ? <ClienteDetalhes /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/cliente/:id/editar" 
        element={isAuthenticated ? <ClienteDetalhes /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/editar-cliente/:id" 
        element={isAuthenticated ? <EditarCliente /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
}

export default App;
