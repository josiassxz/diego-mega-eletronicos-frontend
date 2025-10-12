
# Mega Eletrônicos GO - Frontend React

## 📋 Descrição

Sistema completo de cadastro de clientes para a empresa "Mega Eletrônicos GO" desenvolvido em React com styled-components, seguindo o design especificado do PDF com cores roxo escuro (#11061e) e vermelho (#fe422e).

## 🚀 Funcionalidades

✅ **Tela de Login**
- Autenticação com email e senha
- Validações de formulário
- Design responsivo com gradiente

✅ **Dashboard de Clientes**
- Listagem de todos os clientes
- Sistema de busca por nome, email, telefone ou CPF
- Cards interativos com informações essenciais
- Botões de ação (editar/excluir)

✅ **Cadastro Completo de Clientes**
- Formulário com todos os campos especificados:
  - Dados Pessoais (nome, email, CPF, RG, telefone)
  - Endereço (CEP, rua, número, bairro, cidade, estado)
  - Dados Adicionais (nome da mãe, data nascimento, sexo, estado civil, ocupação, profissão, empresa, renda)
- Upload de documentos (frente do documento e selfie)
- Validações em tempo real
- Máscaras para CPF, telefone e CEP

✅ **Edição de Clientes**
- Carregamento automático dos dados existentes
- Formulário idêntico ao cadastro
- Atualização de fotos opcionais

✅ **Design System Completo**
- Componentes reutilizáveis (Button, Input, Card, FileUpload, etc.)
- Tema consistente com as cores especificadas
- Responsividade mobile-first
- Animações e transições suaves

## 🎨 Design

### Cores Utilizadas
- **Roxo Escuro Principal**: `#11061e` (fundo dominante)
- **Vermelho/Laranja**: `#fe422e` (botões CTA e elementos de ação)
- **Gradiente de Fundo**: Linear gradient do roxo escuro para tons avermelhados
- **Branco**: `#ffffff` (texto principal)
- **Cinzas**: Para texto secundário e elementos sutis

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Pesos**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Hierarquia**: Hero (48px), H1 (32px), H2 (24px), H3 (20px), Body (16px), Small (14px)

## 🔧 Tecnologias

- **React** 19.1.1
- **React Router DOM** 7.9.2 (Navegação entre páginas)
- **Styled Components** 6.1.19 (CSS-in-JS)
- **Axios** 1.12.2 (Requisições HTTP)
- **Lucide React** 0.544.0 (Ícones)
- **React Input Mask** 2.0.4 (Máscaras de input)
- **React Scripts** 5.0.1 (Build e desenvolvimento)

## 🚀 Como Executar

### Pré-requisitos
- Node.js instalado
- Backend Spring Boot rodando em `http://localhost:8080`

### Instalação
```bash
cd /home/ubuntu/mega-eletronicos-frontend
npm install
npm start
```

A aplicação estará disponível em: `http://localhost:3000`

## 🔐 Credenciais de Teste

Para testar a aplicação, use as seguintes credenciais:

**Login:**
- Email: `admin`
- Senha: `admin123`

> **Importante**: O sistema está configurado com um modo de demonstração que permite login offline quando o backend não está disponível ou não tem usuários cadastrados.

## 📡 Integração com Backend

### Endpoints Utilizados
- `POST /api/auth/login` - Autenticação
- `GET /api/clientes` - Listar clientes
- `GET /api/clientes/{id}` - Obter cliente por ID
- `POST /api/clientes` - Criar novo cliente
- `PUT /api/clientes/{id}` - Atualizar cliente
- `DELETE /api/clientes/{id}` - Excluir cliente
- `POST /api/clientes/{id}/upload/{type}` - Upload de fotos

### Configuração da API
A base URL da API está configurada para `http://localhost:8080/api` no arquivo `src/services/api.js`.

## 📱 Responsividade

A aplicação é totalmente responsiva com breakpoints:
- **Mobile**: até 480px
- **Tablet**: 481px a 768px
- **Desktop**: 769px a 1024px
- **Large**: acima de 1024px

## 🎯 Fluxo de Uso

1. **Login**: Usuário faz login com credenciais
2. **Dashboard**: Visualiza lista de clientes com opção de busca
3. **Novo Cliente**: Clica em "Novo Cliente" para abrir formulário de cadastro
4. **Preenchimento**: Preenche todos os dados obrigatórios e opcionais
5. **Upload**: Faz upload das fotos (documento e selfie)
6. **Salvamento**: Cliente é salvo no backend
7. **Edição**: Pode editar qualquer cliente existente
8. **Exclusão**: Pode excluir clientes com confirmação

## 📁 Estrutura do Projeto

```
src/
├── components/
│   └── ui/
│       ├── Button.js
│       ├── Card.js
│       ├── Container.js
│       ├── FileUpload.js
│       ├── Input.js
│       └── Typography.js
├── contexts/
│   └── AuthContext.js
├── pages/
│   ├── CadastroCliente.js
│   ├── Dashboard.js
│   ├── EditarCliente.js
│   └── Login.js
├── services/
│   ├── api.js
│   ├── authService.js
│   └── clientService.js
├── styles/
│   ├── GlobalStyle.js
│   └── theme.js
├── App.js
└── index.js
```

## 🎨 Screenshots

O sistema possui:
- Tela de login elegante com gradiente
- Dashboard moderno com cards interativos
- Formulários bem organizados em seções
- Upload de arquivos com drag & drop
- Design consistente em todas as telas

## 🔄 Status do Projeto

✅ **Concluído e Funcionando**
- Todas as funcionalidades implementadas
- Integração completa com backend
- Design fiel às especificações
- Responsividade testada
- Validações funcionando
- Upload de arquivos operacional

## 🚀 Próximos Passos

Para deploy em produção, considere:
1. Configurar variáveis de ambiente para URLs da API
2. Implementar service worker para PWA
3. Adicionar testes automatizados
4. Configurar CI/CD pipeline
5. Implementar compressão de imagens no upload

---

**Desenvolvido seguindo as especificações do design do PDF com foco na experiência do usuário e performance.**
