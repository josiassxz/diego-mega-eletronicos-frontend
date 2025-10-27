import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Users, Save, RotateCcw, AlertCircle, CheckCircle, Eye, Edit, Trash2, Plus, Search, Filter, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Input, Select, FormGroup } from '../components/ui/Input';
import { theme } from '../styles/theme';
import vendedorService from '../services/vendedorService';

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

const FormContainer = styled.div`
  background: ${theme.colors.neutral.surface};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  border: 1px solid ${theme.colors.neutral.border};
  box-shadow: ${theme.shadows.small};
`;

const FormTitle = styled.h2`
  font-size: ${theme.typography.sizes.h3};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.neutral.text};
  margin: 0 0 ${theme.spacing.lg} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const ListContainer = styled.div`
  background: ${theme.colors.neutral.surface};
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid ${theme.colors.neutral.border};
  box-shadow: ${theme.shadows.small};
`;

const ListHeader = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.neutral.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
`;

const ListTitle = styled.h3`
  font-size: ${theme.typography.sizes.h4};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.neutral.text};
  margin: 0;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${theme.colors.neutral.backgroundSecondary};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.neutral.border};
  
  &:hover {
    background: ${theme.colors.neutral.backgroundSecondary};
  }
`;

const TableHeaderCell = styled.th`
  padding: ${theme.spacing.md};
  text-align: left;
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.neutral.text};
  font-size: ${theme.typography.sizes.small};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: ${theme.spacing.md};
  color: ${theme.colors.neutral.text};
  font-size: ${theme.typography.sizes.body};
`;

const StatusBadge = styled.span`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.sizes.small};
  font-weight: ${theme.typography.weights.medium};
  text-transform: uppercase;
  
  ${props => props.status === 'ATIVO' && `
    background: ${theme.colors.status.success}20;
    color: ${theme.colors.status.success};
  `}
  
  ${props => props.status === 'INATIVO' && `
    background: ${theme.colors.status.error}20;
    color: ${theme.colors.status.error};
  `}
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
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'view' && `
    background: ${theme.colors.accent.blue}20;
    color: ${theme.colors.accent.blue};
    
    &:hover {
      background: ${theme.colors.accent.blue}30;
    }
  `}
  
  ${props => props.variant === 'edit' && `
    background: ${theme.colors.accent.yellow}20;
    color: ${theme.colors.accent.yellow};
    
    &:hover {
      background: ${theme.colors.accent.yellow}30;
    }
  `}
  
  ${props => props.variant === 'delete' && `
    background: ${theme.colors.status.error}20;
    color: ${theme.colors.status.error};
    
    &:hover {
      background: ${theme.colors.status.error}30;
    }
  `}
`;

const Pagination = styled.div`
  padding: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.neutral.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PaginationInfo = styled.span`
  color: ${theme.colors.neutral.textSecondary};
  font-size: ${theme.typography.sizes.small};
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const Message = styled.div`
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  ${props => props.type === 'success' && `
    background: ${theme.colors.status.success}20;
    color: ${theme.colors.status.success};
    border: 1px solid ${theme.colors.status.success}40;
  `}
  
  ${props => props.type === 'error' && `
    background: ${theme.colors.status.error}20;
    color: ${theme.colors.status.error};
    border: 1px solid ${theme.colors.status.error}40;
  `}
`;

const CadastroVendedores = () => {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingVendedor, setEditingVendedor] = useState(null);
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: ''
  });
  
  // Estados de filtro e paginação
  const [filtros, setFiltros] = useState({
    nome: '',
    cpf: '',
    status: ''
  });
  
  const [paginacao, setPaginacao] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  useEffect(() => {
    carregarVendedores();
  }, [paginacao.page, paginacao.size, filtros]);

  const carregarVendedores = async () => {
    try {
      setLoading(true);
      const params = {
        page: paginacao.page,
        size: paginacao.size,
        ...filtros
      };
      
      const response = await vendedorService.filtrar(params);
      setVendedores(response.data.content);
      setPaginacao(prev => ({
        ...prev,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages
      }));
    } catch (error) {
      showMessage('error', 'Erro ao carregar vendedores');
      console.error('Erro ao carregar vendedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const copyReferralLink = async (vendedor) => {
    try {
      // Remove pontos e traços do CPF
      const cpfLimpo = vendedor.cpf.replace(/[.-]/g, '');
      
      // Constrói o link de referência
      const baseUrl = window.location.origin;
      const referralLink = `${baseUrl}/cadastro-cliente?referer=${cpfLimpo}`;
      
      // Copia para a área de transferência
      await navigator.clipboard.writeText(referralLink);
      
      showMessage('success', `Link de referência copiado para ${vendedor.nome}!`);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      showMessage('error', 'Erro ao copiar link de referência');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      const cpfFormatado = vendedorService.formatarCpf(value);
      setFormData(prev => ({ ...prev, [name]: cpfFormatado }));
    } else if (name === 'nome') {
      // Não formatar durante a digitação para permitir espaços
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === 'email') {
      setFormData(prev => ({ ...prev, [name]: value.toLowerCase() }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
    setPaginacao(prev => ({ ...prev, page: 0 }));
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      showMessage('error', 'Nome é obrigatório');
      return false;
    }
    
    if (!vendedorService.validarNome(formData.nome)) {
      showMessage('error', 'Nome deve conter apenas letras e espaços');
      return false;
    }
    
    if (!formData.cpf.trim()) {
      showMessage('error', 'CPF é obrigatório');
      return false;
    }
    
    if (!vendedorService.validarCpf(formData.cpf)) {
      showMessage('error', 'CPF inválido');
      return false;
    }
    
    if (!formData.email.trim()) {
      showMessage('error', 'Email é obrigatório');
      return false;
    }
    
    if (!vendedorService.validarEmail(formData.email)) {
      showMessage('error', 'Email inválido');
      return false;
    }
    
    if (!formData.senha.trim()) {
      showMessage('error', 'Senha é obrigatória');
      return false;
    }
    
    if (!vendedorService.validarSenha(formData.senha)) {
      showMessage('error', 'Senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const vendedorData = {
        nome: vendedorService.formatarNome(formData.nome),
        cpf: vendedorService.limparCpf(formData.cpf),
        email: formData.email.trim(),
        senha: formData.senha
      };
      
      if (editingVendedor) {
        await vendedorService.atualizar(editingVendedor.id, vendedorData);
        showMessage('success', 'Vendedor atualizado com sucesso!');
        setEditingVendedor(null);
      } else {
        await vendedorService.criar(vendedorData);
        showMessage('success', 'Vendedor cadastrado com sucesso!');
      }
      
      resetForm();
      carregarVendedores();
    } catch (error) {
      const errorMessage = error.response?.data?.erro || 'Erro ao salvar vendedor';
      showMessage('error', errorMessage);
      console.error('Erro ao salvar vendedor:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', cpf: '', email: '', senha: '' });
    setEditingVendedor(null);
  };

  const handleEdit = (vendedor) => {
    setFormData({
      nome: vendedor.nome,
      cpf: vendedor.cpf,
      email: vendedor.email || '',
      senha: '' // Não preencher senha por segurança
    });
    setEditingVendedor(vendedor);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este vendedor?')) {
      return;
    }
    
    try {
      setLoading(true);
      await vendedorService.deletar(id);
      showMessage('success', 'Vendedor excluído com sucesso!');
      carregarVendedores();
    } catch (error) {
      const errorMessage = error.response?.data?.erro || 'Erro ao excluir vendedor';
      showMessage('error', errorMessage);
      console.error('Erro ao excluir vendedor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, novoStatus) => {
    try {
      setLoading(true);
      await vendedorService.atualizarStatus(id, novoStatus);
      showMessage('success', `Status alterado para ${novoStatus} com sucesso!`);
      carregarVendedores();
    } catch (error) {
      const errorMessage = error.response?.data?.erro || 'Erro ao alterar status';
      showMessage('error', errorMessage);
      console.error('Erro ao alterar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPaginacao(prev => ({ ...prev, page: newPage }));
  };

  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        <Header>
          <Title>
            <Users size={32} />
            Gestão de Vendedores
          </Title>
          <Subtitle>
            Cadastre e gerencie os vendedores da sua empresa
          </Subtitle>
        </Header>

        {message.text && (
          <Message type={message.type}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </Message>
        )}

        <FormContainer>
          <FormTitle>
            <Plus size={20} />
            {editingVendedor ? 'Editar Vendedor' : 'Novo Vendedor'}
          </FormTitle>
          
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <label>Nome Completo *</label>
                <Input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Digite o nome completo"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <label>CPF *</label>
                <Input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                  maxLength="14"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <label>Email *</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Digite o email"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <label>Senha *</label>
                <Input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  placeholder="Digite a senha (mín. 6 caracteres)"
                  minLength="6"
                  required
                />
              </FormGroup>
            </FormGrid>
            
            <ButtonGroup>
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
                disabled={loading}
              >
                <RotateCcw size={16} />
                Limpar
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                <Save size={16} />
                {editingVendedor ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </ButtonGroup>
          </form>
        </FormContainer>

        <ListContainer>
          <ListHeader>
            <ListTitle>Lista de Vendedores</ListTitle>
            
            <FilterContainer>
              <Input
                type="text"
                name="nome"
                value={filtros.nome}
                onChange={handleFilterChange}
                placeholder="Buscar por nome"
                style={{ width: '200px' }}
              />
              
              <Input
                type="text"
                name="cpf"
                value={filtros.cpf}
                onChange={handleFilterChange}
                placeholder="Buscar por CPF"
                style={{ width: '150px' }}
              />
              
              <Select
                name="status"
                value={filtros.status}
                onChange={handleFilterChange}
                style={{ width: '120px' }}
              >
                <option value="">Todos</option>
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
              </Select>
            </FilterContainer>
          </ListHeader>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Nome</TableHeaderCell>
                <TableHeaderCell>CPF</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Data Cadastro</TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {vendedores.map((vendedor) => (
                <TableRow key={vendedor.id}>
                  <TableCell>{vendedor.nome}</TableCell>
                  <TableCell>{vendedor.cpf}</TableCell>
                  <TableCell>{vendedor.email}</TableCell>
                  <TableCell>
                    <StatusBadge status={vendedor.status}>
                      {vendedor.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    {new Date(vendedor.dataCadastro).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <ActionButtons>
                      <ActionButton
                        variant="edit"
                        onClick={() => handleEdit(vendedor)}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </ActionButton>
                      
                      <ActionButton
                        variant="delete"
                        onClick={() => handleDelete(vendedor.id)}
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </ActionButton>

                      <ActionButton
                        variant="copy"
                        onClick={() => copyReferralLink(vendedor)}
                        title="Copiar link de referência"
                        style={{ 
                          background: theme.colors.primary.main,
                          color: 'green'
                        }}
                      >
                        <Copy size={16} />
                      </ActionButton>
                      
                      <Select
                        value={vendedor.status}
                        onChange={(e) => handleStatusChange(vendedor.id, e.target.value)}
                        style={{ marginLeft: '8px', fontSize: '12px', padding: '4px' }}
                      >
                        <option value="ATIVO">Ativo</option>
                        <option value="INATIVO">Inativo</option>
                      </Select>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          
          {vendedores.length === 0 && !loading && (
            <div style={{ padding: theme.spacing.xl, textAlign: 'center', color: theme.colors.neutral.textSecondary }}>
              Nenhum vendedor encontrado
            </div>
          )}
          
          <Pagination>
            <PaginationInfo>
              Mostrando {vendedores.length} de {paginacao.totalElements} vendedores
            </PaginationInfo>
            
            <PaginationButtons>
              <Button
                variant="secondary"
                size="small"
                onClick={() => handlePageChange(paginacao.page - 1)}
                disabled={paginacao.page === 0 || loading}
              >
                <ChevronLeft size={16} />
                Anterior
              </Button>
              
              <span style={{ padding: '0 16px', color: theme.colors.neutral.textSecondary }}>
                Página {paginacao.page + 1} de {paginacao.totalPages}
              </span>
              
              <Button
                variant="secondary"
                size="small"
                onClick={() => handlePageChange(paginacao.page + 1)}
                disabled={paginacao.page >= paginacao.totalPages - 1 || loading}
              >
                Próxima
                <ChevronRight size={16} />
              </Button>
            </PaginationButtons>
          </Pagination>
        </ListContainer>
      </MainContent>
    </PageContainer>
  );
};

export default CadastroVendedores;