import api from './api';

export const aparelhoService = {
  // Listar todos os aparelhos
  getAllAparelhos: () => {
    return api.get('/aparelhos');
  },

  // Obter aparelho por ID
  getAparelhoById: (id) => {
    return api.get(`/aparelhos/${id}`);
  },

  // Obter aparelho por IMEI
  getAparelhoByImei: (imei) => {
    return api.get(`/aparelhos/imei/${imei}`);
  },

  // Obter aparelhos por cliente
  getAparelhosByCliente: (clienteId) => {
    return api.get(`/aparelhos/cliente/${clienteId}`);
  },

  // Obter aparelhos por empresa
  getAparelhosByEmpresa: (empresaId) => {
    return api.get(`/aparelhos/empresa/${empresaId}`);
  },

  // Obter aparelhos por status
  getAparelhosByStatus: (status) => {
    return api.get(`/aparelhos/status/${status}`);
  },

  // Criar novo aparelho
  createAparelho: (aparelhoData) => {
    return api.post('/aparelhos', aparelhoData);
  },

  // Atualizar aparelho
  updateAparelho: (id, aparelhoData) => {
    return api.put(`/aparelhos/${id}`, aparelhoData);
  },

  // Deletar aparelho
  deleteAparelho: (id) => {
    return api.delete(`/aparelhos/${id}`);
  },

  // Atualizar status do aparelho
  updateStatus: (id, status) => {
    return api.patch(`/aparelhos/${id}/status`, { status });
  },

  // Buscar aparelhos com filtros e paginação
  buscarComFiltros: (params) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    return api.get(`/aparelhos/buscar?${queryParams.toString()}`);
  },

  // Obter estatísticas dos aparelhos
  getEstatisticas: () => {
    return api.get('/aparelhos/estatisticas');
  },

  // Buscar aparelhos próximos ao vencimento
  getAparelhosProximosVencimento: (dias = 30) => {
    return api.get(`/aparelhos/vencimento-proximo?dias=${dias}`);
  },

  // Buscar aparelhos por modelo
  buscarPorModelo: (modelo) => {
    return api.get(`/aparelhos/buscar?modelo=${encodeURIComponent(modelo)}`);
  },

  // Buscar aparelhos por marca
  buscarPorMarca: (marca) => {
    return api.get(`/aparelhos/buscar?marca=${encodeURIComponent(marca)}`);
  },

  // Buscar aparelhos por nome do cliente
  buscarPorNomeCliente: (nomeCliente) => {
    return api.get(`/aparelhos/buscar?clienteNome=${encodeURIComponent(nomeCliente)}`);
  },

  // Buscar aparelhos por nome da empresa
  buscarPorNomeEmpresa: (nomeEmpresa) => {
    return api.get(`/aparelhos/buscar?empresaNome=${encodeURIComponent(nomeEmpresa)}`);
  },

  // Buscar aparelhos por período
  buscarPorPeriodo: (dataInicio, dataFim) => {
    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);
    
    return api.get(`/aparelhos/buscar?${params.toString()}`);
  },

  // Validar IMEI único
  validarImeiUnico: async (imei, aparelhoId = null) => {
    try {
      const response = await api.get(`/aparelhos/imei/${imei}`);
      // Se encontrou um aparelho com este IMEI
      if (response.data && response.data.id !== aparelhoId) {
        return false; // IMEI já existe
      }
      return true; // IMEI disponível
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return true; // IMEI não encontrado, está disponível
      }
      throw error; // Outro tipo de erro
    }
  },

  // Calcular valor da parcela
  calcularValorParcela: (valorTotal, numeroParcelas) => {
    if (!valorTotal || !numeroParcelas || numeroParcelas <= 0) {
      return 0;
    }
    return (parseFloat(valorTotal) / parseInt(numeroParcelas)).toFixed(2);
  },

  // Calcular data de vencimento
  calcularDataVencimento: (diasVencimento) => {
    if (!diasVencimento) return null;
    
    const hoje = new Date();
    const dataVencimento = new Date(hoje);
    dataVencimento.setDate(hoje.getDate() + parseInt(diasVencimento));
    
    return dataVencimento.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  },

  // Formatar dados para envio
  formatarDadosParaEnvio: (formData) => {
    return {
      imei: formData.imei,
      modelo: formData.modelo,
      marca: formData.marca,
      clienteId: parseInt(formData.cpfCliente), // Assumindo que cpfCliente é o ID do cliente
      empresaId: parseInt(formData.empresaId),
      valorParcelado: parseFloat(formData.valorParcelado) || 0,
      valorTotal: parseFloat(formData.valorTotal) || 0,
      parcelas: parseInt(formData.parcelas) || 1,
      valorParcela: parseFloat(formData.valorParcela) || 0,
      diasVencimento: parseInt(formData.diasVencimento) || 30,
      dataVencimento: formData.dataVencimento
    };
  }
};

export default aparelhoService;