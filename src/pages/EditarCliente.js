
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Camera, 
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { clientService } from '../services/clientService';
import { viaCepService } from '../services/viaCepService';
import { Container, Grid, Section } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Input, Select, FormGroup, Label, ErrorMessage } from '../components/ui/Input';
import { SectionTitle } from '../components/ui/Typography';
import { FileUpload } from '../components/ui/FileUpload';
import { MaskedInput } from '../components/ui/MaskedInput';
import { theme } from '../styles/theme';

const Header = styled.header`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${theme.spacing.md} 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.sizes.h1};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.neutral.white};
  margin: 0;
`;

const MainContent = styled.main`
  padding: ${theme.spacing.xl} 0;
  min-height: calc(100vh - 200px);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled(Section)`
  h3 {
    margin-bottom: ${theme.spacing.md};
  }
`;

const UploadSection = styled(Section)`
  @media (max-width: ${theme.breakpoints.tablet}) {
    margin-top: ${theme.spacing.lg};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${theme.spacing.xl};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;



const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  color: ${theme.colors.neutral.lightGray};
`;

const Toast = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-weight: ${theme.typography.weights.medium};
  z-index: 1000;
  max-width: 400px;
  box-shadow: ${theme.shadows.large};
  animation: slideIn 0.3s ease-out;
  
  ${props => props.type === 'error' && `
    background: ${theme.colors.status.errorBackground || '#fee'};
    color: ${theme.colors.status.error || '#d32f2f'};
    border: 1px solid ${theme.colors.status.error || '#d32f2f'};
  `}
  
  ${props => props.type === 'success' && `
    background: ${theme.colors.status.successBackground || '#e8f5e8'};
    color: ${theme.colors.status.success || '#2e7d32'};
    border: 1px solid ${theme.colors.status.success || '#2e7d32'};
  `}
  
  @keyframes slideIn {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const EditarCliente = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [documentFile, setDocumentFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [documentoPessoalFile, setDocumentoPessoalFile] = useState(null);
  const [extratoBancarioFile, setExtratoBancarioFile] = useState(null);
  const [comprovanteEnderecoFile, setComprovanteEnderecoFile] = useState(null);
  const [existingPhotos, setExistingPhotos] = useState({
    fotoDocumento: null,
    fotoSelfie: null,
    documentoPessoal: null,
    extratoBancarioComprovanteRenda: null,
    comprovanteEndereco: null
  });
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    whatsapp: '',
    rg: '',
    telefone: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    nomeMae: '',
    dataNascimento: '',
    sexo: '',
    estadoCivil: '',
    naturezaOcupacao: '',
    profissao: '',
    nomeEmpresa: '',
    rendaMensal: '',
    comprovacaoRenda: '',
    // Primeira Referência
    referencia1Nome: '',
    referencia1Relacao: '',
    referencia1Whatsapp: '',
    referencia1Conhece: false,
    // Segunda Referência
    referencia2Nome: '',
    referencia2Relacao: '',
    referencia2Whatsapp: '',
    referencia2Conhece: false,
    // Terceira Referência
    referencia3Nome: '',
    referencia3Relacao: '',
    referencia3Whatsapp: '',
    referencia3Conhece: false,
    // Observação
    observacao: ''
  });

  useEffect(() => {
    if (id) {
      loadClient();
    }
  }, [id]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 5000);
  };

  const loadClient = async () => {
    try {
      setPageLoading(true);
      const response = await clientService.getClientById(id);
      const client = response.data;
      
      setFormData({
        nome: client.nome || '',
        email: client.email || '',
        cpf: client.cpf || '',
        whatsapp: client.whatsapp || '',
        rg: client.rg || '',
        telefone: client.telefone || '',
        cep: client.cep || '',
        rua: client.rua || '',
        numero: client.numero || '',
        bairro: client.bairro || '',
        cidade: client.cidade || '',
        estado: client.estado || '',
        nomeMae: client.nomeMae || '',
        dataNascimento: client.dataNascimento || '',
        sexo: client.sexo || '',
        estadoCivil: client.estadoCivil || '',
        naturezaOcupacao: client.naturezaOcupacao || '',
        profissao: client.profissao || '',
        nomeEmpresa: client.nomeEmpresa || '',
        rendaMensal: client.rendaMensal || '',
        comprovacaoRenda: client.comprovacaoRenda || '',
        // Primeira Referência
        referencia1Nome: client.referencia1Nome || '',
        referencia1Relacao: client.referencia1Relacao || '',
        referencia1Whatsapp: client.referencia1Whatsapp || '',
        referencia1Conhece: client.referencia1Conhece || false,
        // Segunda Referência
        referencia2Nome: client.referencia2Nome || '',
        referencia2Relacao: client.referencia2Relacao || '',
        referencia2Whatsapp: client.referencia2Whatsapp || '',
        referencia2Conhece: client.referencia2Conhece || false,
        // Terceira Referência
        referencia3Nome: client.referencia3Nome || '',
        referencia3Relacao: client.referencia3Relacao || '',
        referencia3Whatsapp: client.referencia3Whatsapp || '',
        referencia3Conhece: client.referencia3Conhece || false,
        // Observação
        observacao: client.observacao || ''
      });

      // Carregar fotos existentes se houver
      if (client.fotoDocumento || client.fotoSelfie || client.documentoPessoal || client.extratoBancarioComprovanteRenda || client.comprovanteEndereco) {
        try {
          const photosResponse = await clientService.getClientPhotos(id);
          setExistingPhotos({
            fotoDocumento: photosResponse.data.fotos.fotoDocumento || null,
            fotoSelfie: photosResponse.data.fotos.fotoSelfie || null,
            documentoPessoal: photosResponse.data.fotos.documentoPessoal || null,
            extratoBancarioComprovanteRenda: photosResponse.data.fotos.extratoBancarioComprovanteRenda || null,
            comprovanteEndereco: photosResponse.data.fotos.comprovanteEndereco || null
          });
        } catch (photoError) {
          console.error('Erro ao carregar fotos:', photoError);
          // Não bloquear o carregamento se as fotos falharem
        }
      }
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
      setErrors({ load: 'Erro ao carregar dados do cliente' });
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Buscar endereço quando CEP for preenchido
    if (name === 'cep' && value.replace(/\D/g, '').length === 8) {
      try {
        const endereco = await viaCepService.buscarCep(value);
        if (endereco && !endereco.erro) {
          setFormData(prev => ({
            ...prev,
            rua: endereco.logradouro || '',
            bairro: endereco.bairro || '',
            cidade: endereco.cidade || '',
            estado: endereco.estado || ''
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const errorMessages = [];

    // Campos obrigatórios
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
      errorMessages.push('Nome é obrigatório');
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
      errorMessages.push('Email é obrigatório');
    }
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
      errorMessages.push('CPF é obrigatório');
    }
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp é obrigatório';
      errorMessages.push('WhatsApp é obrigatório');
    }

    // Validação de email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
      errorMessages.push('Email inválido');
    }

    // Validação de CPF (básica)
    if (formData.cpf && formData.cpf.length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
      errorMessages.push('CPF deve ter 11 dígitos');
    }

    // Validação das referências (todas obrigatórias)
    // Primeira referência
    const ref1WhatsApp = (formData.referencia1Whatsapp || '').replace(/\D/g, '');
    if (!formData.referencia1Nome || !formData.referencia1Nome.trim()) {
      newErrors.referencia1Nome = 'Nome da 1ª referência é obrigatório';
      errorMessages.push('Nome da 1ª referência é obrigatório');
    }
    if (!formData.referencia1Relacao || !formData.referencia1Relacao.trim()) {
      newErrors.referencia1Relacao = 'Relação da 1ª referência é obrigatória';
      errorMessages.push('Relação da 1ª referência é obrigatória');
    }
    if (!ref1WhatsApp || ref1WhatsApp.length < 10) {
      newErrors.referencia1Whatsapp = 'WhatsApp da 1ª referência é obrigatório';
      errorMessages.push('WhatsApp da 1ª referência é obrigatório');
    }
    
    // Segunda referência
    const ref2WhatsApp = (formData.referencia2Whatsapp || '').replace(/\D/g, '');
    if (!formData.referencia2Nome || !formData.referencia2Nome.trim()) {
      newErrors.referencia2Nome = 'Nome da 2ª referência é obrigatório';
      errorMessages.push('Nome da 2ª referência é obrigatório');
    }
    if (!formData.referencia2Relacao || !formData.referencia2Relacao.trim()) {
      newErrors.referencia2Relacao = 'Relação da 2ª referência é obrigatória';
      errorMessages.push('Relação da 2ª referência é obrigatória');
    }
    if (!ref2WhatsApp || ref2WhatsApp.length < 10) {
      newErrors.referencia2Whatsapp = 'WhatsApp da 2ª referência é obrigatório';
      errorMessages.push('WhatsApp da 2ª referência é obrigatório');
    }
    
    // Terceira referência
    const ref3WhatsApp = (formData.referencia3Whatsapp || '').replace(/\D/g, '');
    if (!formData.referencia3Nome || !formData.referencia3Nome.trim()) {
      newErrors.referencia3Nome = 'Nome da 3ª referência é obrigatório';
      errorMessages.push('Nome da 3ª referência é obrigatório');
    }
    if (!formData.referencia3Relacao || !formData.referencia3Relacao.trim()) {
      newErrors.referencia3Relacao = 'Relação da 3ª referência é obrigatória';
      errorMessages.push('Relação da 3ª referência é obrigatória');
    }
    if (!ref3WhatsApp || ref3WhatsApp.length < 10) {
      newErrors.referencia3Whatsapp = 'WhatsApp da 3ª referência é obrigatório';
      errorMessages.push('WhatsApp da 3ª referência é obrigatório');
    }

    setErrors(newErrors);
    
    if (errorMessages.length > 0) {
      const firstError = errorMessages[0];
      const totalErrors = errorMessages.length;
      const message = totalErrors > 1 
        ? `${firstError} (e mais ${totalErrors - 1} campo${totalErrors > 2 ? 's' : ''})`
        : firstError;
      showToast('error', message);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Usar a nova função que decide automaticamente entre JSON e multipart
      await clientService.updateClientWithPhotos(id, formData, documentFile, selfieFile, documentoPessoalFile, extratoBancarioFile, comprovanteEnderecoFile);
      
      showToast('success', 'Cliente atualizado com sucesso!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar cliente. Tente novamente.';
      showToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <LoadingContainer>
        <div>Carregando dados do cliente...</div>
      </LoadingContainer>
    );
  }

  if (errors.load) {
    return (
      <LoadingContainer>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: theme.colors.accent.red, marginBottom: theme.spacing.md }}>
            {errors.load}
          </div>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </Button>
        </div>
      </LoadingContainer>
    );
  }

  return (
    <>
      <Header>
        <Container>
          <HeaderContent>
            <PageTitle>Editar Cliente</PageTitle>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={20} />
              Voltar
            </Button>
          </HeaderContent>
        </Container>
      </Header>

      <MainContent>
        <Container>
          <form onSubmit={handleSubmit}>
            <Grid>
              <div>
                {/* Dados Pessoais */}
                <FormSection>
                  <SectionTitle>
                    <User size={24} />
                    Dados Pessoais
                  </SectionTitle>
                  
                  <FormGrid>
                    <FormGroup>
                      <Label>Nome Completo *</Label>
                      <Input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Digite o nome completo"
                        $hasError={!!errors.nome}
                      />
                      {errors.nome && <ErrorMessage>{errors.nome}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Digite o email"
                        $error={!!errors.email}
                      />
                      {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                      <Label>CPF *</Label>
                      <MaskedInput
                        mask="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        placeholder="000.000.000-00"
                        $error={!!errors.cpf}
                      />
                      {errors.cpf && <ErrorMessage>{errors.cpf}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                      <Label>RG</Label>
                      <Input
                        type="text"
                        name="rg"
                        value={formData.rg}
                        onChange={handleChange}
                        placeholder="Digite o RG"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Telefone</Label>
                      <MaskedInput
                        mask="phone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>WhatsApp *</Label>
                      <MaskedInput
                        mask="phone"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                        $error={!!errors.whatsapp}
                      />
                      {errors.whatsapp && <ErrorMessage>{errors.whatsapp}</ErrorMessage>}
                    </FormGroup>
                  </FormGrid>
                </FormSection>

                {/* Endereço */}
                <FormSection>
                  <SectionTitle>
                    <MapPin size={24} />
                    Endereço
                  </SectionTitle>
                  
                  <FormGrid>
                    <FormGroup>
                      <Label>CEP</Label>
                      <MaskedInput
                        mask="cep"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        placeholder="00000-000"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Rua</Label>
                      <Input
                        type="text"
                        name="rua"
                        value={formData.rua}
                        onChange={handleChange}
                        placeholder="Digite a rua"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Número</Label>
                      <Input
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        placeholder="Digite o número"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Complemento</Label>
                      <Input
                        type="text"
                        name="complemento"
                        value={formData.complemento}
                        onChange={handleChange}
                        placeholder="Complemento (opcional)"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Bairro</Label>
                      <Input
                        type="text"
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleChange}
                        placeholder="Digite o bairro"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Cidade</Label>
                      <Input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        placeholder="Digite a cidade"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Estado</Label>
                      <Select
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                      >
                        <option value="">Selecione o estado</option>
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
                  </FormGrid>
                </FormSection>

                {/* Dados Adicionais */}
                <FormSection>
                  <SectionTitle>
                    <FileText size={24} />
                    Dados Adicionais
                  </SectionTitle>
                  
                  <FormGrid>
                    <FormGroup>
                      <Label>Nome da Mãe</Label>
                      <Input
                        type="text"
                        name="nomeMae"
                        value={formData.nomeMae}
                        onChange={handleChange}
                        placeholder="Digite o nome da mãe"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Data de Nascimento</Label>
                      <Input
                        type="date"
                        name="dataNascimento"
                        value={formData.dataNascimento}
                        onChange={handleChange}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Sexo</Label>
                      <Select
                        name="sexo"
                        value={formData.sexo}
                        onChange={handleChange}
                      >
                        <option value="">Selecione</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label>Estado Civil</Label>
                      <Select
                        name="estadoCivil"
                        value={formData.estadoCivil}
                        onChange={handleChange}
                      >
                        <option value="">Selecione</option>
                        <option value="solteiro">Solteiro(a)</option>
                        <option value="casado">Casado(a)</option>
                        <option value="divorciado">Divorciado(a)</option>
                        <option value="viuvo">Viúvo(a)</option>
                        <option value="uniao_estavel">União Estável</option>
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label>Natureza da Ocupação</Label>
                      <Input
                        type="text"
                        name="naturezaOcupacao"
                        value={formData.naturezaOcupacao}
                        onChange={handleChange}
                        placeholder="Digite a natureza da ocupação"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Profissão</Label>
                      <Input
                        type="text"
                        name="profissao"
                        value={formData.profissao}
                        onChange={handleChange}
                        placeholder="Digite a profissão"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Nome da Empresa</Label>
                      <Input
                        type="text"
                        name="nomeEmpresa"
                        value={formData.nomeEmpresa}
                        onChange={handleChange}
                        placeholder="Digite o nome da empresa"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Renda Mensal</Label>
                      <Input
                        type="number"
                        name="rendaMensal"
                        value={formData.rendaMensal}
                        onChange={handleChange}
                        placeholder="Digite a renda mensal"
                        min="0"
                        step="0.01"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Comprovação de Renda</Label>
                      <Select
                        name="comprovacaoRenda"
                        value={formData.comprovacaoRenda}
                        onChange={handleChange}
                      >
                        <option value="">Selecione uma opção</option>
                        <option value="Carteira de trabalho">Carteira de trabalho</option>
                        <option value="Contra cheque">Contra cheque</option>
                        <option value="Outros">Outros</option>
                      </Select>
                    </FormGroup>
                  </FormGrid>
                </FormSection>
                {/* Referências */}
                <FormSection>
                  <SectionTitle>
                    <Phone size={24} />
                    Referências de Contato
                  </SectionTitle>
                  {/* Primeira Referência */}
                  <div style={{ marginBottom: theme.spacing.lg }}>
                    <h4 style={{ color: theme.colors.neutral.white, marginBottom: theme.spacing.md }}>
                      Primeira Referência
                    </h4>
                    <FormGrid>
                      <FormGroup>
                        <Label>Nome Completo *</Label>
                        <Input
                          name="referencia1Nome"
                          value={formData.referencia1Nome}
                          onChange={handleChange}
                          placeholder="Nome completo da referência"
                          $error={!!errors.referencia1Nome}
                        />
                        {errors.referencia1Nome && <ErrorMessage>{errors.referencia1Nome}</ErrorMessage>}
                      </FormGroup>

                      <FormGroup>
                        <Label>Relação *</Label>
                        <Input
                          name="referencia1Relacao"
                          value={formData.referencia1Relacao}
                          onChange={handleChange}
                          placeholder="Ex: Amigo, Familiar, Colega"
                          $error={!!errors.referencia1Relacao}
                        />
                        {errors.referencia1Relacao && <ErrorMessage>{errors.referencia1Relacao}</ErrorMessage>}
                      </FormGroup>

                      <FormGroup>
                        <Label>WhatsApp *</Label>
                        <MaskedInput
                          mask="phone"
                          name="referencia1Whatsapp"
                          value={formData.referencia1Whatsapp}
                          onChange={handleChange}
                          placeholder="(00) 00000-0000"
                          $error={!!errors.referencia1Whatsapp}
                        />
                        {errors.referencia1Whatsapp && <ErrorMessage>{errors.referencia1Whatsapp}</ErrorMessage>}
                      </FormGroup>

                      <FormGroup>
                        <Label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            name="referencia1Conhece"
                            checked={formData.referencia1Conhece}
                            onChange={(e) => setFormData(prev => ({ ...prev, referencia1Conhece: e.target.checked }))}
                            style={{ margin: 0 }}
                          />
                          Você conhece esta referência?
                        </Label>
                      </FormGroup>
                    </FormGrid>
                  </div>

                  {/* Segunda Referência */}
                  <div style={{ marginBottom: theme.spacing.lg }}>
                    <h4 style={{ color: theme.colors.neutral.white, marginBottom: theme.spacing.md }}>
                      Segunda Referência
                    </h4>
                    <FormGrid>
                      <FormGroup>
                        <Label>Nome Completo *</Label>
                        <Input
                          name="referencia2Nome"
                          value={formData.referencia2Nome}
                          onChange={handleChange}
                          placeholder="Nome completo da referência"
                          $error={!!errors.referencia2Nome}
                        />
                        {errors.referencia2Nome && <ErrorMessage>{errors.referencia2Nome}</ErrorMessage>}
                      </FormGroup>

                      <FormGroup>
                        <Label>Relação *</Label>
                        <Input
                          name="referencia2Relacao"
                          value={formData.referencia2Relacao}
                          onChange={handleChange}
                          placeholder="Ex: Amigo, Familiar, Colega"
                          $error={!!errors.referencia2Relacao}
                        />
                        {errors.referencia2Relacao && <ErrorMessage>{errors.referencia2Relacao}</ErrorMessage>}
                      </FormGroup>

                      <FormGroup>
                        <Label>WhatsApp *</Label>
                        <MaskedInput
                          mask="phone"
                          name="referencia2Whatsapp"
                          value={formData.referencia2Whatsapp}
                          onChange={handleChange}
                          placeholder="(00) 00000-0000"
                          $error={!!errors.referencia2Whatsapp}
                        />
                        {errors.referencia2Whatsapp && <ErrorMessage>{errors.referencia2Whatsapp}</ErrorMessage>}
                      </FormGroup>

                      <FormGroup>
                        <Label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            name="referencia2Conhece"
                            checked={formData.referencia2Conhece}
                            onChange={(e) => setFormData(prev => ({ ...prev, referencia2Conhece: e.target.checked }))}
                            style={{ margin: 0 }}
                          />
                          Você conhece esta referência?
                        </Label>
                      </FormGroup>
                    </FormGrid>
                  </div>

                  {/* Terceira Referência */}
                  <div style={{ marginBottom: theme.spacing.lg }}>
                    <h4 style={{ color: theme.colors.neutral.white, marginBottom: theme.spacing.md }}>
                      Terceira Referência
                    </h4>
                    <FormGrid>
                      <FormGroup>
                        <Label>Nome Completo *</Label>
                        <Input
                          name="referencia3Nome"
                          value={formData.referencia3Nome}
                          onChange={handleChange}
                          placeholder="Nome completo da referência"
                          $error={!!errors.referencia3Nome}
                        />
                        {errors.referencia3Nome && <ErrorMessage>{errors.referencia3Nome}</ErrorMessage>}
                      </FormGroup>

                      <FormGroup>
                        <Label>Relação *</Label>
                        <Input
                          name="referencia3Relacao"
                          value={formData.referencia3Relacao}
                          onChange={handleChange}
                          placeholder="Ex: Amigo, Familiar, Colega"
                          $error={!!errors.referencia3Relacao}
                        />
                        {errors.referencia3Relacao && <ErrorMessage>{errors.referencia3Relacao}</ErrorMessage>}
                      </FormGroup>

                      <FormGroup>
                        <Label>WhatsApp *</Label>
                        <MaskedInput
                          mask="phone"
                          name="referencia3Whatsapp"
                          value={formData.referencia3Whatsapp}
                          onChange={handleChange}
                          placeholder="(00) 00000-0000"
                          $error={!!errors.referencia3Whatsapp}
                        />
                        {errors.referencia3Whatsapp && <ErrorMessage>{errors.referencia3Whatsapp}</ErrorMessage>}
                      </FormGroup>

                      <FormGroup>
                        <Label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            name="referencia3Conhece"
                            checked={formData.referencia3Conhece}
                            onChange={(e) => setFormData(prev => ({ ...prev, referencia3Conhece: e.target.checked }))}
                            style={{ margin: 0 }}
                          />
                          Você conhece esta referência?
                        </Label>
                      </FormGroup>
                    </FormGrid>
                  </div>
                </FormSection>

                {/* Observações */}
                <FormSection>
                  <SectionTitle>
                    <FileText size={24} />
                    Observações
                  </SectionTitle>
                  
                  <FormGroup>
                    <Label>Observações Gerais</Label>
                    <textarea
                      name="observacao"
                      value={formData.observacao}
                      onChange={handleChange}
                      placeholder="Digite aqui observações importantes sobre o cliente..."
                      maxLength={1000}
                      style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: theme.spacing.sm,
                        borderRadius: theme.borderRadius.medium,
                        border: `1px solid ${theme.colors.neutral.gray}`,
                        backgroundColor: theme.colors.neutral.darkGray,
                        color: theme.colors.neutral.white,
                        fontSize: theme.typography.sizes.body,
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        outline: 'none',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = theme.colors.primary.main;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = theme.colors.neutral.gray;
                      }}
                    />
                    <div style={{ 
                      fontSize: theme.typography.sizes.small, 
                      color: theme.colors.neutral.lightGray,
                      marginTop: theme.spacing.xs,
                      textAlign: 'right'
                    }}>
                      {formData.observacao.length}/1000 caracteres
                    </div>
                  </FormGroup>
                </FormSection>
              </div>

              {/* Upload de Documentos */}
              <div>
                <UploadSection>
                  <SectionTitle>
                    <Camera size={24} />
                    Verificação de Identidade
                  </SectionTitle>
                  
                  <FormGroup>
                    <Label>Frente do Documento</Label>
                    <FileUpload
                      label="a frente do documento"
                      accept="image/*,.pdf"
                      onFileSelect={setDocumentFile}
                      fileName={documentFile?.name}
                      onRemove={() => {
                        setDocumentFile(null);
                        setExistingPhotos(prev => ({ ...prev, fotoDocumento: null }));
                      }}
                      existingPhotoBase64={existingPhotos.fotoDocumento}
                      photoFileName={`documento_${formData.nome || 'cliente'}_${id}`}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Selfie</Label>
                    <FileUpload
                      label="uma selfie"
                      accept="image/*"
                      onFileSelect={setSelfieFile}
                      fileName={selfieFile?.name}
                      onRemove={() => {
                        setSelfieFile(null);
                        setExistingPhotos(prev => ({ ...prev, fotoSelfie: null }));
                      }}
                      existingPhotoBase64={existingPhotos.fotoSelfie}
                      photoFileName={`selfie_${formData.nome || 'cliente'}_${id}`}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Documento Pessoal</Label>
                    <FileUpload
                      label="documento pessoal (RG, CNH, etc.)"
                      accept="image/*,.pdf"
                      onFileSelect={setDocumentoPessoalFile}
                      fileName={documentoPessoalFile?.name}
                      onRemove={() => {
                        setDocumentoPessoalFile(null);
                        setExistingPhotos(prev => ({ ...prev, documentoPessoal: null }));
                      }}
                      existingPhotoBase64={existingPhotos.documentoPessoal}
                      photoFileName={`documento_pessoal_${formData.nome || 'cliente'}_${id}`}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Extrato Bancário ou Comprovante de Renda</Label>
                    <FileUpload
                      label="extrato bancário ou comprovante de renda"
                      accept="image/*,.pdf"
                      onFileSelect={setExtratoBancarioFile}
                      fileName={extratoBancarioFile?.name}
                      onRemove={() => {
                        setExtratoBancarioFile(null);
                        setExistingPhotos(prev => ({ ...prev, extratoBancarioComprovanteRenda: null }));
                      }}
                      existingPhotoBase64={existingPhotos.extratoBancarioComprovanteRenda}
                      photoFileName={`extrato_bancario_${formData.nome || 'cliente'}_${id}`}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Comprovante de Endereço</Label>
                    <FileUpload
                      label="comprovante de endereço"
                      accept="image/*,.pdf"
                      onFileSelect={setComprovanteEnderecoFile}
                      fileName={comprovanteEnderecoFile?.name}
                      onRemove={() => {
                        setComprovanteEnderecoFile(null);
                        setExistingPhotos(prev => ({ ...prev, comprovanteEndereco: null }));
                      }}
                      existingPhotoBase64={existingPhotos.comprovanteEndereco}
                      photoFileName={`comprovante_endereco_${formData.nome || 'cliente'}_${id}`}
                    />
                  </FormGroup>
                </UploadSection>
              </div>
            </Grid>

            {errors.submit && (
              <div style={{ 
                color: theme.colors.accent.red, 
                marginTop: theme.spacing.md,
                textAlign: 'center' 
              }}>
                {errors.submit}
              </div>
            )}

            <ActionButtons>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate('/dashboard')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                <Save size={20} />
                {loading ? 'Atualizando...' : 'Atualizar Cliente'}
              </Button>
            </ActionButtons>
          </form>
        </Container>
      </MainContent>
      
      {/* Toast Notification */}
      {toast.show && (
        <Toast type={toast.type}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          {toast.message}
        </Toast>
      )}
    </>
  );
};

export default EditarCliente;
