import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Search, 
  Download, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Filter,
  Eye,
  Edit
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { clientService } from '../services/clientService';
import Sidebar from '../components/Sidebar';
import { Container } from '../components/ui/Container';
import { Button, IconButton } from '../components/ui/Button';
import { Input, Select, FormGroup } from '../components/ui/Input';
import { StatCard, StatValue, StatLabel } from '../components/ui/Card';
import { theme } from '../styles/theme';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.neutral.background};
  display: flex;
`;

const Header = styled.header`
  background: ${theme.colors.neutral.surface};
  border-bottom: 1px solid ${theme.colors.neutral.border};
  padding: ${theme.spacing.md} 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${theme.shadows.small};
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Logo = styled.h1`
  font-size: ${theme.typography.sizes.h2};
  font-weight: ${theme.typography.weights.bold};
  background: ${theme.colors.gradient.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 280px;
  padding: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    margin-left: 0;
    padding: ${theme.spacing.lg};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const FiltersContainer = styled.div`
  background: ${theme.colors.neutral.surface};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.small};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

const FilterActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const TableContainer = styled.div`
  background: ${theme.colors.neutral.surface};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.large};
  overflow: hidden;
  box-shadow: ${theme.shadows.small};
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
  
  thead {
    background: ${theme.colors.neutral.surfaceHover};
  }
  
  th {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    text-align: left;
    font-weight: ${theme.typography.weights.semiBold};
    color: ${theme.colors.neutral.text};
    font-size: ${theme.typography.sizes.small};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid ${theme.colors.neutral.border};
    white-space: nowrap;
    
    &:nth-child(1) { min-width: 200px; } /* Nome */
    &:nth-child(2) { min-width: 150px; } /* Email */
    &:nth-child(3) { min-width: 120px; } /* Telefone */
    &:nth-child(4) { min-width: 120px; } /* Status */
    &:nth-child(5) { min-width: 120px; } /* Data */
    &:nth-child(6) { min-width: 100px; } /* Ações */
  }
  
  td {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    color: ${theme.colors.neutral.textSecondary};
    border-bottom: 1px solid ${theme.colors.neutral.borderLight};
    white-space: nowrap;
    
    &:nth-child(1) { min-width: 200px; }
    &:nth-child(2) { min-width: 150px; }
    &:nth-child(3) { min-width: 120px; }
    &:nth-child(4) { min-width: 120px; }
    &:nth-child(5) { min-width: 120px; }
    &:nth-child(6) { min-width: 100px; }
  }
  
  tbody tr {
    transition: all 0.3s ease;
    
    &:hover {
      background: ${theme.colors.neutral.surfaceHover};
    }
  }
`;

const StatusBadge = styled.span`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.pill};
  font-size: ${theme.typography.sizes.small};
  font-weight: ${theme.typography.weights.medium};
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  min-width: fit-content;
  
  ${props => {
    switch(props.status) {
      case 'Pendente':
        return `
          background: ${theme.colors.status.warningLight};
          color: ${theme.colors.status.warning};
        `;
      case 'Aprovado':
        return `
          background: ${theme.colors.status.successLight};
          color: ${theme.colors.status.success};
        `;
      case 'Recusado':
        return `
          background: ${theme.colors.status.errorLight};
          color: ${theme.colors.status.error};
        `;
      case 'Em Análise':
        return `
          background: ${theme.colors.status.infoLight};
          color: ${theme.colors.status.info};
        `;
      case 'Vendido':
        return `
          background: ${theme.colors.accent.blueLight};
          color: ${theme.colors.accent.blue};
        `;
      default:
        return `
          background: ${theme.colors.neutral.surfaceHover};
          color: ${theme.colors.neutral.textMuted};
        `;
    }
  }}
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.neutral.border};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${theme.spacing.md};
  }
`;

const PaginationInfo = styled.div`
  color: ${theme.colors.neutral.textSecondary};
  font-size: ${theme.typography.sizes.small};
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
  align-items: center;
`;

const PageButton = styled.button`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${props => props.active ? theme.colors.accent.blue : theme.colors.neutral.surface};
  border: 1px solid ${props => props.active ? theme.colors.accent.blue : theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.medium};
  color: ${props => props.active ? theme.colors.neutral.surface : theme.colors.neutral.text};
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 36px;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? theme.colors.accent.blueHover : theme.colors.neutral.surfaceHover};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  padding: ${theme.spacing.xxl};
  text-align: center;
  color: ${theme.colors.neutral.textMuted};

  svg {
    margin-bottom: ${theme.spacing.md};
    opacity: 0.5;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
  align-items: center;
`;

const ActionButton = styled.button`
  padding: ${theme.spacing.xs};
  background: ${theme.colors.neutral.surface};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.medium};
  color: ${theme.colors.neutral.text};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;

  &:hover {
    background: ${theme.colors.neutral.surfaceHover};
    transform: translateY(-1px);
  }

  &.view {
    &:hover {
      background: ${theme.colors.status.infoLight};
      border-color: ${theme.colors.status.info};
      color: ${theme.colors.status.info};
    }
  }

  &.edit {
    &:hover {
      background: ${theme.colors.status.successLight};
      border-color: ${theme.colors.status.success};
      color: ${theme.colors.status.success};
    }
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.neutral.overlay};
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${theme.colors.neutral.border};
  border-top-color: ${theme.colors.accent.blue};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados de dados
  const [estatisticas, setEstatisticas] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0
  });
  
  // Estados de filtros
  const [filtros, setFiltros] = useState({
    nome: '',
    email: '',
    cpf: '',
    whatsapp: '',
    status: '',
    dataInicio: '',
    dataFim: ''
  });
  
  const [filtrosAtivos, setFiltrosAtivos] = useState(false);
  
  useEffect(() => {
    loadEstatisticas();
    loadClientes();
  }, [pagination.page]);
  
  const loadEstatisticas = async () => {
    try {
      const data = await clientService.getEstatisticas();
      setEstatisticas(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };
  
  const loadClientes = async () => {
    setRefreshing(true);
    try {
      const params = {
        page: pagination.page,
        size: pagination.size,
        sortBy: 'dataCadastro',
        sortDir: 'DESC'
      };
      
      // Adicionar filtros se estiverem preenchidos
      if (filtros.nome) params.nome = filtros.nome;
      if (filtros.email) params.email = filtros.email;
      if (filtros.cpf) params.cpf = filtros.cpf.replace(/\D/g, '');
      if (filtros.whatsapp) params.whatsapp = filtros.whatsapp.replace(/\D/g, '');
      if (filtros.status) params.status = filtros.status;
      if (filtros.dataInicio) params.dataInicio = new Date(filtros.dataInicio).toISOString();
      if (filtros.dataFim) params.dataFim = new Date(filtros.dataFim).toISOString();
      
      const response = await clientService.getClientesPaginado(params);
      setClientes(response.content);
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages,
        totalElements: response.totalElements
      }));
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const aplicarFiltros = () => {
    setPagination(prev => ({ ...prev, page: 0 }));
    loadClientes();
    setFiltrosAtivos(true);
  };
  
  const limparFiltros = () => {
    setFiltros({
      nome: '',
      email: '',
      cpf: '',
      whatsapp: '',
      status: '',
      dataInicio: '',
      dataFim: ''
    });
    setFiltrosAtivos(false);
    setPagination(prev => ({ ...prev, page: 0 }));
    setTimeout(loadClientes, 100);
  };
  
  const atualizarStatus = async (id, novoStatus) => {
    try {
      await clientService.updateStatus(id, novoStatus);
      loadClientes();
      loadEstatisticas();
      alert('Status atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const visualizarCliente = (cliente) => {
    navigate(`/cliente/${cliente.id}`);
  };

  const editarCliente = (cliente) => {
    navigate(`/cliente/${cliente.id}/editar`);
  };


  
  const exportarCSV = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtros.nome) params.nome = filtros.nome;
      if (filtros.email) params.email = filtros.email;
      if (filtros.cpf) params.cpf = filtros.cpf.replace(/\D/g, '');
      if (filtros.whatsapp) params.whatsapp = filtros.whatsapp.replace(/\D/g, '');
      if (filtros.status) params.status = filtros.status;
      if (filtros.dataInicio) params.dataInicio = new Date(filtros.dataInicio).toISOString();
      if (filtros.dataFim) params.dataFim = new Date(filtros.dataFim).toISOString();
      
      await clientService.exportarCSV(params);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      alert('Erro ao exportar CSV');
    } finally {
      setLoading(false);
    }
  };
  
  const formatarData = (dataString) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };
  
  const formatarDataHora = (dataString) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR');
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pendente':
        return <Clock size={14} />;
      case 'Aprovado':
        return <CheckCircle size={14} />;
      case 'Recusado':
        return <XCircle size={14} />;
      case 'Em Análise':
        return <AlertCircle size={14} />;
      default:
        return null;
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleRefresh = () => {
    loadEstatisticas();
    loadClientes();
  };
  
  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        <Container>
          {/* Cards de Estatísticas */}
          <StatsGrid>
            <StatCard>
              <Users size={32} color={theme.colors.accent.blue} />
              <StatValue>{estatisticas?.totalClientes || 0}</StatValue>
              <StatLabel>Total de Clientes</StatLabel>
            </StatCard>
            
            <StatCard>
              <TrendingUp size={32} color={theme.colors.status.success} />
              <StatValue>{estatisticas?.clientesHoje || 0}</StatValue>
              <StatLabel>Novos Hoje</StatLabel>
            </StatCard>
            
            <StatCard>
              <Clock size={32} color={theme.colors.status.warning} />
              <StatValue>{estatisticas?.clientesPendentes || 0}</StatValue>
              <StatLabel>Pendentes</StatLabel>
            </StatCard>
            
            <StatCard>
              <CheckCircle size={32} color={theme.colors.status.success} />
              <StatValue>{estatisticas?.clientesAprovados || 0}</StatValue>
              <StatLabel>Aprovados</StatLabel>
            </StatCard>
          </StatsGrid>
          
          {/* Filtros */}
          <FiltersContainer>
            <FiltersGrid>
              <FormGroup>
                <Input
                  name="nome"
                  value={filtros.nome}
                  onChange={handleFilterChange}
                  placeholder="Buscar por nome..."
                />
              </FormGroup>
              
              <FormGroup>
                <Input
                  name="email"
                  value={filtros.email}
                  onChange={handleFilterChange}
                  placeholder="Buscar por email..."
                />
              </FormGroup>
              
              <FormGroup>
                <Select
                  name="status"
                  value={filtros.status}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos os status</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Em Análise">Em Análise</option>
                  <option value="Aprovado">Aprovado</option>
                  <option value="Recusado">Recusado</option>
                  <option value="Vendido">Vendido</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Input
                  name="dataInicio"
                  type="date"
                  value={filtros.dataInicio}
                  onChange={handleFilterChange}
                  placeholder="Data inicial"
                />
              </FormGroup>
              
              <FormGroup>
                <Input
                  name="dataFim"
                  type="date"
                  value={filtros.dataFim}
                  onChange={handleFilterChange}
                  placeholder="Data final"
                />
              </FormGroup>
            </FiltersGrid>
            
            <FilterActions>
              <Button variant="secondary" onClick={limparFiltros}>
                Limpar Filtros
              </Button>
              <Button variant="primary" onClick={aplicarFiltros}>
                <Filter size={20} />
                Aplicar Filtros
              </Button>
              <Button variant="primary" onClick={exportarCSV}>
                <Download size={20} />
                Exportar CSV
              </Button>
            </FilterActions>
          </FiltersContainer>
          
          {/* Tabela de Clientes */}
          <TableContainer>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Email</th>
                    <th>WhatsApp</th>
                    <th>Data Cadastro</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.length === 0 ? (
                    <tr>
                      <td colSpan="7">
                        <EmptyState>
                          <Users size={48} />
                          <p>Nenhum cliente encontrado</p>
                        </EmptyState>
                      </td>
                    </tr>
                  ) : (
                    clientes.map(cliente => (
                      <tr key={cliente.id}>
                        <td>{cliente.nome}</td>
                        <td>{cliente.cpf}</td>
                        <td>{cliente.email}</td>
                        <td>{cliente.whatsapp}</td>
                        <td>{formatarDataHora(cliente.dataCadastro)}</td>
                        <td>
                          <StatusBadge status={cliente.status}>
                            {getStatusIcon(cliente.status)}
                            {cliente.status}
                          </StatusBadge>
                        </td>
                        <td>
                          <ActionButtons>
                            <ActionButton 
                              className="view"
                              onClick={() => visualizarCliente(cliente)}
                              title="Visualizar cliente"
                            >
                              <Eye size={16} />
                            </ActionButton>
                            <ActionButton 
                              className="edit"
                              onClick={() => editarCliente(cliente)}
                              title="Editar cliente"
                            >
                              <Edit size={16} />
                            </ActionButton>
                            <Select
                              value={cliente.status}
                              onChange={(e) => atualizarStatus(cliente.id, e.target.value)}
                              style={{ minWidth: '120px', marginLeft: '8px' }}
                            >
                              <option value="Pendente">Pendente</option>
                              <option value="Em Análise">Em Análise</option>
                              <option value="Aprovado">Aprovado</option>
                              <option value="Recusado">Recusado</option>
                              <option value="Vendido">Vendido</option>
                            </Select>
                          </ActionButtons>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </TableWrapper>
            
            {/* Paginação */}
            {clientes.length > 0 && (
              <PaginationContainer>
                <PaginationInfo>
                  Mostrando {pagination.page * pagination.size + 1} - {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} de {pagination.totalElements} clientes
                </PaginationInfo>
                
                <PaginationButtons>
                  <PageButton
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 0}
                  >
                    <ChevronLeft size={20} />
                  </PageButton>
                  
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    // Mostrar apenas 5 páginas por vez
                    if (
                      index === 0 ||
                      index === pagination.totalPages - 1 ||
                      (index >= pagination.page - 1 && index <= pagination.page + 1)
                    ) {
                      return (
                        <PageButton
                          key={index}
                          active={pagination.page === index}
                          onClick={() => setPagination(prev => ({ ...prev, page: index }))}
                        >
                          {index + 1}
                        </PageButton>
                      );
                    } else if (index === pagination.page - 2 || index === pagination.page + 2) {
                      return <span key={index} style={{ color: theme.colors.neutral.textMuted }}>...</span>;
                    }
                    return null;
                  })}
                  
                  <PageButton
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages - 1}
                  >
                    <ChevronRight size={20} />
                  </PageButton>
                </PaginationButtons>
              </PaginationContainer>
            )}
          </TableContainer>
        </Container>
      </MainContent>
      
      {(loading || refreshing) && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      

    </PageContainer>
  );
};

export default Dashboard;
