import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  ArrowLeft, 
  User, 
  Users,
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  FileText, 
  Edit, 
  Save, 
  X,
  Upload,
  Eye,
  Download,
  Trash2,
  Briefcase,
  DollarSign
} from 'lucide-react';
import { theme } from '../styles/theme';
import { clientService } from '../services/clientService';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Input, Select, FormGroup } from '../components/ui/Input';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.neutral.white};
  padding-bottom: ${theme.spacing.xl};
`;

const Header = styled.header`
  background: ${theme.colors.neutral.white};
  border-bottom: 1px solid ${theme.colors.neutral.lightGray};
  padding: ${theme.spacing.md} 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sm} 0;
  }
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

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const BackButton = styled.button`
  background: ${theme.colors.neutral.white};
  border: 1px solid ${theme.colors.neutral.lightGray};
  border-radius: ${theme.borderRadius.medium};
  color: ${theme.colors.neutral.black};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${theme.colors.neutral.lightGray};
    transform: translateY(-1px);
  }
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.sizes.h2};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.neutral.black};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
    justify-content: space-between;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${theme.spacing.xs};
  }
`;

const MainContent = styled.main`
  padding: ${theme.spacing.lg} 0;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md} 0;
  }
`;

const ContentCard = styled.div`
  background: ${theme.colors.neutral.white};
  border: 1px solid ${theme.colors.neutral.lightGray};
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }
`;

const Section = styled.div`
  background: ${theme.colors.neutral.white};
  border: 1px solid ${theme.colors.neutral.lightGray};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.lg};
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.colors.neutral.lightGray};
    border-color: ${theme.colors.neutral.mediumGray};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md};
  }
`;

const SectionTitle = styled.h3`
  color: ${theme.colors.neutral.black};
  font-size: ${theme.typography.sizes.large};
  font-weight: ${theme.typography.weights.semiBold};
  margin: 0 0 ${theme.spacing.lg} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.neutral.lightGray};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, ${theme.colors.accent.red}, transparent);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.medium};
  }
`;

const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const Field = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const FieldLabel = styled.label`
  display: block;
  color: ${theme.colors.neutral.mediumGray};
  font-size: ${theme.typography.sizes.small};
  font-weight: ${theme.typography.weights.medium};
  margin-bottom: ${theme.spacing.xs};
`;

const FieldValue = styled.div`
  color: ${theme.colors.neutral.black};
  font-size: ${theme.typography.sizes.medium};
  padding: ${theme.spacing.sm} 0;
  min-height: 24px;
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
    switch (props.status) {
      case 'Pendente':
        return `
          background: rgba(251, 191, 36, 0.2);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.3);
        `;
      case 'Em Análise':
        return `
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.3);
        `;
      case 'Aprovado':
        return `
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        `;
      case 'Recusado':
        return `
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        `;
      case 'Vendido':
        return `
          background: rgba(168, 85, 247, 0.2);
          color: #a855f7;
          border: 1px solid rgba(168, 85, 247, 0.3);
        `;
      default:
        return `
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
          border: 1px solid rgba(156, 163, 175, 0.3);
        `;
    }
  }}
`;

const DocumentsSection = styled.div`
  grid-column: 1 / -1;
`;

const DocumentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: ${theme.spacing.md};
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing.sm};
  }
`;

const DocumentCard = styled.div`
  background: ${theme.colors.neutral.white};
  border: 1px solid ${theme.colors.neutral.lightGray};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.md};
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${theme.colors.neutral.lightGray};
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    border-color: ${theme.colors.neutral.mediumGray};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
  }
`;

const DocumentImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: ${theme.borderRadius.small};
  margin-bottom: ${theme.spacing.sm};
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 100px;
  }
`;

const DocumentActions = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
  justify-content: center;
  margin-top: ${theme.spacing.sm};
`;

const DocumentButton = styled.button`
  background: ${theme.colors.neutral.white};
  border: 1px solid ${theme.colors.neutral.lightGray};
  border-radius: ${theme.borderRadius.small};
  color: ${theme.colors.neutral.black};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;

  &:hover {
    background: ${theme.colors.neutral.lightGray};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &.delete:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: ${theme.colors.accent.red};
    color: ${theme.colors.accent.red};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    min-width: 32px;
    min-height: 32px;
    padding: ${theme.spacing.xxs};
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadArea = styled.div`
  border: 2px dashed ${theme.colors.neutral.mediumGray};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.neutral.mediumGray};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${theme.colors.neutral.black};
    background: ${theme.colors.neutral.lightGray};
  }

  &.dragover {
    border-color: ${theme.colors.accent.red};
    background: rgba(255, 59, 48, 0.1);
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
  border: 4px solid ${theme.colors.neutral.lightGray};
  border-top-color: ${theme.colors.accent.red};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ClienteDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.pathname.includes('/editar');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(isEditMode);
  const [cliente, setCliente] = useState(null);
  const [formData, setFormData] = useState({});
  const [documentos, setDocumentos] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCliente();
    setEditMode(isEditMode);
  }, [id, isEditMode]);

  const loadCliente = async () => {
    try {
      setLoading(true);
      const response = await clientService.getClientById(id);
      const data = response.data;
      setCliente(data);
      setFormData(data);
      await loadDocumentos();
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
      alert('Erro ao carregar dados do cliente');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadDocumentos = async () => {
    try {
      const fotos = await clientService.getFotosCliente(id);
      const documentosArray = [];
      
      if (fotos.fotoDocumento) {
        documentosArray.push({
          tipo: 'documento',
          nome: 'Foto do Documento',
          url: clientService.getArquivoUrl(cliente?.fotoDocumento || ''),
          base64: fotos.fotoDocumento
        });
      }
      
      if (fotos.fotoSelfie) {
        documentosArray.push({
          tipo: 'selfie',
          nome: 'Foto Selfie',
          url: clientService.getArquivoUrl(cliente?.fotoSelfie || ''),
          base64: fotos.fotoSelfie
        });
      }
      
      setDocumentos(documentosArray);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      setDocumentos([]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await clientService.updateClient(id, formData);
      const updatedData = response.data;
      setCliente(updatedData);
      setFormData(updatedData);
      // Navegar para a página de visualização após salvar
      navigate(`/cliente/${id}`);
      alert('Cliente atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      // Se estamos na rota de edição, navegar para visualização
      navigate(`/cliente/${id}`);
    } else {
      setFormData(cliente);
      setEditMode(false);
    }
  };

  const handleFileUpload = async (event, tipo) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo (imagens e PDFs)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Por favor, selecione apenas arquivos de imagem (JPEG, PNG, GIF) ou PDF.');
      return;
    }

    // Validar tamanho do arquivo (máximo 10MB para PDFs, 5MB para imagens)
    const maxSize = file.type === 'application/pdf' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeText = file.type === 'application/pdf' ? '10MB' : '5MB';
      alert(`O arquivo deve ter no máximo ${maxSizeText}.`);
      return;
    }

    try {
      setUploading(true);
      
      let response;
      if (tipo === 'documento') {
        response = await clientService.uploadFotoDocumento(id, file);
      } else if (tipo === 'selfie') {
        response = await clientService.uploadFotoSelfie(id, file);
      }

      if (response) {
        alert('Documento salvo automaticamente com sucesso!');
        await loadDocumentos(); // Recarregar documentos
        await loadCliente(); // Recarregar dados do cliente
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao enviar arquivo. Tente novamente.');
    } finally {
      setUploading(false);
      // Limpar o input
      event.target.value = '';
    }
  };

  const removeDocumento = async (tipo) => {
    if (!window.confirm(`Tem certeza que deseja excluir o ${tipo === 'documento' ? 'documento' : 'selfie'}?`)) {
      return;
    }

    setLoading(true);
    try {
      if (tipo === 'documento') {
        await clientService.deleteFotoDocumento(id);
        setCliente(prev => ({ ...prev, fotoDocumento: null }));
      } else if (tipo === 'selfie') {
        await clientService.deleteFotoSelfie(id);
        setCliente(prev => ({ ...prev, fotoSelfie: null }));
      }
      
      alert(`${tipo === 'documento' ? 'Documento' : 'Selfie'} excluído com sucesso!`);
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      alert('Erro ao excluir documento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatarDataHora = (dataString) => {
    if (!dataString) return 'Não informado';
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarRenda = (valor) => {
    if (!valor) return 'Não informado';
    
    try {
      const numero = parseFloat(valor);
      return numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    } catch (error) {
      return 'Valor inválido';
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return 'Não informado';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      </PageContainer>
    );
  }

  if (!cliente) {
    return (
      <PageContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
            Cliente não encontrado
          </div>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Container>
          <HeaderContent>
            <HeaderLeft>
              <BackButton onClick={() => navigate('/dashboard')}>
                <ArrowLeft size={20} />
              </BackButton>
              <PageTitle>
                <User size={24} />
                {editMode ? 'Editar Cliente' : 'Detalhes do Cliente'}
              </PageTitle>
            </HeaderLeft>
            <HeaderActions>
              {editMode ? (
                <>
                  <Button 
                    variant="secondary" 
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <X size={16} />
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <Save size={16} />
                    {saving ? 'Salvando...' : 'Salvar'}
                  </Button>
                </>
              ) : (
                <Button onClick={() => navigate(`/editar-cliente/${id}`)}>
                  <Edit size={16} />
                  Editar
                </Button>
              )}
            </HeaderActions>
          </HeaderContent>
        </Container>
      </Header>

      <MainContent>
        <Container>
          <ContentCard>
            <SectionGrid>
              <Section>
                <SectionTitle>
                  <User size={20} />
                  Informações Pessoais
                </SectionTitle>
                <FieldsGrid>
                  <Field>
                    <FieldLabel>Nome Completo</FieldLabel>
                    {editMode ? (
                      <Input
                        value={formData.nome || ''}
                        onChange={(e) => handleInputChange('nome', e.target.value)}
                        placeholder="Nome completo"
                      />
                    ) : (
                      <FieldValue>{cliente.nome}</FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>CPF</FieldLabel>
                    {editMode ? (
                      <Input
                        value={formData.cpf || ''}
                        onChange={(e) => handleInputChange('cpf', e.target.value)}
                        placeholder="000.000.000-00"
                      />
                    ) : (
                      <FieldValue>{cliente.cpf}</FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Data de Nascimento</FieldLabel>
                    {editMode ? (
                      <Input
                        type="date"
                        value={formData.dataNascimento || ''}
                        onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                      />
                    ) : (
                      <FieldValue>{formatarData(cliente.dataNascimento)}</FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Estado Civil</FieldLabel>
                    {editMode ? (
                      <Select
                        value={formData.estadoCivil || ''}
                        onChange={(e) => handleInputChange('estadoCivil', e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        <option value="Solteiro(a)">Solteiro(a)</option>
                        <option value="Casado(a)">Casado(a)</option>
                        <option value="Divorciado(a)">Divorciado(a)</option>
                        <option value="Viúvo(a)">Viúvo(a)</option>
                        <option value="União Estável">União Estável</option>
                      </Select>
                    ) : (
                      <FieldValue>{cliente.estadoCivil || 'Não informado'}</FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Sexo</FieldLabel>
                    {editMode ? (
                      <Select
                        value={formData.sexo || ''}
                        onChange={(e) => handleInputChange('sexo', e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Outro">Outro</option>
                      </Select>
                    ) : (
                      <FieldValue>{cliente.sexo || 'Não informado'}</FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>RG</FieldLabel>
                    {editMode ? (
                      <Input
                        value={formData.rg || ''}
                        onChange={(e) => handleInputChange('rg', e.target.value)}
                        placeholder="RG"
                      />
                    ) : (
                      <FieldValue>{cliente.rg || 'Não informado'}</FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Nome da Mãe</FieldLabel>
                    {editMode ? (
                      <Input
                        value={formData.nomeMae || ''}
                        onChange={(e) => handleInputChange('nomeMae', e.target.value)}
                        placeholder="Nome da mãe"
                      />
                    ) : (
                      <FieldValue>{cliente.nomeMae || 'Não informado'}</FieldValue>
                    )}
                  </Field>
                </FieldsGrid>
              </Section>

              <Section>
                <SectionTitle>
                  <Mail size={20} />
                  Contato
                </SectionTitle>
                <FieldsGrid>
                  <Field>
                    <FieldLabel>E-mail</FieldLabel>
                    {editMode ? (
                      <Input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="email@exemplo.com"
                      />
                    ) : (
                      <FieldValue>{cliente.email}</FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>WhatsApp</FieldLabel>
                    {editMode ? (
                      <Input
                        value={formData.whatsapp || ''}
                        onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                        placeholder="(00) 00000-0000"
                      />
                    ) : (
                      <FieldValue>{cliente.whatsapp}</FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>WhatsApp</FieldLabel>
                    {editMode ? (
                      <Input
                        value={formData.whatsapp || ''}
                        onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                        placeholder="(00) 00000-0000"
                      />
                    ) : (
                      <FieldValue>{cliente.whatsapp || 'Não informado'}</FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Telefone</FieldLabel>
                    {editMode ? (
                      <Input
                        value={formData.telefone || ''}
                        onChange={(e) => handleInputChange('telefone', e.target.value)}
                        placeholder="(00) 0000-0000"
                      />
                    ) : (
                      <FieldValue>{cliente.telefone || 'Não informado'}</FieldValue>
                    )}
                  </Field>
                </FieldsGrid>
              </Section>

              <Section>
                <SectionTitle>
                  <MapPin size={20} />
                  Endereço
                </SectionTitle>
                <FieldsGrid>
                  <Field>
                    <FieldLabel>CEP</FieldLabel>
                    {editMode ? (
                      <Input
                        value={formData.cep || ''}
                        onChange={(e) => handleInputChange('cep', e.target.value)}
                        placeholder="00000-000"
                      />
                    ) : (
                      <FieldValue>{cliente.cep || 'Não informado'}</FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Endereço</FieldLabel>
                    {editMode ? (
                      <Input
                        value={formData.endereco || ''}
                        onChange={(e) => handleInputChange('endereco', e.target.value)}
                        placeholder="Rua, número, complemento"
                      />
                    ) : (
                      <FieldValue>{cliente.endereco || 'Não informado'}</FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Cidade</FieldLabel>
                    {editMode ? (
                      <Input
                        value={formData.cidade || ''}
                        onChange={(e) => handleInputChange('cidade', e.target.value)}
                        placeholder="Cidade"
                      />
                    ) : (
                      <FieldValue>{cliente.cidade || 'Não informado'}</FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Estado</FieldLabel>
                    {editMode ? (
                      <Input
                        value={formData.estado || ''}
                        onChange={(e) => handleInputChange('estado', e.target.value)}
                        placeholder="UF"
                      />
                    ) : (
                      <FieldValue>{cliente.estado || 'Não informado'}</FieldValue>
                    )}
                  </Field>
                </FieldsGrid>
              </Section>

              <Section>
                <SectionTitle>
                  <Briefcase size={20} />
                  Informações Profissionais
                </SectionTitle>
                <FieldsGrid>
                  <Field>
                    <FieldLabel>Natureza da Ocupação</FieldLabel>
                    {editMode ? (
                      <Select
                        value={formData.naturezaOcupacao || ''}
                        onChange={(e) => handleInputChange('naturezaOcupacao', e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        <option value="AUTONOMO">Autônomo</option>
                        <option value="CLT">CLT</option>
                        <option value="APOSENTADO">Aposentado</option>
                        <option value="EMPRESARIO">Empresário</option>
                        <option value="FUNCIONARIO_PUBLICO">Funcionário Público</option>
                      </Select>
                    ) : (
                      <FieldValue>{cliente.naturezaOcupacao || 'Não informado'}</FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Profissão</FieldLabel>
                    {editMode ? (
                      <Input
                        value={formData.profissao || ''}
                        onChange={(e) => handleInputChange('profissao', e.target.value)}
                        placeholder="Profissão"
                      />
                    ) : (
                      <FieldValue>{cliente.profissao || 'Não informado'}</FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Nome da Empresa</FieldLabel>
                    {editMode ? (
                      <Input
                        value={formData.nomeEmpresa || ''}
                        onChange={(e) => handleInputChange('nomeEmpresa', e.target.value)}
                        placeholder="Nome da empresa"
                      />
                    ) : (
                      <FieldValue>{cliente.nomeEmpresa || 'Não informado'}</FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Renda Mensal</FieldLabel>
                    {editMode ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.rendaMensal || ''}
                        onChange={(e) => handleInputChange('rendaMensal', e.target.value)}
                        placeholder="0,00"
                      />
                    ) : (
                      <FieldValue>{formatarRenda(cliente.rendaMensal)}</FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Comprovação de Renda</FieldLabel>
                    {editMode ? (
                      <Select
                        value={formData.comprovacaoRenda || ''}
                        onChange={(e) => handleInputChange('comprovacaoRenda', e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        <option value="Contra cheque">Contra cheque</option>
                        <option value="Declaração de Imposto de Renda">Declaração de Imposto de Renda</option>
                        <option value="Extrato bancário">Extrato bancário</option>
                        <option value="Declaração de autônomo">Declaração de autônomo</option>
                        <option value="Outros">Outros</option>
                      </Select>
                    ) : (
                      <FieldValue>{cliente.comprovacaoRenda || 'Não informado'}</FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Carteira Assinada/Aposentado</FieldLabel>
                    {editMode ? (
                      <Select
                        value={formData.possuiCarteiraAssinadaOuAposentado || ''}
                        onChange={(e) => handleInputChange('possuiCarteiraAssinadaOuAposentado', e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </Select>
                    ) : (
                      <FieldValue>{cliente.possuiCarteiraAssinadaOuAposentado || 'Não informado'}</FieldValue>
                    )}
                  </Field>
                </FieldsGrid>
              </Section>

              <Section>
                <SectionTitle>
                  <Users size={20} />
                  Referências Pessoais
                </SectionTitle>
                <FieldsGrid>
                  {/* Referência 1 */}
                  <Field style={{ gridColumn: '1 / -1' }}>
                    <FieldLabel style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>
                      Referência 1
                    </FieldLabel>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div>
                        <FieldLabel>Nome</FieldLabel>
                        {editMode ? (
                          <Input
                            value={formData.referencia1Nome || ''}
                            onChange={(e) => handleInputChange('referencia1Nome', e.target.value)}
                            placeholder="Nome da referência"
                          />
                        ) : (
                          <FieldValue>{cliente.referencia1Nome || 'Não informado'}</FieldValue>
                        )}
                      </div>
                      <div>
                        <FieldLabel>Relação</FieldLabel>
                        {editMode ? (
                          <Input
                            value={formData.referencia1Relacao || ''}
                            onChange={(e) => handleInputChange('referencia1Relacao', e.target.value)}
                            placeholder="Ex: Amigo, Parente, Colega"
                          />
                        ) : (
                          <FieldValue>{cliente.referencia1Relacao || 'Não informado'}</FieldValue>
                        )}
                      </div>
                      <div>
                        <FieldLabel>WhatsApp</FieldLabel>
                        {editMode ? (
                          <Input
                            value={formData.referencia1Whatsapp || ''}
                            onChange={(e) => handleInputChange('referencia1Whatsapp', e.target.value)}
                            placeholder="(00) 00000-0000"
                          />
                        ) : (
                          <FieldValue>{cliente.referencia1Whatsapp || 'Não informado'}</FieldValue>
                        )}
                      </div>
                      <div>
                        <FieldLabel>Você conhece esta referência?</FieldLabel>
                        {editMode ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                            <input
                              type="checkbox"
                              checked={formData.referencia1Conhece || false}
                              onChange={(e) => handleInputChange('referencia1Conhece', e.target.checked)}
                              style={{ margin: 0 }}
                            />
                            <span style={{ color: '#666', fontSize: '14px' }}>Sim, conheço esta pessoa</span>
                          </div>
                        ) : (
                          <FieldValue>{cliente.referencia1Conhece ? 'Sim' : 'Não'}</FieldValue>
                        )}
                      </div>
                    </div>
                  </Field>

                  {/* Referência 2 */}
                  <Field style={{ gridColumn: '1 / -1' }}>
                    <FieldLabel style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>
                      Referência 2
                    </FieldLabel>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div>
                        <FieldLabel>Nome</FieldLabel>
                        {editMode ? (
                          <Input
                            value={formData.referencia2Nome || ''}
                            onChange={(e) => handleInputChange('referencia2Nome', e.target.value)}
                            placeholder="Nome da referência"
                          />
                        ) : (
                          <FieldValue>{cliente.referencia2Nome || 'Não informado'}</FieldValue>
                        )}
                      </div>
                      <div>
                        <FieldLabel>Relação</FieldLabel>
                        {editMode ? (
                          <Input
                            value={formData.referencia2Relacao || ''}
                            onChange={(e) => handleInputChange('referencia2Relacao', e.target.value)}
                            placeholder="Ex: Amigo, Parente, Colega"
                          />
                        ) : (
                          <FieldValue>{cliente.referencia2Relacao || 'Não informado'}</FieldValue>
                        )}
                      </div>
                      <div>
                        <FieldLabel>WhatsApp</FieldLabel>
                        {editMode ? (
                          <Input
                            value={formData.referencia2Whatsapp || ''}
                            onChange={(e) => handleInputChange('referencia2Whatsapp', e.target.value)}
                            placeholder="(00) 00000-0000"
                          />
                        ) : (
                          <FieldValue>{cliente.referencia2Whatsapp || 'Não informado'}</FieldValue>
                        )}
                      </div>
                      <div>
                        <FieldLabel>Você conhece esta referência?</FieldLabel>
                        {editMode ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                            <input
                              type="checkbox"
                              checked={formData.referencia2Conhece || false}
                              onChange={(e) => handleInputChange('referencia2Conhece', e.target.checked)}
                              style={{ margin: 0 }}
                            />
                            <span style={{ color: '#666', fontSize: '14px' }}>Sim, conheço esta pessoa</span>
                          </div>
                        ) : (
                          <FieldValue>{cliente.referencia2Conhece ? 'Sim' : 'Não'}</FieldValue>
                        )}
                      </div>
                    </div>
                  </Field>

                  {/* Referência 3 */}
                  <Field style={{ gridColumn: '1 / -1' }}>
                    <FieldLabel style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>
                      Referência 3
                    </FieldLabel>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div>
                        <FieldLabel>Nome</FieldLabel>
                        {editMode ? (
                          <Input
                            value={formData.referencia3Nome || ''}
                            onChange={(e) => handleInputChange('referencia3Nome', e.target.value)}
                            placeholder="Nome da referência"
                          />
                        ) : (
                          <FieldValue>{cliente.referencia3Nome || 'Não informado'}</FieldValue>
                        )}
                      </div>
                      <div>
                        <FieldLabel>Relação</FieldLabel>
                        {editMode ? (
                          <Input
                            value={formData.referencia3Relacao || ''}
                            onChange={(e) => handleInputChange('referencia3Relacao', e.target.value)}
                            placeholder="Ex: Amigo, Parente, Colega"
                          />
                        ) : (
                          <FieldValue>{cliente.referencia3Relacao || 'Não informado'}</FieldValue>
                        )}
                      </div>
                      <div>
                        <FieldLabel>WhatsApp</FieldLabel>
                        {editMode ? (
                          <Input
                            value={formData.referencia3Whatsapp || ''}
                            onChange={(e) => handleInputChange('referencia3Whatsapp', e.target.value)}
                            placeholder="(00) 00000-0000"
                          />
                        ) : (
                          <FieldValue>{cliente.referencia3Whatsapp || 'Não informado'}</FieldValue>
                        )}
                      </div>
                      <div>
                        <FieldLabel>Você conhece esta referência?</FieldLabel>
                        {editMode ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                            <input
                              type="checkbox"
                              checked={formData.referencia3Conhece || false}
                              onChange={(e) => handleInputChange('referencia3Conhece', e.target.checked)}
                              style={{ margin: 0 }}
                            />
                            <span style={{ color: '#666', fontSize: '14px' }}>Sim, conheço esta pessoa</span>
                          </div>
                        ) : (
                          <FieldValue>{cliente.referencia3Conhece ? 'Sim' : 'Não'}</FieldValue>
                        )}
                      </div>
                    </div>
                  </Field>
                </FieldsGrid>
              </Section>

              <Section>
                <SectionTitle>
                  <Calendar size={20} />
                  Status e Datas
                </SectionTitle>
                <FieldsGrid>
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    {editMode ? (
                      <Select
                        value={formData.status || ''}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Em Análise">Em Análise</option>
                        <option value="Aprovado">Aprovado</option>
                        <option value="Recusado">Recusado</option>
                        <option value="Vendido">Vendido</option>
                      </Select>
                    ) : (
                      <FieldValue>
                        <StatusBadge status={cliente.status}>
                          {cliente.status}
                        </StatusBadge>
                      </FieldValue>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Data de Cadastro</FieldLabel>
                    <FieldValue>{formatarDataHora(cliente.dataCadastro)}</FieldValue>
                  </Field>
                  <Field>
                    <FieldLabel>Última Atualização</FieldLabel>
                    <FieldValue>
                      {cliente.dataAtualizacao ? formatarDataHora(cliente.dataAtualizacao) : 'Não atualizado'}
                    </FieldValue>
                  </Field>
                </FieldsGrid>
              </Section>

              <DocumentsSection>
                <Section>
                  <SectionTitle>
                    <FileText size={20} />
                    Documentos
                  </SectionTitle>
                  {editMode && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ 
                        background: 'rgba(59, 130, 246, 0.1)', 
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: theme.borderRadius.medium,
                        padding: theme.spacing.sm,
                        marginBottom: theme.spacing.md,
                        color: '#60a5fa',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing.xs
                      }}>
                        ℹ️ Os documentos são salvos automaticamente após o upload
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <HiddenFileInput
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileUpload(e, 'documento')}
                          id="documento-upload"
                          disabled={uploading}
                        />
                        <label htmlFor="documento-upload">
                          <Button as="span" variant="secondary" disabled={uploading}>
                            📄 {uploading ? 'Enviando...' : 'Documento (Foto/PDF)'}
                          </Button>
                        </label>
                      </div>
                      
                      <div>
                        <HiddenFileInput
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileUpload(e, 'selfie')}
                          id="selfie-upload"
                          disabled={uploading}
                        />
                        <label htmlFor="selfie-upload">
                          <Button as="span" variant="secondary" disabled={uploading}>
                            🤳 {uploading ? 'Enviando...' : 'Selfie (Foto/PDF)'}
                          </Button>
                        </label>
                      </div>
                    </div>
                  )}
                  <DocumentsGrid>
                    {!cliente.fotoDocumento && !cliente.fotoSelfie ? (
                      <div style={{ 
                        gridColumn: '1 / -1', 
                        textAlign: 'center', 
                        color: theme.colors.neutral.mediumGray,
                        padding: '2rem'
                      }}>
                        Nenhum documento enviado
                      </div>
                    ) : (
                      <>
                        {cliente.fotoDocumento && (
                          <DocumentCard>
                            <DocumentImage 
                              src={cliente.fotoDocumento} 
                              alt="Documento do cliente" 
                            />
                            <div style={{ color: theme.colors.neutral.white, fontSize: '0.875rem' }}>
                              Documento
                            </div>
                            <DocumentActions>
                              <DocumentButton 
                                title="Visualizar"
                                onClick={() => window.open(cliente.fotoDocumento, '_blank')}
                              >
                                <Eye size={16} />
                              </DocumentButton>
                              <DocumentButton 
                                title="Download"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = cliente.fotoDocumento;
                                  link.download = `documento_${cliente.nome || 'cliente'}.jpg`;
                                  link.click();
                                }}
                              >
                                <Download size={16} />
                              </DocumentButton>
                              {editMode && (
                                <DocumentButton 
                                  className="delete" 
                                  title="Excluir documento"
                                  onClick={() => removeDocumento('documento')}
                                >
                                  <Trash2 size={16} />
                                </DocumentButton>
                              )}
                            </DocumentActions>
                          </DocumentCard>
                        )}
                        
                        {cliente.fotoSelfie && (
                          <DocumentCard>
                            <DocumentImage 
                              src={cliente.fotoSelfie} 
                              alt="Selfie do cliente" 
                            />
                            <div style={{ color: theme.colors.neutral.white, fontSize: '0.875rem' }}>
                              Selfie
                            </div>
                            <DocumentActions>
                              <DocumentButton 
                                title="Visualizar"
                                onClick={() => window.open(cliente.fotoSelfie, '_blank')}
                              >
                                <Eye size={16} />
                              </DocumentButton>
                              <DocumentButton 
                                title="Download"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = cliente.fotoSelfie;
                                  link.download = `selfie_${cliente.nome || 'cliente'}.jpg`;
                                  link.click();
                                }}
                              >
                                <Download size={16} />
                              </DocumentButton>
                              {editMode && (
                                <DocumentButton 
                                  className="delete" 
                                  title="Excluir selfie"
                                  onClick={() => removeDocumento('selfie')}
                                >
                                  <Trash2 size={16} />
                                </DocumentButton>
                              )}
                            </DocumentActions>
                          </DocumentCard>
                        )}
                      </>
                    )}
                  </DocumentsGrid>
                </Section>
              </DocumentsSection>
            </SectionGrid>
          </ContentCard>
        </Container>
      </MainContent>

      {saving && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
    </PageContainer>
  );
};

export default ClienteDetalhes;