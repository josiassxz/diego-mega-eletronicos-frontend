import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Smartphone, Save, RotateCcw, AlertCircle, CheckCircle, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Input, Select, FormGroup } from '../components/ui/Input';
import { theme } from '../styles/theme';
import { aparelhoService } from '../services/aparelhoService';
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
    if (props.type === 'success') {
      return `
        background: ${theme.colors.status.successLight};
        border: 1px solid ${theme.colors.status.success};
        color: ${theme.colors.status.success};
      `;
    }
    if (props.type === 'error') {
      return `
        background: ${theme.colors.status.errorLight};
        border: 1px solid ${theme.colors.status.error};
        color: ${theme.colors.status.error};
      `;
    }
    return `
      background: ${theme.colors.status.infoLight};
      border: 1px solid ${theme.colors.status.info};
      color: ${theme.colors.status.info};
    `;
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

const ClienteDisplay = styled.div`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.medium};
  background: ${theme.colors.neutral.surfaceHover};
  color: ${theme.colors.neutral.text};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  min-height: 56px;
  opacity: 0.7;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.neutral.border};
  border-top-color: ${theme.colors.accent.blue};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const opcoesParcelamento = [
  { value: '1', label: '1x (À vista)' },
  { value: '2', label: '2x' },
  { value: '3', label: '3x' },
  { value: '4', label: '4x' },
  { value: '5', label: '5x' },
  { value: '6', label: '6x' },
  { value: '7', label: '7x' },
  { value: '8', label: '8x' },
  { value: '9', label: '9x' },
  { value: '10', label: '10x' },
  { value: '11', label: '11x' },
  { value: '12', label: '12x' }
];

const EditarAparelho = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  
  const [formData, setFormData] = useState({
    imei: '',
    modelo: '',
    marca: '',
    empresaId: '',
    valorTotal: '',
    valorParcelado: '',
    parcelas: '1',
    valorParcela: '',
    diasVencimento: '30',
    dataVencimento: ''
  });

  const [clienteData, setClienteData] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar empresas
      const empresasResponse = await empresaService.getAllEmpresas();
      setEmpresas(empresasResponse.data || []);
      
      // Carregar dados do aparelho
      const aparelhoResponse = await aparelhoService.getAparelhoById(id);
      const aparelho = aparelhoResponse.data;
      
      if (aparelho) {
        setFormData({
          imei: aparelho.imei || '',
          modelo: aparelho.modelo || '',
          marca: aparelho.marca || '',
          empresaId: aparelho.empresaId?.toString() || '',
          valorTotal: aparelho.valorTotal?.toString() || '',
          valorParcelado: aparelho.valorParcelado?.toString() || '',
          parcelas: aparelho.parcelas?.toString() || '1',
          valorParcela: aparelho.valorParcela?.toString() || '',
          diasVencimento: aparelho.diasVencimento?.toString() || '30',
          dataVencimento: aparelho.dataVencimento ? aparelho.dataVencimento.split('T')[0] : ''
        });

        // Definir dados do cliente (não editável)
        setClienteData({
          id: aparelho.clienteId,
          nome: aparelho.clienteNome,
          cpf: aparelho.clienteCpf,
          email: aparelho.clienteEmail || 'Email não informado'
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setAlert({
        type: 'error',
        message: 'Erro ao carregar dados do aparelho'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calcular valor da parcela automaticamente
    if (name === 'valorParcelado' || name === 'parcelas') {
      const valorParcelado = name === 'valorParcelado' ? parseFloat(value) || 0 : parseFloat(formData.valorParcelado) || 0;
      const parcelas = name === 'parcelas' ? parseInt(value) || 1 : parseInt(formData.parcelas) || 1;
      
      if (valorParcelado > 0 && parcelas > 0) {
        const valorParcela = (valorParcelado / parcelas).toFixed(2);
        setFormData(prev => ({
          ...prev,
          valorParcela: valorParcela
        }));
      }
    }

    // Calcular data de vencimento
    if (name === 'diasVencimento') {
      const dias = parseInt(value) || 30;
      const dataVencimento = new Date();
      dataVencimento.setDate(dataVencimento.getDate() + dias);
      setFormData(prev => ({
        ...prev,
        dataVencimento: dataVencimento.toISOString().split('T')[0]
      }));
    }
  };

  const handleCurrencyChange = (fieldName) => (e) => {
    let value = e.target.value;
    
    // Remove tudo que não é número
    value = value.replace(/\D/g, '');
    
    // Converte para decimal
    value = (parseFloat(value) / 100).toFixed(2);
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Recalcular valor da parcela se necessário
    if (fieldName === 'valorParcelado') {
      const parcelas = parseInt(formData.parcelas) || 1;
      const valorParcelado = parseFloat(value) || 0;
      
      if (valorParcelado > 0 && parcelas > 0) {
        const valorParcela = (valorParcelado / parcelas).toFixed(2);
        setFormData(prev => ({
          ...prev,
          valorParcela: valorParcela
        }));
      }
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.imei.trim()) errors.push('IMEI é obrigatório');
    if (!formData.modelo.trim()) errors.push('Modelo é obrigatório');
    if (!formData.marca.trim()) errors.push('Marca é obrigatória');
    if (!formData.empresaId) errors.push('Empresa é obrigatória');
    if (!formData.valorTotal || parseFloat(formData.valorTotal) <= 0) errors.push('Valor total deve ser maior que zero');
    if (!formData.valorParcelado || parseFloat(formData.valorParcelado) <= 0) errors.push('Valor parcelado deve ser maior que zero');

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setAlert({
        type: 'error',
        message: errors.join(', ')
      });
      return;
    }

    try {
      setSaving(true);
      
      const dadosParaEnvio = {
        ...formData,
        clienteId: clienteData.id,
        valorTotal: parseFloat(formData.valorTotal),
        valorParcelado: parseFloat(formData.valorParcelado),
        parcelas: parseInt(formData.parcelas),
        valorParcela: parseFloat(formData.valorParcela),
        diasVencimento: parseInt(formData.diasVencimento),
        empresaId: parseInt(formData.empresaId)
      };

      await aparelhoService.updateAparelho(id, dadosParaEnvio);
      
      setAlert({
        type: 'success',
        message: 'Aparelho atualizado com sucesso!'
      });

      setTimeout(() => {
        navigate('/cadastro-aparelhos');
      }, 2000);

    } catch (error) {
      console.error('Erro ao atualizar aparelho:', error);
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Erro ao atualizar aparelho'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    loadData();
    setAlert(null);
  };

  if (loading) {
    return (
      <PageContainer>
        <Sidebar />
        <MainContent>
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        </MainContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        <Header>
          <Title>
            <Smartphone size={32} />
            Editar Aparelho
          </Title>
          <Subtitle>
            Edite as informações do aparelho selecionado
          </Subtitle>
        </Header>

        <FormContainer>
          {alert && (
            <Alert type={alert.type}>
              {alert.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {alert.message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormSection>
                <SectionTitle>Informações do Aparelho</SectionTitle>
                
                <FormGroup>
                  <label>IMEI *</label>
                  <Input
                    name="imei"
                    value={formData.imei}
                    onChange={handleInputChange}
                    placeholder="Digite o IMEI do aparelho"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Modelo *</label>
                  <Input
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleInputChange}
                    placeholder="Digite o modelo do aparelho"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Marca *</label>
                  <Input
                    name="marca"
                    value={formData.marca}
                    onChange={handleInputChange}
                    placeholder="Digite a marca do aparelho"
                    required
                  />
                </FormGroup>
              </FormSection>

              <FormSection>
                <SectionTitle>Informações do Cliente</SectionTitle>
                
                <FormGroup>
                  <label>Cliente (Não editável)</label>
                  <ClienteDisplay>
                    <User size={20} />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{clienteData?.nome}</div>
                      <div style={{ fontSize: '0.875rem', color: theme.colors.neutral.textSecondary }}>
                        CPF: {clienteData?.cpf} | {clienteData?.email}
                      </div>
                    </div>
                  </ClienteDisplay>
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
                <SectionTitle>Informações de Vencimento</SectionTitle>
                
                <FormGroup>
                  <label>Dias para Vencimento *</label>
                  <Select
                    name="diasVencimento"
                    value={formData.diasVencimento}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="30">30 dias</option>
                    <option value="60">60 dias</option>
                    <option value="90">90 dias</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <label>Data de Vencimento</label>
                  <DateInput
                    type="date"
                    name="dataVencimento"
                    value={formData.dataVencimento}
                    onChange={handleInputChange}
                    disabled
                  />
                </FormGroup>
              </FormSection>
            </FormGrid>

            <FormActions>
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={saving}
              >
                <RotateCcw size={20} />
                Resetar
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
              >
                <Save size={20} />
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </FormActions>
          </form>
        </FormContainer>
      </MainContent>
    </PageContainer>
  );
};

export default EditarAparelho;