
import api, { API_BASE_URL } from './api';

export const clientService = {
  // Listar todos os clientes
  getAllClients: () => {
    return api.get('/clientes');
  },

  // Obter cliente por ID
  getClientById: (id) => {
    return api.get(`/clientes/${id}`);
  },

  // Criar novo cliente
  createClient: (clientData) => {
    return api.post('/clientes', clientData);
  },

  // Criar cliente com fotos (multipart/form-data)
  createClientWithPhotos: (clientData, documentFile, selfieFile) => {
    const formData = new FormData();
    
    // Adicionar todos os campos do cliente
    Object.keys(clientData).forEach(key => {
      const value = clientData[key];
      // Incluir todos os valores exceto null, undefined e strings vazias
      // Mas manter valores booleanos (incluindo false)
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value);
      } else if (typeof value === 'boolean') {
        formData.append(key, value);
      }
    });
    
    // Adicionar arquivos se existirem
    if (documentFile) {
      formData.append('fotoDocumento', documentFile);
    }
    
    if (selfieFile) {
      formData.append('fotoSelfie', selfieFile);
    }
    
    return api.post('/clientes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Atualizar cliente
  updateClient: (id, clientData) => {
    return api.put(`/clientes/${id}`, clientData);
  },

  // Atualizar cliente com fotos (condicional: JSON ou multipart)
  updateClientWithPhotos: (id, clientData, documentFile = null, selfieFile = null) => {
    // Se não há fotos novas, usar JSON
    if (!documentFile && !selfieFile) {
      return api.put(`/clientes/${id}`, clientData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Se há fotos, usar multipart/form-data
    const formData = new FormData();
    
    // Adicionar todos os campos do cliente
    Object.keys(clientData).forEach(key => {
      const value = clientData[key];
      // Incluir todos os valores exceto null, undefined e strings vazias
      // Mas manter valores booleanos (incluindo false)
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value);
      } else if (typeof value === 'boolean') {
        formData.append(key, value);
      }
    });
    
    // Adicionar arquivos se existirem
    if (documentFile) {
      formData.append('fotoDocumento', documentFile);
    }
    
    if (selfieFile) {
      formData.append('fotoSelfie', selfieFile);
    }
    
    return api.put(`/clientes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Deletar cliente
  deleteClient: (id) => {
    return api.delete(`/clientes/${id}`);
  },

  // Upload de foto
  uploadPhoto: (clientId, type, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post(`/clientes/${clientId}/upload/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Buscar fotos do cliente
  getClientPhotos: (clientId) => {
    return api.get(`/clientes/${clientId}/fotos`);
  },

  // Novos métodos para Dashboard
  
  // Obter estatísticas do dashboard
  getEstatisticas: async () => {
    try {
      const response = await api.get('/clientes/estatisticas');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  },

  // Obter clientes com paginação e filtros
  getClientesPaginado: async (params) => {
    try {
      const response = await api.get('/clientes/paginado', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar clientes paginados:', error);
      throw error;
    }
  },

  // Atualizar status do cliente
  updateStatus: async (clientId, status) => {
    try {
      const response = await api.patch(`/clientes/${clientId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  },

  // Exportar clientes para CSV
  exportarCSV: async (params = {}) => {
    try {
      const response = await api.get('/clientes/export/csv', {
        params,
        responseType: 'blob'
      });
      
      // Criar link de download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extrair nome do arquivo do header Content-Disposition ou usar padrão
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'clientes.csv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      throw error;
    }
  },

  // Upload de foto do documento
  uploadFotoDocumento: async (clientId, arquivo) => {
    try {
      const formData = new FormData();
      formData.append('arquivo', arquivo);
      
      const response = await api.post(`/clientes/${clientId}/foto-documento`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload da foto do documento:', error);
      throw error;
    }
  },

  // Upload de foto selfie
  uploadFotoSelfie: async (clientId, arquivo) => {
    try {
      const formData = new FormData();
      formData.append('arquivo', arquivo);
      
      const response = await api.post(`/clientes/${clientId}/foto-selfie`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload da foto selfie:', error);
      throw error;
    }
  },

  // Obter fotos do cliente
  getFotosCliente: async (clientId) => {
    try {
      const response = await api.get(`/clientes/${clientId}/fotos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar fotos do cliente:', error);
      throw error;
    }
  },

  // Obter URL de visualização de arquivo
  getArquivoUrl: (nomeArquivo) => {
    return `${API_BASE_URL}/clientes/uploads/${nomeArquivo}`;
  },

  // Deletar foto do documento
  deleteFotoDocumento: async (clientId) => {
    try {
      const response = await api.delete(`/clientes/${clientId}/foto-documento`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar foto do documento:', error);
      throw error;
    }
  },

  // Deletar foto selfie
  deleteFotoSelfie: async (clientId) => {
    try {
      const response = await api.delete(`/clientes/${clientId}/foto-selfie`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar foto selfie:', error);
      throw error;
    }
  }
};
