import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Save, User, Mail, CreditCard, Heart, Calendar, MessageCircle, MapPin, Building2, Wallet, CheckCircle2 } from 'lucide-react';
import { clientService } from '../services/clientService';
import { viaCepService } from '../services/viaCepService';
import { Button } from '../components/ui/Button';
import { Input, Select, FormGroup, Label, ErrorMessage } from '../components/ui/Input';
import { MaskedInput } from '../components/ui/MaskedInput';
import { theme } from '../styles/theme';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    #0D0A1F 0%, 
    #1A0F2E 30%,
    #2D1B3D 60%,
    #7A1E1C 90%,
    #B22A1F 100%
  );
  padding: ${theme.spacing.xl} ${theme.spacing.md};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  animation: fadeIn 0.6s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.neutral.white};
  margin-bottom: ${theme.spacing.sm};
  background: linear-gradient(45deg, #ffffff, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.neutral.lightGray};
`;

const FormCard = styled.form`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.xl};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.6s ease-out;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.lg};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${theme.typography.sizes.h2};
  font-weight: ${theme.typography.weights.semiBold};
  color: ${theme.colors.neutral.white};
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes.h3};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: ${theme.colors.accent.red};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const CadastroCliente = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    estadoCivil: '',
    dataNascimento: '',
    email: '',
    whatsapp: '',
    cep: '',
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
    numero: '',
    complemento: '',
    nomeEmpresa: '',
    possuiCarteiraAssinadaOuAposentado: '',
    rendaMensal: '',
    comprovacaoRenda: '',
    // Primeira Referência
    referencia1Nome: '',
    referencia1Relacao: '',
    referencia1Whatsapp: '',
    // Segunda Referência
    referencia2Nome: '',
    referencia2Relacao: '',
    referencia2Whatsapp: '',
    // Terceira Referência
    referencia3Nome: '',
    referencia3Relacao: '',
    referencia3Whatsapp: ''
  });
  
  const estadosCivis = [
    'Solteiro(a)',
    'Casado(a)',
    'Divorciado(a)',
    'Viúvo(a)',
    'União Estável'
  ];
  
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // ViaCEP auto-fill quando CEP completo
    if (name === 'cep') {
      const onlyDigits = value.replace(/\D/g, '');
      if (onlyDigits.length === 8) {
        try {
          const endereco = await viaCepService.buscarCep(value);
          if (endereco && !endereco.erro) {
            setFormData(prev => ({
              ...prev,
              cep: viaCepService.formatarCep(endereco.cep || value),
              rua: endereco.logradouro || '',
              bairro: endereco.bairro || '',
              cidade: endereco.cidade || '',
              estado: endereco.estado || ''
            }));
          }
        } catch (err) {
          console.error('Erro ao buscar CEP:', err);
          setErrors(prev => ({ ...prev, cep: 'CEP inválido ou não encontrado' }));
        }
      } else {
        // limpar auto-fill se incompleto
        setFormData(prev => ({
          ...prev,
          rua: '', bairro: '', cidade: '', estado: ''
        }));
      }
    }
  };

  const goNext = () => setStep(prev => Math.min(prev + 1, 4));
  const goBack = () => setStep(prev => Math.max(prev - 1, 1));
  
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome completo é obrigatório';
    }
    
    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (formData.cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF inválido';
    }
    
    if (!formData.estadoCivil) {
      newErrors.estadoCivil = 'Estado civil é obrigatório';
    }
    
    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    } else {
      // Validar formato DD/MM/AAAA
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (!dateRegex.test(formData.dataNascimento)) {
        newErrors.dataNascimento = 'Data inválida. Use DD/MM/AAAA';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.whatsapp) {
      newErrors.whatsapp = 'WhatsApp é obrigatório';
    } else if (formData.whatsapp.replace(/\D/g, '').length < 10) {
      newErrors.whatsapp = 'WhatsApp inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors = {};
    const cepDigits = formData.cep.replace(/\D/g, '');
    if (!cepDigits || cepDigits.length !== 8) newErrors.cep = 'CEP válido é obrigatório';
    if (!formData.rua.trim()) newErrors.rua = 'Rua (logradouro) é obrigatório';
    if (!formData.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório';
    if (!formData.cidade.trim()) newErrors.cidade = 'Município é obrigatório';
    if (!formData.estado.trim()) newErrors.estado = 'UF é obrigatório';
    // número e complemento opcionais: sem validação obrigatória
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.nomeEmpresa.trim()) newErrors.nomeEmpresa = 'Empresa onde trabalha é obrigatória';
    if (!formData.possuiCarteiraAssinadaOuAposentado) newErrors.possuiCarteiraAssinadaOuAposentado = 'Informe se possui carteira assinada/aposentado/pensionista';
    if (!formData.rendaMensal) newErrors.rendaMensal = 'Renda mensal é obrigatória';
    if (!formData.comprovacaoRenda) newErrors.comprovacaoRenda = 'Informe como comprova renda';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors = {};
    
    // Validar primeira referência
    const ref1WhatsApp = (formData.referencia1Whatsapp || '').replace(/\D/g, '');
    const hasRef1 = formData.referencia1Nome.trim() || formData.referencia1Relacao.trim() || ref1WhatsApp;
    
    if (hasRef1) {
      if (!formData.referencia1Nome.trim()) newErrors.referencia1Nome = 'Nome é obrigatório';
      if (!formData.referencia1Relacao.trim()) newErrors.referencia1Relacao = 'Relação é obrigatória';
      if (!ref1WhatsApp || ref1WhatsApp.length < 10) newErrors.referencia1Whatsapp = 'WhatsApp inválido';
    }
    
    // Validar segunda referência
    const ref2WhatsApp = (formData.referencia2Whatsapp || '').replace(/\D/g, '');
    const hasRef2 = formData.referencia2Nome.trim() || formData.referencia2Relacao.trim() || ref2WhatsApp;
    
    if (hasRef2) {
      if (!formData.referencia2Nome.trim()) newErrors.referencia2Nome = 'Nome é obrigatório';
      if (!formData.referencia2Relacao.trim()) newErrors.referencia2Relacao = 'Relação é obrigatória';
      if (!ref2WhatsApp || ref2WhatsApp.length < 10) newErrors.referencia2Whatsapp = 'WhatsApp inválido';
    }
    
    // Validar terceira referência
    const ref3WhatsApp = (formData.referencia3Whatsapp || '').replace(/\D/g, '');
    const hasRef3 = formData.referencia3Nome.trim() || formData.referencia3Relacao.trim() || ref3WhatsApp;
    
    if (hasRef3) {
      if (!formData.referencia3Nome.trim()) newErrors.referencia3Nome = 'Nome é obrigatório';
      if (!formData.referencia3Relacao.trim()) newErrors.referencia3Relacao = 'Relação é obrigatória';
      if (!ref3WhatsApp || ref3WhatsApp.length < 10) newErrors.referencia3Whatsapp = 'WhatsApp inválido';
    }
    
    // Verificar se pelo menos uma referência completa foi preenchida
    const validRefs = [hasRef1, hasRef2, hasRef3].filter(Boolean);
    if (validRefs.length === 0) {
      newErrors.referencias = 'Informe pelo menos uma referência completa.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1 && validateStep1()) return goNext();
    if (step === 2 && validateStep2()) return goNext();
    if (step === 3 && validateStep3()) return goNext();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep4()) return;
    
    setLoading(true);
    
    try {
      // Converter data de DD/MM/AAAA para AAAA-MM-DD
      const [dia, mes, ano] = formData.dataNascimento.split('/');
      const dataFormatada = `${ano}-${mes}-${dia}`;
      
      const clienteData = {
        nome: formData.nome,
        cpf: formData.cpf.replace(/\D/g, ''),
        estadoCivil: formData.estadoCivil,
        dataNascimento: dataFormatada,
        email: formData.email,
        whatsapp: formData.whatsapp.replace(/\D/g, ''),
        cep: formData.cep.replace(/\D/g, ''),
        rua: formData.rua,
        numero: formData.numero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        nomeEmpresa: formData.nomeEmpresa,
        rendaMensal: parseFloat(String(formData.rendaMensal).replace(',', '.')),
        naturezaOcupacao: formData.possuiCarteiraAssinadaOuAposentado === 'sim' ? 'CLT/APOSENTADO' : 'AUTONOMO',
        profissao: '',
        comprovacaoRenda: formData.comprovacaoRenda,
        // Primeira Referência
        referencia1Nome: formData.referencia1Nome,
        referencia1Relacao: formData.referencia1Relacao,
        referencia1Whatsapp: (formData.referencia1Whatsapp || '').replace(/\D/g, ''),
        // Segunda Referência
        referencia2Nome: formData.referencia2Nome,
        referencia2Relacao: formData.referencia2Relacao,
        referencia2Whatsapp: (formData.referencia2Whatsapp || '').replace(/\D/g, ''),
        // Terceira Referência
        referencia3Nome: formData.referencia3Nome,
        referencia3Relacao: formData.referencia3Relacao,
        referencia3Whatsapp: (formData.referencia3Whatsapp || '').replace(/\D/g, '')
      };
      
      await clientService.createClient(clienteData);
      
      alert('Cliente cadastrado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      alert(error.response?.data?.erro || 'Erro ao cadastrar cliente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <PageContainer>
      <Container>
        <Header>
          <Title>Análise Segura e Inteligente</Title>
          <Subtitle>Preencha seus dados para continuar</Subtitle>
        </Header>
        
        <FormCard onSubmit={step === 4 ? handleSubmit : handleNext}>
          {/* Barra de etapas */}
          <SectionTitle>
            <CheckCircle2 size={24} />
            Etapas do Cadastro
          </SectionTitle>
          <FormGrid style={{ marginBottom: theme.spacing.md }}>
            <FullWidth>
              <div style={{ display: 'flex', gap: theme.spacing.md }}>
                <div style={{ flex: 1, height: '6px', background: step >= 1 ? theme.colors.accent.red : 'rgba(255,255,255,0.2)', borderRadius: '4px' }} />
                <div style={{ flex: 1, height: '6px', background: step >= 2 ? theme.colors.accent.red : 'rgba(255,255,255,0.2)', borderRadius: '4px' }} />
                <div style={{ flex: 1, height: '6px', background: step >= 3 ? theme.colors.accent.red : 'rgba(255,255,255,0.2)', borderRadius: '4px' }} />
                <div style={{ flex: 1, height: '6px', background: step >= 4 ? theme.colors.accent.red : 'rgba(255,255,255,0.2)', borderRadius: '4px' }} />
              </div>
          </FullWidth>
        </FormGrid>

          {step === 1 && (
            <>
              <SectionTitle>
                <User size={24} />
                Dados Pessoais
              </SectionTitle>
              <FormGrid>
                <FullWidth>
                  <FormGroup>
                    <Label>
                      <User size={16} />
                      Nome Completo *
                    </Label>
                    <Input
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Digite seu nome completo"
                      $error={!!errors.nome}
                    />
                    {errors.nome && <ErrorMessage>{errors.nome}</ErrorMessage>}
                  </FormGroup>
                </FullWidth>
                <FormGroup>
                  <Label>
                    <CreditCard size={16} />
                    CPF *
                  </Label>
                  <MaskedInput
                    name="cpf"
                    mask="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    $error={!!errors.cpf}
                  />
                  {errors.cpf && <ErrorMessage>{errors.cpf}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label>
                    <Heart size={16} />
                    Estado Civil *
                  </Label>
                  <Select
                    name="estadoCivil"
                    value={formData.estadoCivil}
                    onChange={handleChange}
                    $error={!!errors.estadoCivil}
                  >
                    <option value="">Selecione seu estado civil</option>
                    {estadosCivis.map(estado => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </Select>
                  {errors.estadoCivil && <ErrorMessage>{errors.estadoCivil}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label>
                    <Calendar size={16} />
                    Data de Nascimento *
                  </Label>
                  <MaskedInput
                    name="dataNascimento"
                    mask="date"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    placeholder="DD/MM/AAAA"
                    $error={!!errors.dataNascimento}
                  />
                  {errors.dataNascimento && <ErrorMessage>{errors.dataNascimento}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label>
                    <Mail size={16} />
                    Email *
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    $error={!!errors.email}
                  />
                  {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label>
                    <MessageCircle size={16} />
                    WhatsApp *
                  </Label>
                  <MaskedInput
                    name="whatsapp"
                    mask="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    $error={!!errors.whatsapp}
                  />
                  {errors.whatsapp && <ErrorMessage>{errors.whatsapp}</ErrorMessage>}
                </FormGroup>
              </FormGrid>
            </>
          )}

          {step === 2 && (
            <>
              <SectionTitle>
                <MapPin size={24} />
                Endereço
              </SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label>
                    <MapPin size={16} />
                    CEP *
                  </Label>
                  <MaskedInput
                    name="cep"
                    mask="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    placeholder="00000-000"
                    $error={!!errors.cep}
                  />
                  {errors.cep && <ErrorMessage>{errors.cep}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label>
                    Logradouro (Rua) *
                  </Label>
                  <Input
                    name="rua"
                    value={formData.rua}
                    onChange={handleChange}
                    placeholder="Rua retornada pelo ViaCEP"
                    $error={!!errors.rua}
                  />
                  {errors.rua && <ErrorMessage>{errors.rua}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label>
                    Bairro *
                  </Label>
                  <Input
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    placeholder="Bairro retornado pelo ViaCEP"
                    $error={!!errors.bairro}
                  />
                  {errors.bairro && <ErrorMessage>{errors.bairro}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label>
                    Município *
                  </Label>
                  <Input
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    placeholder="Localidade retornada pelo ViaCEP"
                    $error={!!errors.cidade}
                  />
                  {errors.cidade && <ErrorMessage>{errors.cidade}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label>
                    UF *
                  </Label>
                  <Input
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    placeholder="UF"
                    $error={!!errors.estado}
                  />
                  {errors.estado && <ErrorMessage>{errors.estado}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label>
                    Número (opcional)
                  </Label>
                  <Input
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    placeholder="Número"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    Complemento (opcional)
                  </Label>
                  <Input
                    name="complemento"
                    value={formData.complemento}
                    onChange={handleChange}
                    placeholder="Apto, bloco, casa"
                  />
                </FormGroup>
              </FormGrid>
            </>
          )}

          {step === 3 && (
            <>
              <SectionTitle>
                <Building2 size={24} />
                Emprego e Renda
              </SectionTitle>
              <FormGrid>
                <FullWidth>
                  <FormGroup>
                    <Label>
                      Empresa onde trabalha *
                    </Label>
                    <Input
                      name="nomeEmpresa"
                      value={formData.nomeEmpresa}
                      onChange={handleChange}
                      placeholder="Nome da empresa"
                      $error={!!errors.nomeEmpresa}
                    />
                    {errors.nomeEmpresa && <ErrorMessage>{errors.nomeEmpresa}</ErrorMessage>}
                  </FormGroup>
                </FullWidth>
                <FormGroup>
                  <Label>
                    Possui carteira assinada ou é aposentado/pensionista? *
                  </Label>
                  <Select
                    name="possuiCarteiraAssinadaOuAposentado"
                    value={formData.possuiCarteiraAssinadaOuAposentado}
                    onChange={handleChange}
                    $error={!!errors.possuiCarteiraAssinadaOuAposentado}
                  >
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </Select>
                  {errors.possuiCarteiraAssinadaOuAposentado && <ErrorMessage>{errors.possuiCarteiraAssinadaOuAposentado}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label>
                    Como você pode comprovar renda? *
                  </Label>
                  <Select
                    name="comprovacaoRenda"
                    value={formData.comprovacaoRenda}
                    onChange={handleChange}
                    $error={!!errors.comprovacaoRenda}
                  >
                    <option value="">Selecione</option>
                    <option value="Carteira de trabalho">Carteira de trabalho</option>
                    <option value="Contra cheque">Contra cheque</option>
                    <option value="Outros">Outros</option>
                  </Select>
                  {errors.comprovacaoRenda && <ErrorMessage>{errors.comprovacaoRenda}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label>
                    <Wallet size={16} />
                    Renda Mensal *
                  </Label>
                  <Input
                    name="rendaMensal"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.rendaMensal}
                    onChange={handleChange}
                    placeholder="0,00"
                    $error={!!errors.rendaMensal}
                  />
                  {errors.rendaMensal && <ErrorMessage>{errors.rendaMensal}</ErrorMessage>}
                </FormGroup>
              </FormGrid>
            </>
          )}

          {step === 4 && (
            <>
              <SectionTitle>
                <MessageCircle size={24} />
                Referências de Contato
              </SectionTitle>
              <FormGrid>
                <FullWidth>
                  <p style={{ color: theme.colors.neutral.lightGray, marginBottom: theme.spacing.md }}>
                    Informe dados de até três pessoas que possam confirmar suas informações. Pelo menos uma referência completa é obrigatória.
                  </p>
                  {errors.referencias && <ErrorMessage>{errors.referencias}</ErrorMessage>}
                </FullWidth>
                
                {/* Primeira Referência */}
                <FullWidth>
                  <h3 style={{ color: theme.colors.neutral.white, marginBottom: theme.spacing.md, fontSize: '1.1rem' }}>
                    1. Primeira Referência
                  </h3>
                </FullWidth>
                <FormGroup>
                  <Label>Nome *</Label>
                  <Input
                    name="referencia1Nome"
                    value={formData.referencia1Nome}
                    onChange={handleChange}
                    placeholder="Nome completo"
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
                    name="referencia1Whatsapp"
                    mask="phone"
                    value={formData.referencia1Whatsapp}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    $error={!!errors.referencia1Whatsapp}
                  />
                  {errors.referencia1Whatsapp && <ErrorMessage>{errors.referencia1Whatsapp}</ErrorMessage>}
                </FormGroup>
                
                {/* Segunda Referência */}
                <FullWidth>
                  <h3 style={{ color: theme.colors.neutral.white, marginBottom: theme.spacing.md, fontSize: '1.1rem', marginTop: theme.spacing.lg }}>
                    2. Segunda Referência
                  </h3>
                </FullWidth>
                <FormGroup>
                  <Label>Nome</Label>
                  <Input
                    name="referencia2Nome"
                    value={formData.referencia2Nome}
                    onChange={handleChange}
                    placeholder="Nome completo"
                    $error={!!errors.referencia2Nome}
                  />
                  {errors.referencia2Nome && <ErrorMessage>{errors.referencia2Nome}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label>Relação</Label>
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
                  <Label>WhatsApp</Label>
                  <MaskedInput
                    name="referencia2Whatsapp"
                    mask="phone"
                    value={formData.referencia2Whatsapp}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    $error={!!errors.referencia2Whatsapp}
                  />
                  {errors.referencia2Whatsapp && <ErrorMessage>{errors.referencia2Whatsapp}</ErrorMessage>}
                </FormGroup>
                
                {/* Terceira Referência */}
                <FullWidth>
                  <h3 style={{ color: theme.colors.neutral.white, marginBottom: theme.spacing.md, fontSize: '1.1rem', marginTop: theme.spacing.lg }}>
                    3. Terceira Referência
                  </h3>
                </FullWidth>
                <FormGroup>
                  <Label>Nome</Label>
                  <Input
                    name="referencia3Nome"
                    value={formData.referencia3Nome}
                    onChange={handleChange}
                    placeholder="Nome completo"
                    $error={!!errors.referencia3Nome}
                  />
                  {errors.referencia3Nome && <ErrorMessage>{errors.referencia3Nome}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label>Relação</Label>
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
                  <Label>WhatsApp</Label>
                  <MaskedInput
                    name="referencia3Whatsapp"
                    mask="phone"
                    value={formData.referencia3Whatsapp}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    $error={!!errors.referencia3Whatsapp}
                  />
                  {errors.referencia3Whatsapp && <ErrorMessage>{errors.referencia3Whatsapp}</ErrorMessage>}
                </FormGroup>
              </FormGrid>
            </>
          )}

          <ActionButtons>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={step === 1 ? () => navigate('/') : goBack}
            >
              <ArrowLeft size={20} />
              Voltar
            </Button>
            {step < 4 ? (
              <Button type="submit" variant="primary">
                Próximo
              </Button>
            ) : (
              <Button type="submit" variant="primary">
                <Save size={20} />
                Cadastrar
              </Button>
            )}
          </ActionButtons>
        </FormCard>
      </Container>
      
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
    </PageContainer>
  );
};

export default CadastroCliente;
