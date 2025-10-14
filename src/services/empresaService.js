import api from './api';

export const empresaService = {
  // Listar todas as empresas
  getAllEmpresas: () => {
    return api.get('/empresas');
  },

  // Obter empresa por ID
  getEmpresaById: (id) => {
    return api.get(`/empresas/${id}`);
  },

  // Obter empresa por CNPJ
  getEmpresaByCnpj: (cnpj) => {
    return api.get(`/empresas/cnpj/${cnpj}`);
  },

  // Obter empresa por email
  getEmpresaByEmail: (email) => {
    return api.get(`/empresas/email/${email}`);
  },

  // Criar nova empresa
  createEmpresa: (empresaData) => {
    return api.post('/empresas', empresaData);
  },

  // Atualizar empresa
  updateEmpresa: (id, empresaData) => {
    return api.put(`/empresas/${id}`, empresaData);
  },

  // Deletar empresa
  deleteEmpresa: (id) => {
    return api.delete(`/empresas/${id}`);
  },

  // Atualizar status da empresa
  updateStatus: (id, status) => {
    return api.patch(`/empresas/${id}/status`, { status });
  },

  // Buscar empresas com filtros e paginação
  filtrarEmpresas: (params) => {
    return api.get('/empresas/filtrar', { params });
  },

  // Obter estatísticas das empresas
  getEstatisticas: () => {
    return api.get('/empresas/estatisticas');
  },

  // Buscar empresas por cidade
  getEmpresasByCidade: (cidade) => {
    return api.get(`/empresas/cidade/${cidade}`);
  },

  // Buscar empresas por estado
  getEmpresasByEstado: (estado) => {
    return api.get(`/empresas/estado/${estado}`);
  },

  // Buscar empresas por status
  getEmpresasByStatus: (status) => {
    return api.get(`/empresas/status/${status}`);
  },

  // Validar CNPJ (função auxiliar)
  validarCnpj: (cnpj) => {
    // Remove caracteres não numéricos
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    // Verifica se tem 14 dígitos
    if (cnpjLimpo.length !== 14) {
      return false;
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cnpjLimpo)) {
      return false;
    }

    // Validação dos dígitos verificadores
    let soma = 0;
    let peso = 2;

    // Primeiro dígito verificador
    for (let i = 11; i >= 0; i--) {
      soma += parseInt(cnpjLimpo.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }

    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;

    if (parseInt(cnpjLimpo.charAt(12)) !== digito1) {
      return false;
    }

    // Segundo dígito verificador
    soma = 0;
    peso = 2;

    for (let i = 12; i >= 0; i--) {
      soma += parseInt(cnpjLimpo.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }

    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;

    return parseInt(cnpjLimpo.charAt(13)) === digito2;
  },

  // Formatar CNPJ
  formatarCnpj: (cnpj) => {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    if (cnpjLimpo.length <= 14) {
      return cnpjLimpo.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        '$1.$2.$3/$4-$5'
      );
    }
    
    return cnpj;
  }
};