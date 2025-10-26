
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { theme } from './styles/theme';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CadastroCliente from './pages/CadastroCliente';
import EditarCliente from './pages/EditarCliente';
import ClienteDetalhes from './pages/ClienteDetalhes';
import CadastroEmpresas from './pages/CadastroEmpresas';
import CadastroAparelhos from './pages/CadastroAparelhos';
import EditarAparelho from './pages/EditarAparelho';
import CadastroVendedores from './pages/CadastroVendedores';

function App() {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  // Componente para proteger rotas que requerem perfil admin
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    if (!isAdmin()) {
      return <Navigate to="/dashboard" />;
    }
    return children;
  };

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: theme.colors.gradient.background,
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
        element={<ProtectedRoute><ClienteDetalhes /></ProtectedRoute>} 
      />
      <Route 
        path="/editar-cliente/:id" 
        element={<ProtectedRoute><EditarCliente /></ProtectedRoute>} 
      />
      <Route 
        path="/cadastro-empresas" 
        element={<ProtectedRoute><CadastroEmpresas /></ProtectedRoute>} 
      />
      <Route 
        path="/cadastro-aparelhos" 
        element={<ProtectedRoute><CadastroAparelhos /></ProtectedRoute>} 
      />
      <Route 
        path="/cadastro-aparelhos/:id" 
        element={<ProtectedRoute><CadastroAparelhos /></ProtectedRoute>} 
      />
      <Route 
        path="/editar-aparelho/:id" 
        element={<ProtectedRoute><EditarAparelho /></ProtectedRoute>} 
      />
      <Route 
        path="/cadastro-vendedores" 
        element={<ProtectedRoute><CadastroVendedores /></ProtectedRoute>} 
      />
    </Routes>
  );
}

export default App;
