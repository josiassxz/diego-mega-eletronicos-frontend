import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Smartphone, Save, RotateCcw, AlertCircle, CheckCircle, Calendar, Search, X, User, Plus, Filter, Edit, Trash2 } from 'lucide-react';
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";
import Sidebar from '../components/Sidebar';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Input, Select, FormGroup } from '../components/ui/Input';
import { theme } from '../styles/theme';
import { empresaService } from '../services/empresaService';
import { clientService } from '../services/clientService';
import { aparelhoService } from '../services/aparelhoService';

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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const SectionTitle = styled.h3`
  font-size: ${theme.typography.sizes.h3};
  font-weight: ${theme.typography.weights.semiBold};
  color: ${theme.colors.neutral.text};
  margin: 0 0 ${theme.spacing.md} 0;
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 2px solid ${theme.colors.accent.blue};
`;

const FormActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
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

const DateInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.neutral.text};
  background: ${theme.colors.neutral.surface};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.blue};
    box-shadow: 0 0 0 3px ${theme.colors.accent.blue}20;
  }

  &:disabled {
    background: ${theme.colors.neutral.surfaceHover};
    color: ${theme.colors.neutral.textSecondary};
    cursor: not-allowed;
  }
`;

const ClienteSelector = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
`;

const ClienteDisplay = styled.div`
  flex: 1;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.medium};
  background: ${theme.colors.neutral.surfaceHover};
  color: ${theme.colors.neutral.text};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  min-height: 56px;

  ${props => props.empty && `
    color: ${theme.colors.neutral.textSecondary};
    font-style: italic;
  `}
`;

const SearchButton = styled.button`
  padding: ${theme.spacing.md};
  background: ${theme.colors.accent.blue};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  height: 56px;
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.colors.accent.blueHover};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const RemoveButton = styled.button`
  padding: ${theme.spacing.md};
  background: ${theme.colors.status.error};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  height: 56px;
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.colors.status.errorHover || '#dc2626'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ModalOverlay = styled.div`
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
  padding: ${theme.spacing.lg};
`;

const ModalContent = styled.div`
  background: ${theme.colors.neutral.surface};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.large};
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.neutral.border};
  display: flex;
  align-items: center;
  justify-content: between;
  gap: ${theme.spacing.md};
`;

const ModalTitle = styled.h2`
  font-size: ${theme.typography.sizes.h2};
  font-weight: ${theme.typography.weights.semiBold};
  color: ${theme.colors.neutral.text};
  margin: 0;
  flex: 1;
`;

const CloseButton = styled.button`
  padding: ${theme.spacing.sm};
  background: none;
  border: none;
  color: ${theme.colors.neutral.textSecondary};
  cursor: pointer;
  border-radius: ${theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.colors.neutral.surfaceHover};
    color: ${theme.colors.neutral.text};
  }
`;

const ModalBody = styled.div`
  padding: ${theme.spacing.lg};
  overflow-y: auto;
  flex: 1;
`;

const SearchContainer = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const ClientesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  max-height: 400px;
  overflow-y: auto;
`;

const ClienteItem = styled.div`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  &:hover {
    background: ${theme.colors.neutral.surfaceHover};
    border-color: ${theme.colors.accent.blue};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ClienteInfo = styled.div`
  flex: 1;
`;

const ClienteNome = styled.div`
  font-weight: ${theme.typography.weights.semiBold};
  color: ${theme.colors.neutral.text};
  margin-bottom: ${theme.spacing.xs};
`;

const ClienteDetalhes = styled.div`
  font-size: ${theme.typography.sizes.small};
  color: ${theme.colors.neutral.textSecondary};
  display: flex;
  gap: ${theme.spacing.md};
`;

const StatusBadge = styled.span`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.pill};
  font-size: ${theme.typography.sizes.small};
  font-weight: ${theme.typography.weights.medium};
  
  ${props => {
    const status = props.status?.toLowerCase();
    
    if (status === 'aprovado') {
      return `
        background: ${theme.colors.status.successLight};
        color: ${theme.colors.status.success};
      `;
    } else if (status === 'vendido') {
      return `
        background: ${theme.colors.accent.blueLight || '#e3f2fd'};
        color: ${theme.colors.accent.blue};
      `;
    } else if (status === 'em análise') {
      return `
        background: ${theme.colors.status.warningLight || '#fff3cd'};
        color: ${theme.colors.status.warning || '#856404'};
      `;
    } else {
      return `
        background: ${theme.colors.neutral.surfaceHover};
        color: ${theme.colors.neutral.textSecondary};
      `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl};
  color: ${theme.colors.neutral.textMuted};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.neutral.border};
  border-top-color: ${theme.colors.accent.blue};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: ${theme.spacing.lg} auto;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Styled components para abas
const TabContainer = styled.div`
  background: ${theme.colors.neutral.surface};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.small};
  overflow: hidden;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.colors.neutral.border};
  background: ${theme.colors.neutral.surfaceHover};
`;

const TabButton = styled.button`
  flex: 1;
  padding: ${theme.spacing.lg};
  border: none;
  background: ${props => props.active ? theme.colors.neutral.surface : 'transparent'};
  color: ${props => props.active ? theme.colors.accent.blue : theme.colors.neutral.textSecondary};
  font-weight: ${props => props.active ? theme.typography.weights.semiBold : theme.typography.weights.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  border-bottom: 3px solid ${props => props.active ? theme.colors.accent.blue : 'transparent'};

  &:hover {
    background: ${theme.colors.neutral.surface};
    color: ${theme.colors.accent.blue};
  }
`;

// Styled components para filtros
const FiltersContainer = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.neutral.border};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const FilterActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
`;

// Styled components para tabela
const TableContainer = styled.div`
  padding: ${theme.spacing.lg};
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.medium};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${theme.colors.neutral.surface};

  th, td {
    padding: ${theme.spacing.md};
    text-align: left;
    border-bottom: 1px solid ${theme.colors.neutral.border};
  }

  th {
    background: ${theme.colors.neutral.surfaceHover};
    font-weight: ${theme.typography.weights.semiBold};
    color: ${theme.colors.neutral.text};
    position: sticky;
    top: 0;
    z-index: 1;
  }

  td {
    color: ${theme.colors.neutral.text};
  }

  tr:hover {
    background: ${theme.colors.neutral.surfaceHover};
  }

  tr:last-child td {
    border-bottom: none;
  }
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
  transition: all 0.3s ease;

  ${props => props.variant === 'edit' && `
    background: ${theme.colors.accent.blue};
    color: white;
    
    &:hover {
      background: ${theme.colors.accent.blueHover};
    }
  `}

  ${props => props.variant === 'delete' && `
    background: ${theme.colors.status.error};
    color: white;
    
    &:hover {
      background: ${theme.colors.status.errorHover || '#dc2626'};
    }
  `}
`;

const CadastroAparelhos = () => {
  const { id } = useParams();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    imei: '',
    modelo: '',
    marca: '',
    cpfCliente: '',
    empresaId: '',
    valorParcelado: '',
    valorTotal: '',
    parcelas: '1',
    valorParcela: '',
    diasVencimento: '30',
    dataVencimento: ''
  });

  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  
  // Estados para o modal de seleção de clientes
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [searchCliente, setSearchCliente] = useState('');
  const [loadingClientes, setLoadingClientes] = useState(false);

  // Estados para abas e listagem
  const [activeTab, setActiveTab] = useState('cadastro');
  const [editingAparelho, setEditingAparelho] = useState(null);
  
  // Estados da listagem
  const [aparelhos, setAparelhos] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [filters, setFilters] = useState({
    imei: '',
    modelo: '',
    marca: '',
    clienteNome: '',
    empresaNome: '',
    status: ''
  });

  const marcasAparelhos = [
    'Apple',
    'Samsung',
    'Xiaomi',
    'Oppo',
    'Vivo',
    'Huawei',
    'OnePlus',
    'Realme',
    'Motorola',
    'Google',
    'Sony',
    'Asus',
    'Honor',
    'Nothing',
    'Tecno',
    'Infinix',
    'ZTE',
    'Lenovo',
    'Meizu'
  ];

  const opcoesParcelamento = Array.from({ length: 36 }, (_, i) => ({
    value: (i + 1).toString(),
    label: i === 0 ? '1 vez' : `${i + 1} vezes`
  }));

  useEffect(() => {
    loadEmpresas();
  }, []);

  useEffect(() => {
    if (isEditing && id) {
      loadAparelhoData(id);
    }
  }, [isEditing, id]);

  useEffect(() => {
    calcularValorParcela();
  }, [formData.valorParcelado, formData.parcelas]);

  const loadEmpresas = async () => {
    try {
      const response = await empresaService.getAllEmpresas();
      setEmpresas(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      showAlert('error', 'Erro ao carregar lista de empresas');
    }
  };

  const loadAparelhoData = async (aparelhoId) => {
    try {
      setLoading(true);
      const response = await aparelhoService.getById(aparelhoId);
      const aparelho = response.data;
      
      // Carregar dados do cliente
      const clienteResponse = await clientService.getById(aparelho.clienteId);
      const cliente = clienteResponse.data;
      
      setFormData({
        imei: aparelho.imei || '',
        modelo: aparelho.modelo || '',
        marca: aparelho.marca || '',
        cpfCliente: cliente.cpf || '',
        empresaId: aparelho.empresaId?.toString() || '',
        valorParcelado: aparelho.valorParcelado?.toString() || '',
        valorTotal: aparelho.valorTotal?.toString() || '',
        parcelas: aparelho.parcelas?.toString() || '1',
        valorParcela: aparelho.valorParcela?.toString() || '',
        diasVencimento: aparelho.diasVencimento?.toString() || '30',
        dataVencimento: aparelho.dataVencimento ? aparelho.dataVencimento.split('T')[0] : ''
      });
      
      setClienteSelecionado(cliente);
    } catch (error) {
      console.error('Erro ao carregar dados do aparelho:', error);
      showAlert('error', 'Erro ao carregar dados do aparelho');
    } finally {
      setLoading(false);
    }
  };

  const calcularValorParcela = () => {
    const valorParcelado = parseFloat(formData.valorParcelado) || 0;
    const parcelas = parseInt(formData.parcelas) || 1;
    
    if (valorParcelado > 0 && parcelas > 0) {
      const valorParcela = (valorParcelado / parcelas).toFixed(2);
      setFormData(prev => ({
        ...prev,
        valorParcela: valorParcela
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        valorParcela: ''
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatIMEI = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 15); // IMEI tem 15 dígitos
  };

  const formatCurrency = (value) => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseFloat(numbers) / 100;
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };



  const handleIMEIChange = (e) => {
    const formatted = formatIMEI(e.target.value);
    setFormData(prev => ({
      ...prev,
      imei: formatted
    }));
  };

  const handleCurrencyChange = (field) => (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const amount = parseFloat(value) / 100;
    setFormData(prev => ({
      ...prev,
      [field]: amount.toString()
    }));
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  // Funções para o modal de clientes
  const loadClientes = async () => {
    setLoadingClientes(true);
    try {
      const response = await clientService.getAllClients();
      // Filtrar clientes aprovados e vendidos (que podem comprar novos aparelhos)
      const clientesValidos = response.data.filter(cliente => {
        const status = cliente.status?.toLowerCase();
        return status === 'aprovado' || status === 'vendido';
      });
      setClientes(clientesValidos);
      setClientesFiltrados(clientesValidos);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      showAlert('error', 'Erro ao carregar lista de clientes');
    } finally {
      setLoadingClientes(false);
    }
  };

  const handleSearchCliente = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchCliente(searchTerm);
    
    if (searchTerm === '') {
      setClientesFiltrados(clientes);
    } else {
      const filtered = clientes.filter(cliente => 
        cliente.nome.toLowerCase().includes(searchTerm) ||
        cliente.email.toLowerCase().includes(searchTerm) ||
        cliente.cpf.includes(searchTerm) ||
        cliente.cidade.toLowerCase().includes(searchTerm)
      );
      setClientesFiltrados(filtered);
    }
  };

  const handleSelectCliente = (cliente) => {
    setClienteSelecionado(cliente);
    setFormData(prev => ({
      ...prev,
      cpfCliente: cliente.cpf
    }));
    setShowClienteModal(false);
    setSearchCliente('');
  };

  const handleOpenClienteModal = () => {
    setShowClienteModal(true);
    if (clientes.length === 0) {
      loadClientes();
    }
  };

  const handleCloseClienteModal = () => {
    setShowClienteModal(false);
    setSearchCliente('');
  };

  const handleRemoveCliente = () => {
    setClienteSelecionado(null);
    setFormData(prev => ({
      ...prev,
      cpfCliente: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações básicas
      if (!formData.imei || !formData.modelo || !formData.marca || !formData.cpfCliente || !formData.empresaId) {
        showAlert('error', 'Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      if (!clienteSelecionado) {
        showAlert('error', 'Por favor, selecione um cliente.');
        return;
      }

      // Preparar dados para envio
      const dadosParaEnvio = {
        imei: formData.imei.replace(/\D/g, ''), // Remove formatação
        modelo: formData.modelo,
        marca: formData.marca,
        clienteId: clienteSelecionado.id,
        empresaId: parseInt(formData.empresaId),
        valorParcelado: parseFloat(formData.valorParcelado) || 0,
        valorTotal: parseFloat(formData.valorTotal) || 0,
        parcelas: parseInt(formData.parcelas) || 1,
        valorParcela: parseFloat(formData.valorParcela) || 0,
        diasVencimento: parseInt(formData.diasVencimento) || 30,
        dataVencimento: formData.dataVencimento || null
      };

      console.log('Enviando dados:', dadosParaEnvio);
      
      let response;
      if (isEditing) {
        response = await aparelhoService.updateAparelho(id, dadosParaEnvio);
        showAlert('success', 'Aparelho atualizado com sucesso!');
      } else {
        response = await aparelhoService.createAparelho(dadosParaEnvio);
        showAlert('success', 'Aparelho cadastrado com sucesso!');
        handleReset();
      }
    } catch (error) {
      console.error('Erro ao cadastrar aparelho:', error);
      
      // Tratamento de erros específicos
      if (error.response?.data?.message) {
        showAlert('error', error.response.data.message);
      } else if (error.response?.status === 400) {
        showAlert('error', 'Dados inválidos. Verifique os campos e tente novamente.');
      } else if (error.response?.status === 409) {
        showAlert('error', 'IMEI já cadastrado no sistema.');
      } else {
        showAlert('error', 'Erro ao cadastrar aparelho. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Funções para gerenciar abas
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'listagem') {
      loadAparelhos();
    }
  };

  // Funções para listagem de aparelhos
  const loadAparelhos = async () => {
    try {
      setLoadingList(true);
      const response = await aparelhoService.getAllAparelhos();
      setAparelhos(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar aparelhos:', error);
      showAlert('error', 'Erro ao carregar lista de aparelhos');
    } finally {
      setLoadingList(false);
    }
  };

  const handleEditAparelho = (aparelho) => {
    setEditingAparelho(aparelho);
    setActiveTab('cadastro');
    
    // Preencher formulário com dados do aparelho
    setFormData({
      imei: aparelho.imei || '',
      modelo: aparelho.modelo || '',
      marca: aparelho.marca || '',
      cpfCliente: aparelho.cliente?.cpf || '',
      empresaId: aparelho.empresaId?.toString() || '',
      valorParcelado: aparelho.valorParcelado?.toString() || '',
      valorTotal: aparelho.valorTotal?.toString() || '',
      parcelas: aparelho.parcelas?.toString() || '1',
      valorParcela: aparelho.valorParcela?.toString() || '',
      diasVencimento: aparelho.diasVencimento?.toString() || '30',
      dataVencimento: aparelho.dataVencimento ? aparelho.dataVencimento.split('T')[0] : ''
    });
    
    setClienteSelecionado(aparelho.cliente);
  };

  const handleDeleteAparelho = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este aparelho?')) {
      try {
        await aparelhoService.deleteAparelho(id);
        showAlert('success', 'Aparelho excluído com sucesso!');
        loadAparelhos();
      } catch (error) {
        console.error('Erro ao excluir aparelho:', error);
        showAlert('error', 'Erro ao excluir aparelho');
      }
    }
  };

  const applyFilters = () => {
    let filtered = aparelhos;

    if (filters.clienteNome) {
      filtered = filtered.filter(aparelho =>
        aparelho.cliente?.nome?.toLowerCase().includes(filters.clienteNome.toLowerCase())
      );
    }

    if (filters.empresaNome) {
      filtered = filtered.filter(aparelho =>
        aparelho.empresa?.nome?.toLowerCase().includes(filters.empresaNome.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(aparelho =>
        aparelho.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    return filtered;
  };

  const clearFilters = () => {
    setFilters({
      clienteNome: '',
      empresaNome: '',
      status: ''
    });
  };

  const formatCurrencyDisplay = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return '#10b981';
      case 'inativo':
        return '#ef4444';
      case 'pendente':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const handleReset = () => {
    setFormData({
      imei: '',
      modelo: '',
      marca: '',
      cpfCliente: '',
      empresaId: '',
      valorParcelado: '',
      valorTotal: '',
      parcelas: '1',
      valorParcela: '',
      diasVencimento: '30',
      dataVencimento: ''
    });
    setClienteSelecionado(null);
  };

  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        <Header>
          <Title>
            <Smartphone size={28} />
            Gestão de Aparelhos
          </Title>
          <Subtitle>Cadastre e gerencie aparelhos para parcelamento</Subtitle>
        </Header>

        <TabContainer>
          <TabButtons>
            <TabButton 
              active={activeTab === 'cadastro'} 
              onClick={() => handleTabChange('cadastro')}
            >
              <Plus size={20} />
              Cadastrar Aparelho
            </TabButton>
            <TabButton 
              active={activeTab === 'listagem'} 
              onClick={() => handleTabChange('listagem')}
            >
              <Filter size={20} />
              Listar Aparelhos
            </TabButton>
          </TabButtons>

          {alert.show && (
            <Alert type={alert.type}>
              {alert.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {alert.message}
            </Alert>
          )}

          {activeTab === 'cadastro' && (
            <Container>

          <FormContainer>
            <form onSubmit={handleSubmit}>
              <FormGrid>
                <FormSection>
                  <SectionTitle>Informações do Aparelho</SectionTitle>
                  
                  <FormGroup>
                    <label>IMEI *</label>
                    <Input
                      name="imei"
                      value={formData.imei}
                      onChange={handleIMEIChange}
                      placeholder="Digite o IMEI do aparelho"
                      maxLength="15"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Modelo do Aparelho *</label>
                    <Input
                      name="modelo"
                      value={formData.modelo}
                      onChange={handleInputChange}
                      placeholder="Ex: iPhone 14 Pro Max"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Marca do Aparelho *</label>
                    <Select
                      name="marca"
                      value={formData.marca}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione a marca</option>
                      {marcasAparelhos.map(marca => (
                        <option key={marca} value={marca}>{marca}</option>
                      ))}
                    </Select>
                  </FormGroup>
                </FormSection>

                <FormSection>
                  <SectionTitle>Informações do Cliente</SectionTitle>
                  
                  <FormGroup>
                    <label>Cliente *</label>
                    <ClienteSelector>
                      <ClienteDisplay empty={!clienteSelecionado}>
                        {clienteSelecionado ? (
                          <>
                            <User size={20} />
                            <div>
                              <div style={{ fontWeight: 'bold' }}>{clienteSelecionado.nome}</div>
                              <div style={{ fontSize: '0.875rem', color: theme.colors.neutral.textSecondary }}>
                                CPF: {clienteSelecionado.cpf} | {clienteSelecionado.email}
                              </div>
                            </div>
                          </>
                        ) : (
                          'Selecione um cliente'
                        )}
                      </ClienteDisplay>
                      <SearchButton type="button" onClick={handleOpenClienteModal}>
                        <FaPencilAlt size={24} />
                      </SearchButton>
                      {clienteSelecionado && (
                        <RemoveButton 
                          type="button" 
                          onClick={handleRemoveCliente}
                        >
                          <FaTrashAlt size={24} />
                        </RemoveButton>
                      )}
                    </ClienteSelector>
                  </FormGroup>

                  <FormGroup>
                    <label>Vincular Loja *</label>
                    <Select
                      name="empresaId"
                      value={formData.empresaId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione a loja</option>
                      {empresas.map(empresa => (
                        <option key={empresa.id} value={empresa.id}>
                          {empresa.razaoSocial}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>
                </FormSection>

                <FormSection>
                  <SectionTitle>Informações Financeiras</SectionTitle>
                  
                  <FormGroup>
                    <label>Valor Total do Aparelho *</label>
                    <Input
                      name="valorTotal"
                      value={formData.valorTotal ? parseFloat(formData.valorTotal).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }) : ''}
                      onChange={handleCurrencyChange('valorTotal')}
                      placeholder="R$ 0,00"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Valor a ser Parcelado *</label>
                    <Input
                      name="valorParcelado"
                      value={formData.valorParcelado ? parseFloat(formData.valorParcelado).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }) : ''}
                      onChange={handleCurrencyChange('valorParcelado')}
                      placeholder="R$ 0,00"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Parcelar em *</label>
                    <Select
                      name="parcelas"
                      value={formData.parcelas}
                      onChange={handleInputChange}
                      required
                    >
                      {opcoesParcelamento.map(opcao => (
                        <option key={opcao.value} value={opcao.value}>
                          {opcao.label}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <label>Valor da Parcela</label>
                    <Input
                      name="valorParcela"
                      value={formData.valorParcela ? parseFloat(formData.valorParcela).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }) : ''}
                      disabled
                      placeholder="Calculado automaticamente"
                    />
                  </FormGroup>
                </FormSection>

                <FormSection>
                  <SectionTitle>Configurações de Vencimento</SectionTitle>
                  
                  <FormGroup>
                    <label>A Cada (dias) *</label>
                    <Select
                      name="diasVencimento"
                      value={formData.diasVencimento}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="15">15 dias</option>
                      <option value="30">30 dias</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <label>Data do 1º Vencimento *</label>
                    <DateInput
                      type="date"
                      name="dataVencimento"
                      value={formData.dataVencimento}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </FormSection>
              </FormGrid>

              <FormActions>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleReset}
                  disabled={loading}
                >
                  <RotateCcw size={20} />
                  Limpar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  <Save size={20} />
                  {loading ? 'Salvando...' : (isEditing ? 'Atualizar Aparelho' : 'Salvar Aparelho')}
                </Button>
              </FormActions>
            </form>
          </FormContainer>
        </Container>
          )}

          {activeTab === 'listagem' && (
            <>
              <FiltersContainer>
                <FiltersGrid>
                  <FormGroup>
                    <label>Buscar por IMEI/Modelo</label>
                    <Input
                      type="text"
                      placeholder="Digite o IMEI ou modelo..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Status</label>
                    <Select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="">Todos os status</option>
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                      <option value="vendido">Vendido</option>
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <label>Empresa</label>
                    <Select
                      value={filters.empresa}
                      onChange={(e) => setFilters(prev => ({ ...prev, empresa: e.target.value }))}
                    >
                      <option value="">Todas as empresas</option>
                      {empresas.map(empresa => (
                        <option key={empresa.id} value={empresa.id}>
                          {empresa.nome}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>
                </FiltersGrid>
                <FilterActions>
                  <Button variant="outline" onClick={clearFilters}>
                    Limpar Filtros
                  </Button>
                  <Button onClick={applyFilters}>
                    <Filter size={20} />
                    Aplicar Filtros
                  </Button>
                </FilterActions>
              </FiltersContainer>

              <TableContainer>
                {loadingList ? (
                  <LoadingSpinner />
                ) : (
                  <TableWrapper>
                    <Table>
                      <thead>
                        <tr>
                          <th>IMEI</th>
                          <th>Modelo</th>
                          <th>Marca</th>
                          <th>Cliente</th>
                          <th>Empresa</th>
                          <th>Valor</th>
                          <th>Status</th>
                          <th>Data Cadastro</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aparelhos.length > 0 ? (
                          aparelhos.map((aparelho) => (
                            <tr key={aparelho.id}>
                              <td>{aparelho.imei}</td>
                              <td>{aparelho.modelo}</td>
                              <td>{aparelho.marca}</td>
                              <td>{aparelho.cliente?.nome || 'N/A'}</td>
                              <td>{aparelho.empresa?.nome || 'N/A'}</td>
                              <td>{formatCurrencyDisplay(aparelho.valor)}</td>
                              <td>
                                <StatusBadge status={aparelho.status}>
                                  {aparelho.status}
                                </StatusBadge>
                              </td>
                              <td>{formatDate(aparelho.dataCadastro)}</td>
                              <td>
                                <ActionButtons>
                                  <ActionButton
                                    color="blue"
                                    onClick={() => handleEditAparelho(aparelho)}
                                    title="Editar"
                                  >
                                    <Edit size={16} />
                                  </ActionButton>
                                  <ActionButton
                                    color="red"
                                    onClick={() => handleDeleteAparelho(aparelho.id)}
                                    title="Excluir"
                                  >
                                    <Trash2 size={16} />
                                  </ActionButton>
                                </ActionButtons>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9">
                              <EmptyState>
                                Nenhum aparelho encontrado.
                              </EmptyState>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </TableWrapper>
                )}
              </TableContainer>
            </>
          )}
        </TabContainer>
      </MainContent>

      {/* Modal de Seleção de Clientes */}
      {showClienteModal && (
        <ModalOverlay onClick={handleCloseClienteModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Selecionar Cliente</ModalTitle>
              <CloseButton onClick={handleCloseClienteModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <SearchContainer>
                <Input
                  type="text"
                  placeholder="Buscar por nome, email, CPF ou cidade..."
                  value={searchCliente}
                  onChange={handleSearchCliente}
                  style={{ marginBottom: 0 }}
                />
              </SearchContainer>

              {loadingClientes ? (
                <LoadingSpinner />
              ) : (
                <ClientesList>
                  {clientesFiltrados.length > 0 ? (
                    clientesFiltrados.map((cliente) => (
                      <ClienteItem
                        key={cliente.id}
                        onClick={() => handleSelectCliente(cliente)}
                      >
                        <User size={24} />
                        <ClienteInfo>
                          <ClienteNome>{cliente.nome}</ClienteNome>
                          <ClienteDetalhes>
                            <span>CPF: {cliente.cpf}</span>
                            <span>Email: {cliente.email}</span>
                            <span>{cliente.cidade}, {cliente.estado}</span>
                          </ClienteDetalhes>
                        </ClienteInfo>
                        <StatusBadge status={cliente.status}>{cliente.status}</StatusBadge>
                      </ClienteItem>
                    ))
                  ) : (
                    <EmptyState>
                      {searchCliente ? 
                        'Nenhum cliente encontrado com os critérios de busca.' : 
                        'Nenhum cliente disponível encontrado.'
                      }
                    </EmptyState>
                  )}
                </ClientesList>
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default CadastroAparelhos;