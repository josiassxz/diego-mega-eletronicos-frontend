import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Smartphone, Save, RotateCcw, AlertCircle, CheckCircle, Eye, Edit, Trash2, Plus, Search, Filter, User, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Input, Select, FormGroup } from '../components/ui/Input';
import { theme } from '../styles/theme';
import { aparelhoService } from '../services/aparelhoService';
import { clientService } from '../services/clientService';
import { empresaService } from '../services/empresaService';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.neutral.background};
  display: flex;
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

const Header = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${theme.typography.sizes.h1};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.neutral.text};
  margin: 0 0 ${theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const Subtitle = styled.p`
  color: ${theme.colors.neutral.textSecondary};
  font-size: ${theme.typography.sizes.body};
  margin: 0;
`;

const Alert = styled.div`
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-weight: ${theme.typography.weights.medium};
  
  ${props => props.type === 'success' && `
    background: ${theme.colors.status.successBackground};
    color: ${theme.colors.status.success};
    border: 1px solid ${theme.colors.status.success};
  `}
  
  ${props => props.type === 'error' && `
    background: ${theme.colors.status.errorBackground};
    color: ${theme.colors.status.error};
    border: 1px solid ${theme.colors.status.error};
  `}
  
  ${props => props.type === 'info' && `
    background: ${theme.colors.accent.blueBackground};
    color: ${theme.colors.accent.blue};
    border: 1px solid ${theme.colors.accent.blue};
  `}
`;

const TabContainer = styled.div`
  background: ${theme.colors.neutral.surface};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.large};
  overflow: hidden;
  box-shadow: ${theme.shadows.small};
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.colors.neutral.border};
`;

const TabButton = styled.button`
  flex: 1;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${props => props.$active ? theme.colors.accent.blue : theme.colors.neutral.surface};
  color: ${props => props.$active ? theme.colors.neutral.white : theme.colors.neutral.text};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  font-weight: ${theme.typography.weights.medium};
  
  &:hover {
    background: ${props => props.$active ? theme.colors.accent.blueHover : theme.colors.neutral.surfaceHover};
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

const SectionTitle = styled.h3`
  font-size: ${theme.typography.sizes.h3};
  font-weight: ${theme.typography.weights.semiBold};
  color: ${theme.colors.neutral.text};
  margin: 0 0 ${theme.spacing.lg} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.neutral.border};
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
  
  th, td {
    padding: ${theme.spacing.md};
    text-align: left;
    border-bottom: 1px solid ${theme.colors.neutral.border};
  }
  
  th {
    background: ${theme.colors.neutral.surfaceHover};
    font-weight: ${theme.typography.weights.semiBold};
    color: ${theme.colors.neutral.text};
    font-size: ${theme.typography.sizes.small};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  td {
    color: ${theme.colors.neutral.textSecondary};
    font-size: ${theme.typography.sizes.body};
  }
  
  tbody tr:hover {
    background: ${theme.colors.neutral.surfaceHover};
  }
`;

const StatusBadge = styled.span`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.sizes.small};
  font-weight: ${theme.typography.weights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.status?.toLowerCase()) {
      case 'aprovado':
        return `
          background: ${theme.colors.status.successBackground};
          color: ${theme.colors.status.success};
        `;
      case 'vendido':
        return `
          background: ${theme.colors.accent.blueBackground};
          color: ${theme.colors.accent.blue};
        `;
      case 'pendente':
        return `
          background: ${theme.colors.status.warningBackground};
          color: ${theme.colors.status.warning};
        `;
      case 'cancelado':
        return `
          background: ${theme.colors.status.errorBackground};
          color: ${theme.colors.status.error};
        `;
      default:
        return `
          background: ${theme.colors.neutral.surfaceHover};
          color: ${theme.colors.neutral.textSecondary};
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
`;

const ActionButton = styled.button`
  padding: ${theme.spacing.xs};
  border: none;
  border-radius: ${theme.borderRadius.small};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.edit {
    background: ${theme.colors.accent.blueBackground};
    color: ${theme.colors.accent.blue};
    
    &:hover {
      background: ${theme.colors.accent.blue};
      color: ${theme.colors.neutral.white};
    }
  }
  
  &.delete {
    background: ${theme.colors.status.errorBackground};
    color: ${theme.colors.status.error};
    
    &:hover {
      background: ${theme.colors.status.error};
      color: ${theme.colors.neutral.white};
    }
  }
`;

const EmptyState = styled.div`
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.neutral.textSecondary};
  
  svg {
    margin-bottom: ${theme.spacing.md};
    opacity: 0.5;
  }
  
  p {
    margin: 0;
    font-size: ${theme.typography.sizes.body};
  }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${theme.colors.neutral.border};
  border-top: 4px solid ${theme.colors.accent.blue};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
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
  background: ${props => props.$active ? theme.colors.accent.blue : theme.colors.neutral.surface};
  color: ${props => props.$active ? theme.colors.neutral.white : theme.colors.neutral.text};
  border: 1px solid ${props => props.$active ? theme.colors.accent.blue : theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 36px;

  &:hover:not(:disabled) {
    background: ${props => props.$active ? theme.colors.accent.blue : theme.colors.neutral.surfaceHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ListagemAparelhos = () => {
  const navigate = useNavigate();
  
  const [aparelhos, setAparelhos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
  // Estado de paginação
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0
  });
  
  const [filters, setFilters] = useState({
    imei: '',
    modelo: '',
    marca: '',
    clienteNome: '',
    empresaNome: '',
    status: ''
  });

  useEffect(() => {
    loadAparelhos();
    loadClientes();
    loadEmpresas();
  }, [pagination.page]);

  const loadAparelhos = async () => {
    setLoadingList(true);
    try {
      const params = {
        page: pagination.page,
        size: pagination.size,
        sortBy: 'dataCadastro',
        sortDir: 'DESC'
      };
      
      // Adicionar filtros se estiverem preenchidos
      if (filters.imei) params.imei = filters.imei;
      if (filters.modelo) params.modelo = filters.modelo;
      if (filters.marca) params.marca = filters.marca;
      if (filters.clienteNome) params.clienteNome = filters.clienteNome;
      if (filters.empresaNome) params.empresaNome = filters.empresaNome;
      if (filters.status) params.status = filters.status;
      
      const response = await aparelhoService.buscarComFiltros(params);
      
      // Verificar se a resposta tem estrutura de paginação
      if (response.data.content) {
        setAparelhos(response.data.content);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements
        }));
      } else {
        // Fallback para resposta sem paginação
        setAparelhos(response.data);
        setPagination(prev => ({
          ...prev,
          totalPages: 1,
          totalElements: response.data.length
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar aparelhos:', error);
      setAlert({
        show: true,
        message: 'Erro ao carregar aparelhos',
        type: 'error'
      });
    } finally {
      setLoadingList(false);
    }
  };

  const loadClientes = async () => {
    try {
      const response = await clientService.getAllClientes();
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const loadEmpresas = async () => {
    try {
      const response = await empresaService.getAllEmpresas();
      setEmpresas(response.data);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    }
  };

  // Gerenciar filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Aplicar filtros
  const applyFilters = async () => {
    setPagination(prev => ({ ...prev, page: 0 }));
    loadAparelhos();
  };

  const clearFilters = () => {
    setFilters({
      imei: '',
      modelo: '',
      marca: '',
      clienteNome: '',
      empresaNome: '',
      status: ''
    });
    setPagination(prev => ({ ...prev, page: 0 }));
    loadAparelhos();
  };

  // Editar aparelho
  const handleEdit = (aparelho) => {
    // Redirecionar para a tela de edição específica do aparelho
    navigate(`/editar-aparelho/${aparelho.id}`);
  };

  // Excluir aparelho
  const handleDelete = async (aparelhoId) => {
    if (!window.confirm('Tem certeza que deseja excluir este aparelho?')) {
      return;
    }

    setLoading(true);
    try {
      await aparelhoService.deleteAparelho(aparelhoId);
      setAlert({
        show: true,
        type: 'success',
        message: 'Aparelho excluído com sucesso!'
      });
      loadAparelhos();
    } catch (error) {
      console.error('Erro ao excluir aparelho:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Erro ao excluir aparelho.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Formatar valores monetários
  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Formatar IMEI
  const formatImei = (imei) => {
    if (!imei) return '';
    return imei.replace(/(\d{2})(\d{6})(\d{6})(\d{1})/, '$1 $2 $3 $4');
  };

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Obter nome do cliente
  const getClienteNome = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  // Obter nome da empresa
  const getEmpresaNome = (empresaId) => {
    const empresa = empresas.find(e => e.id === empresaId);
    return empresa ? empresa.razaoSocial : 'Empresa não encontrada';
  };

  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        <Header>
          <div>
            <Title>
              <Smartphone size={28} />
              Gestão de Aparelhos
            </Title>
            <Subtitle>Visualize, edite e gerencie os aparelhos cadastrados</Subtitle>
          </div>
        </Header>

        <Container>
          {alert.show && (
            <Alert type={alert.type}>
              {alert.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {alert.message}
            </Alert>
          )}

          <TabContainer>
            <TabButtons>
              <TabButton $active={true}>
                <Search size={20} />
                Listar Aparelhos
              </TabButton>
            </TabButtons>

            <div style={{ padding: theme.spacing.lg }}>
              <FiltersContainer>
                <SectionTitle>
                  <Filter size={20} />
                  Filtros
                </SectionTitle>
                <FiltersGrid>
                  <FormGroup>
                    <label>IMEI</label>
                    <Input
                      type="text"
                      name="imei"
                      value={filters.imei}
                      onChange={handleFilterChange}
                      placeholder="Filtrar por IMEI"
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Modelo</label>
                    <Input
                      type="text"
                      name="modelo"
                      value={filters.modelo}
                      onChange={handleFilterChange}
                      placeholder="Filtrar por modelo"
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Marca</label>
                    <Input
                      type="text"
                      name="marca"
                      value={filters.marca}
                      onChange={handleFilterChange}
                      placeholder="Filtrar por marca"
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Cliente</label>
                    <Input
                      type="text"
                      name="clienteNome"
                      value={filters.clienteNome}
                      onChange={handleFilterChange}
                      placeholder="Filtrar por nome do cliente"
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Empresa</label>
                    <Input
                      type="text"
                      name="empresaNome"
                      value={filters.empresaNome}
                      onChange={handleFilterChange}
                      placeholder="Filtrar por nome da empresa"
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Status</label>
                    <Select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                    >
                      <option value="">Todos os status</option>
                      <option value="aprovado">Aprovado</option>
                      <option value="vendido">Vendido</option>
                      <option value="pendente">Pendente</option>
                      <option value="cancelado">Cancelado</option>
                    </Select>
                  </FormGroup>
                </FiltersGrid>

                <FilterActions>
                  <Button type="button" onClick={applyFilters} disabled={loadingList}>
                    <Filter size={16} />
                    Aplicar Filtros
                  </Button>
                  <Button type="button" variant="secondary" onClick={clearFilters}>
                    <RotateCcw size={16} />
                    Limpar Filtros
                  </Button>
                </FilterActions>
              </FiltersContainer>

              <TableContainer>
                <TableWrapper>
                  {loadingList ? (
                    <EmptyState>
                      <LoadingSpinner />
                      <p>Carregando aparelhos...</p>
                    </EmptyState>
                  ) : aparelhos.length === 0 ? (
                    <EmptyState>
                      <Search size={48} />
                      <p>Nenhum aparelho encontrado</p>
                    </EmptyState>
                  ) : (
                    <Table>
                      <thead>
                        <tr>
                          <th>IMEI</th>
                          <th>Modelo</th>
                          <th>Marca</th>
                          <th>Cliente</th>
                          <th>Empresa</th>
                          <th>Valor Total</th>
                          <th>Parcelas</th>
                          <th>Data Vencimento</th>
                          <th>Status</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aparelhos.map((aparelho) => (
                          <tr key={aparelho.id}>
                            <td>{formatImei(aparelho.imei)}</td>
                            <td>{aparelho.modelo}</td>
                            <td>{aparelho.marca}</td>
                            <td>{aparelho.clienteNome || 'N/A'}</td>
                            <td>{aparelho.empresaNome || 'N/A'}</td>
                            <td>{formatCurrency(aparelho.valorTotal)}</td>
                            <td>{aparelho.parcelas}x de {formatCurrency(aparelho.valorParcela)}</td>
                            <td>{formatDate(aparelho.dataVencimento)}</td>
                            <td>
                              <StatusBadge status={aparelho.status}>
                                {aparelho.status}
                              </StatusBadge>
                            </td>
                            <td>
                              <ActionButtons>
                                <ActionButton 
                                  className="edit"
                                  onClick={() => handleEdit(aparelho)}
                                  title="Editar aparelho"
                                >
                                  <Edit size={16} />
                                </ActionButton>
                                <ActionButton 
                                  className="delete"
                                  onClick={() => handleDelete(aparelho.id)}
                                  title="Excluir aparelho"
                                >
                                  <Trash2 size={16} />
                                </ActionButton>
                              </ActionButtons>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </TableWrapper>
                
                {/* Paginação */}
                {aparelhos.length > 0 && (
                  <PaginationContainer>
                    <PaginationInfo>
                      Mostrando {pagination.page * pagination.size + 1} - {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} de {pagination.totalElements} aparelhos
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
                              $active={pagination.page === index}
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
            </div>
          </TabContainer>

          {loading && (
            <LoadingOverlay>
              <LoadingSpinner />
            </LoadingOverlay>
          )}
        </Container>
      </MainContent>
    </PageContainer>
  );
};

export default ListagemAparelhos;