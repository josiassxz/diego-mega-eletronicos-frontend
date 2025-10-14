import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Building2, Save, RotateCcw, AlertCircle, CheckCircle, Eye, Edit, Trash2, Plus, Search, Filter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Input, Select, FormGroup } from '../components/ui/Input';
import { theme } from '../styles/theme';
import { viaCepService } from '../services/viaCepService';
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

const FormContainer = styled.div`
  background: ${theme.colors.neutral.surface};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.small};
`;

const FormSection = styled.div`
  margin-bottom: ${theme.spacing.xl};
  
  &:last-child {
    margin-bottom: 0;
  }
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const FormRow = styled.div`
  display: grid;
  gap: ${theme.spacing.lg};
  
  &.cep-row {
    grid-template-columns: 1fr 2fr 0.8fr;
  }
  
  &.address-row {
    grid-template-columns: 1fr 1fr;
  }
  
  &.city-row {
    grid-template-columns: 2fr 1fr;
  }
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr !important;
    gap: ${theme.spacing.md};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${theme.spacing.xl};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.neutral.border};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const Alert = styled.div`
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  ${props => {
    switch(props.type) {
      case 'success':
        return `
          background: ${theme.colors.status.successLight};
          color: ${theme.colors.status.success};
          border: 1px solid ${theme.colors.status.success}20;
        `;
      case 'error':
        return `
          background: ${theme.colors.status.errorLight};
          color: ${theme.colors.status.error};
          border: 1px solid ${theme.colors.status.error}20;
        `;
      default:
        return `
          background: ${theme.colors.status.infoLight};
          color: ${theme.colors.status.info};
          border: 1px solid ${theme.colors.status.info}20;
        `;
    }
  }}
`;

const TabContainer = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const TabButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const TabButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${props => props.active ? theme.colors.accent.blue : theme.colors.neutral.surface};
  color: ${props => props.active ? theme.colors.neutral.white : theme.colors.neutral.text};
  border: 1px solid ${props => props.active ? theme.colors.accent.blue : theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-weight: ${theme.typography.weights.medium};
  
  &:hover {
    background: ${props => props.active ? theme.colors.accent.blueHover : theme.colors.neutral.surfaceHover};
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
  }
  
  td {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    color: ${theme.colors.neutral.textSecondary};
    border-bottom: 1px solid ${theme.colors.neutral.borderLight};
    white-space: nowrap;
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
      case 'Ativo':
        return `
          background: ${theme.colors.status.successLight};
          color: ${theme.colors.status.success};
        `;
      case 'Inativo':
        return `
          background: ${theme.colors.status.errorLight};
          color: ${theme.colors.status.error};
        `;
      default:
        return `
          background: ${theme.colors.status.warningLight};
          color: ${theme.colors.status.warning};
        `;
    }
  }}
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

  &.delete {
    &:hover {
      background: ${theme.colors.status.errorLight};
      border-color: ${theme.colors.status.error};
      color: ${theme.colors.status.error};
    }
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

const CadastroEmpresas = () => {
  // Estados do formulário
  const [formData, setFormData] = useState({
    // Dados básicos
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    
    // Contato
    telefone: '',
    celular: '',
    email: '',
    website: '',
    
    // Endereço
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    status: 'Ativo'
  });

  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [activeTab, setActiveTab] = useState('cadastro');
  const [editingEmpresa, setEditingEmpresa] = useState(null);

  // Estados da listagem
  const [empresas, setEmpresas] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [filters, setFilters] = useState({
    razaoSocial: '',
    cnpj: '',
    email: '',
    cidade: '',
    estado: '',
    status: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Formatação automática dos campos
    if (name === 'cnpj') {
      formattedValue = empresaService.formatarCnpj(value);
    } else if (name === 'telefone') {
      formattedValue = empresaService.formatarTelefone(value);
    } else if (name === 'celular') {
      formattedValue = empresaService.formatarCelular(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    
    setFormData(prev => ({
      ...prev,
      cep: viaCepService.formatarCep(cep)
    }));

    if (cep.length === 8) {
      try {
        const addressData = await viaCepService.buscarCep(cep);
        if (addressData) {
          setFormData(prev => ({
            ...prev,
            logradouro: addressData.logradouro || '',
            bairro: addressData.bairro || '',
            cidade: addressData.cidade || '',
            estado: addressData.estado || ''
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  // Carregar empresas quando a aba de listagem for ativada
  useEffect(() => {
    if (activeTab === 'listagem') {
      loadEmpresas();
    }
  }, [activeTab]);

  // Gerenciar filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Carregar lista de empresas
  const loadEmpresas = async () => {
    setLoadingList(true);
    try {
      const response = await empresaService.getAllEmpresas();
      setEmpresas(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Erro ao carregar lista de empresas.'
      });
    } finally {
      setLoadingList(false);
    }
  };

  // Aplicar filtros
  const applyFilters = async () => {
    setLoadingList(true);
    try {
      const activeFilters = Object.entries(filters)
        .filter(([key, value]) => value.trim() !== '')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      let response;
      if (Object.keys(activeFilters).length === 0) {
        response = await empresaService.getAllEmpresas();
      } else {
        response = await empresaService.filtrarEmpresas(activeFilters);
      }
      
      setEmpresas(response.data || []);
    } catch (error) {
      console.error('Erro ao filtrar empresas:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Erro ao filtrar empresas.'
      });
    } finally {
      setLoadingList(false);
    }
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      razaoSocial: '',
      cnpj: '',
      email: '',
      cidade: '',
      estado: '',
      status: ''
    });
    loadEmpresas();
  };

  // Editar empresa
  const handleEdit = (empresa) => {
    setEditingEmpresa(empresa);
    setFormData({
      razaoSocial: empresa.razaoSocial || '',
      nomeFantasia: empresa.nomeFantasia || '',
      cnpj: empresaService.formatarCnpj(empresa.cnpj) || '',
      inscricaoEstadual: empresa.inscricaoEstadual || '',
      inscricaoMunicipal: empresa.inscricaoMunicipal || '',
      telefone: empresa.telefone ? empresaService.formatarTelefone(empresa.telefone) : '',
      celular: empresa.celular ? empresaService.formatarCelular(empresa.celular) : '',
      email: empresa.email || '',
      website: empresa.website || '',
      cep: empresa.cep || '',
      logradouro: empresa.logradouro || '',
      numero: empresa.numero || '',
      complemento: empresa.complemento || '',
      bairro: empresa.bairro || '',
      cidade: empresa.cidade || '',
      estado: empresa.estado || '',
      status: empresa.status || 'Ativo'
    });
    setActiveTab('cadastro');
    setAlert({ show: false, type: '', message: '' });
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditingEmpresa(null);
    setFormData({
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      inscricaoEstadual: '',
      inscricaoMunicipal: '',
      telefone: '',
      celular: '',
      email: '',
      website: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      status: 'Ativo'
    });
    setAlert({ show: false, type: '', message: '' });
  };

  // Excluir empresa
  const handleDelete = async (empresaId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      return;
    }

    setLoading(true);
    try {
      await empresaService.deleteEmpresa(empresaId);
      setAlert({
        show: true,
        type: 'success',
        message: 'Empresa excluída com sucesso!'
      });
      loadEmpresas();
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Erro ao excluir empresa.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validação básica
      if (!formData.razaoSocial || !formData.cnpj || !formData.cep || !formData.logradouro || !formData.bairro || !formData.cidade || !formData.estado) {
        setAlert({
          show: true,
          type: 'error',
          message: 'Por favor, preencha todos os campos obrigatórios.'
        });
        return;
      }

      // Validar CNPJ
      if (!empresaService.validarCnpj(formData.cnpj)) {
        setAlert({
          show: true,
          type: 'error',
          message: 'CNPJ inválido. Por favor, verifique o número digitado.'
        });
        return;
      }

      // Validar email se preenchido
      if (formData.email && !empresaService.validarEmail(formData.email)) {
        setAlert({
          show: true,
          type: 'error',
          message: 'E-mail inválido. Por favor, verifique o endereço digitado.'
        });
        return;
      }

      // Preparar dados para envio
      const empresaData = {
        razaoSocial: formData.razaoSocial,
        nomeFantasia: formData.nomeFantasia || null,
        cnpj: formData.cnpj.replace(/\D/g, ''), // Remove formatação
        inscricaoEstadual: formData.inscricaoEstadual || null,
        inscricaoMunicipal: formData.inscricaoMunicipal || null,
        telefone: formData.telefone ? formData.telefone.replace(/\D/g, '') : null, // Remove formatação
        celular: formData.celular ? formData.celular.replace(/\D/g, '') : null, // Remove formatação
        email: formData.email || null,
        website: formData.website || null,
        cep: formData.cep.replace(/\D/g, ''), // Remove formatação
        logradouro: formData.logradouro,
        numero: formData.numero || null,
        complemento: formData.complemento || null,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado
      };

      if (editingEmpresa) {
        // Atualizar empresa existente
        await empresaService.updateEmpresa(editingEmpresa.id, empresaData);
        setAlert({
          show: true,
          type: 'success',
          message: 'Empresa atualizada com sucesso!'
        });
        handleCancelEdit();
        loadEmpresas();
      } else {
        // Criar nova empresa
        await empresaService.createEmpresa(empresaData);
        setAlert({
          show: true,
          type: 'success',
          message: 'Empresa cadastrada com sucesso!'
        });

        // Limpar formulário após sucesso
        setTimeout(() => {
          handleReset();
          setAlert({ show: false, type: '', message: '' });
        }, 3000);
      }

    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      
      let errorMessage = 'Erro ao salvar empresa. Tente novamente.';
      
      if (error.response?.data?.erro) {
        errorMessage = error.response.data.erro;
      } else if (error.response?.status === 400) {
        errorMessage = 'Dados inválidos. Verifique as informações e tente novamente.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      }
      
      setAlert({
        show: true,
        type: 'error',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      inscricaoEstadual: '',
      inscricaoMunicipal: '',
      telefone: '',
      celular: '',
      email: '',
      website: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
    setAlert({ show: false, type: '', message: '' });
  };

  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        <Header>
          <div>
            <Title>
              <Building2 size={28} />
              Gestão de Empresas
            </Title>
            <Subtitle>Cadastre e gerencie as empresas do sistema</Subtitle>
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
              <TabButton 
                active={activeTab === 'cadastro'} 
                onClick={() => setActiveTab('cadastro')}
              >
                <Plus size={20} />
                {editingEmpresa ? 'Editar Empresa' : 'Cadastrar Empresa'}
              </TabButton>
              <TabButton 
                active={activeTab === 'listagem'} 
                onClick={() => setActiveTab('listagem')}
              >
                <Search size={20} />
                Listar Empresas
              </TabButton>
            </TabButtons>

            {activeTab === 'cadastro' && (
              <>
                {editingEmpresa && (
                  <Alert type="info">
                    <AlertCircle size={20} />
                    Editando: {editingEmpresa.razaoSocial}
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={handleCancelEdit}
                      style={{ marginLeft: '10px' }}
                    >
                      Cancelar Edição
                    </Button>
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <FormContainer>
                    {/* Dados Básicos */}
                    <FormSection>
                      <SectionTitle>Dados Básicos</SectionTitle>
                      <FormGrid>
                        <FormGroup>
                          <label>Razão Social *</label>
                          <Input
                            type="text"
                            name="razaoSocial"
                            value={formData.razaoSocial}
                            onChange={handleInputChange}
                            placeholder="Digite a razão social"
                            required
                          />
                        </FormGroup>

                        <FormGroup>
                          <label>Nome Fantasia</label>
                          <Input
                            type="text"
                            name="nomeFantasia"
                            value={formData.nomeFantasia}
                            onChange={handleInputChange}
                            placeholder="Digite o nome fantasia"
                          />
                        </FormGroup>

                        <FormGroup>
                          <label>CNPJ *</label>
                          <Input
                            type="text"
                            name="cnpj"
                            value={formData.cnpj}
                            onChange={handleInputChange}
                            placeholder="00.000.000/0000-00"
                            maxLength="18"
                            required
                          />
                        </FormGroup>

                        <FormGroup>
                          <label>Inscrição Estadual</label>
                          <Input
                            type="text"
                            name="inscricaoEstadual"
                            value={formData.inscricaoEstadual}
                            onChange={handleInputChange}
                            placeholder="Digite a inscrição estadual"
                          />
                        </FormGroup>

                        <FormGroup>
                          <label>Inscrição Municipal</label>
                          <Input
                            type="text"
                            name="inscricaoMunicipal"
                            value={formData.inscricaoMunicipal}
                            onChange={handleInputChange}
                            placeholder="Digite a inscrição municipal"
                          />
                        </FormGroup>
                      </FormGrid>
                    </FormSection>

                    {/* Informações de Contato */}
                    <FormSection>
                      <SectionTitle>Informações de Contato</SectionTitle>
                      <FormGrid>
                        <FormGroup>
                          <label>Telefone</label>
                          <Input
                            type="tel"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleInputChange}
                            placeholder="(00) 0000-0000"
                            maxLength="14"
                          />
                        </FormGroup>

                        <FormGroup>
                          <label>Celular</label>
                          <Input
                            type="tel"
                            name="celular"
                            value={formData.celular}
                            onChange={handleInputChange}
                            placeholder="(00) 00000-0000"
                            maxLength="15"
                          />
                        </FormGroup>

                        <FormGroup>
                          <label>E-mail *</label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="empresa@exemplo.com"
                            required
                          />
                        </FormGroup>

                        <FormGroup>
                          <label>Website</label>
                          <Input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="https://www.exemplo.com"
                          />
                        </FormGroup>
                      </FormGrid>
                    </FormSection>

                    {/* Endereço */}
                    <FormSection>
                      <SectionTitle>Endereço</SectionTitle>
                      <div>
                        <FormRow className="cep-row">
                          <FormGroup>
                            <label>CEP *</label>
                            <Input
                              type="text"
                              name="cep"
                              value={formData.cep}
                              onChange={handleCepChange}
                              placeholder="00000-000"
                              maxLength="9"
                              required
                            />
                          </FormGroup>

                          <FormGroup>
                            <label>Logradouro *</label>
                            <Input
                              type="text"
                              name="logradouro"
                              value={formData.logradouro}
                              onChange={handleInputChange}
                              placeholder="Digite o logradouro"
                              required
                            />
                          </FormGroup>

                          <FormGroup>
                            <label>Número</label>
                            <Input
                              type="text"
                              name="numero"
                              value={formData.numero}
                              onChange={handleInputChange}
                              placeholder="123"
                            />
                          </FormGroup>
                        </FormRow>

                        <FormRow className="address-row">
                          <FormGroup>
                            <label>Complemento</label>
                            <Input
                              type="text"
                              name="complemento"
                              value={formData.complemento}
                              onChange={handleInputChange}
                              placeholder="Apto, sala, etc."
                            />
                          </FormGroup>

                          <FormGroup>
                            <label>Bairro *</label>
                            <Input
                              type="text"
                              name="bairro"
                              value={formData.bairro}
                              onChange={handleInputChange}
                              placeholder="Digite o bairro"
                              required
                            />
                          </FormGroup>
                        </FormRow>

                        <FormRow className="city-row">
                          <FormGroup>
                            <label>Cidade *</label>
                            <Input
                              type="text"
                              name="cidade"
                              value={formData.cidade}
                              onChange={handleInputChange}
                              placeholder="Digite a cidade"
                              required
                            />
                          </FormGroup>

                          <FormGroup>
                            <label>Estado *</label>
                            <Select
                              name="estado"
                              value={formData.estado}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Selecione</option>
                              <option value="AC">Acre</option>
                              <option value="AL">Alagoas</option>
                              <option value="AP">Amapá</option>
                              <option value="AM">Amazonas</option>
                              <option value="BA">Bahia</option>
                              <option value="CE">Ceará</option>
                              <option value="DF">Distrito Federal</option>
                              <option value="ES">Espírito Santo</option>
                              <option value="GO">Goiás</option>
                              <option value="MA">Maranhão</option>
                              <option value="MT">Mato Grosso</option>
                              <option value="MS">Mato Grosso do Sul</option>
                              <option value="MG">Minas Gerais</option>
                              <option value="PA">Pará</option>
                              <option value="PB">Paraíba</option>
                              <option value="PR">Paraná</option>
                              <option value="PE">Pernambuco</option>
                              <option value="PI">Piauí</option>
                              <option value="RJ">Rio de Janeiro</option>
                              <option value="RN">Rio Grande do Norte</option>
                              <option value="RS">Rio Grande do Sul</option>
                              <option value="RO">Rondônia</option>
                              <option value="RR">Roraima</option>
                              <option value="SC">Santa Catarina</option>
                              <option value="SP">São Paulo</option>
                              <option value="SE">Sergipe</option>
                              <option value="TO">Tocantins</option>
                            </Select>
                          </FormGroup>
                        </FormRow>
                      </div>
                    </FormSection>

                    <FormActions>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={editingEmpresa ? handleCancelEdit : handleReset}
                        disabled={loading}
                      >
                        <RotateCcw size={18} />
                        {editingEmpresa ? 'Cancelar' : 'Limpar'}
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={loading}
                      >
                        <Save size={18} />
                        {loading ? 'Salvando...' : (editingEmpresa ? 'Atualizar Empresa' : 'Salvar Empresa')}
                      </Button>
                    </FormActions>
                  </FormContainer>
                </form>
              </>
            )}

            {activeTab === 'listagem' && (
              <>
                <FiltersContainer>
                  <SectionTitle>
                    <Filter size={20} />
                    Filtros
                  </SectionTitle>
                  <FiltersGrid>
                    <FormGroup>
                      <label>Razão Social</label>
                      <Input
                        type="text"
                        name="razaoSocial"
                        value={filters.razaoSocial}
                        onChange={handleFilterChange}
                        placeholder="Filtrar por razão social"
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>CNPJ</label>
                      <Input
                        type="text"
                        name="cnpj"
                        value={filters.cnpj}
                        onChange={handleFilterChange}
                        placeholder="Filtrar por CNPJ"
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>E-mail</label>
                      <Input
                        type="text"
                        name="email"
                        value={filters.email}
                        onChange={handleFilterChange}
                        placeholder="Filtrar por e-mail"
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Cidade</label>
                      <Input
                        type="text"
                        name="cidade"
                        value={filters.cidade}
                        onChange={handleFilterChange}
                        placeholder="Filtrar por cidade"
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Estado</label>
                      <Select
                        name="estado"
                        value={filters.estado}
                        onChange={handleFilterChange}
                      >
                        <option value="">Todos os estados</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <label>Status</label>
                      <Select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                      >
                        <option value="">Todos os status</option>
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
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
                        <p>Carregando empresas...</p>
                      </EmptyState>
                    ) : empresas.length === 0 ? (
                      <EmptyState>
                        <Search size={48} />
                        <p>Nenhuma empresa encontrada</p>
                      </EmptyState>
                    ) : (
                      <Table>
                        <thead>
                          <tr>
                            <th>Razão Social</th>
                            <th>CNPJ</th>
                            <th>E-mail</th>
                            <th>Telefone</th>
                            <th>Cidade</th>
                            <th>Estado</th>
                            <th>Status</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {empresas.map((empresa) => (
                            <tr key={empresa.id}>
                              <td>{empresa.razaoSocial}</td>
                              <td>{empresaService.formatarCnpj(empresa.cnpj)}</td>
                              <td>{empresa.email || '-'}</td>
                              <td>{empresa.telefone || '-'}</td>
                              <td>{empresa.cidade || '-'}</td>
                              <td>{empresa.estado || '-'}</td>
                              <td>
                                <StatusBadge status={empresa.status}>
                                  {empresa.status}
                                </StatusBadge>
                              </td>
                              <td>
                                <ActionButtons>
                                  <ActionButton 
                                    className="edit"
                                    onClick={() => handleEdit(empresa)}
                                    title="Editar empresa"
                                  >
                                    <Edit size={16} />
                                  </ActionButton>
                                  <ActionButton 
                                    className="delete"
                                    onClick={() => handleDelete(empresa.id)}
                                    title="Excluir empresa"
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
                </TableContainer>
              </>
            )}
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

export default CadastroEmpresas;