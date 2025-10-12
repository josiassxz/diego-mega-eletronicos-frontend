/**
 * Serviço para consumir a API do ViaCEP
 */

const VIACEP_BASE_URL = 'https://viacep.com.br/ws';

/**
 * Busca informações de endereço pelo CEP
 * @param {string} cep - CEP no formato 12345678 ou 12345-678
 * @returns {Promise<Object>} Dados do endereço
 */
const buscarCep = async (cep) => {
  try {
    // Remove caracteres não numéricos do CEP
    const cepLimpo = cep.replace(/\D/g, '');
    
    // Valida se o CEP tem 8 dígitos
    if (cepLimpo.length !== 8) {
      throw new Error('CEP deve conter 8 dígitos');
    }
    
    // Valida formato do CEP (não pode ser sequência de números iguais)
    if (/^(\d)\1{7}$/.test(cepLimpo)) {
      throw new Error('CEP inválido');
    }
    
    const response = await fetch(`${VIACEP_BASE_URL}/${cepLimpo}/json/`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar CEP');
    }
    
    const data = await response.json();
    
    // Verifica se o CEP foi encontrado
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }
    
    return {
      cep: data.cep,
      logradouro: data.logradouro,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
      estadoCompleto: data.estado,
      regiao: data.regiao,
      ibge: data.ibge,
      ddd: data.ddd
    };
    
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    throw error;
  }
};

/**
 * Formata CEP para exibição (12345-678)
 * @param {string} cep - CEP sem formatação
 * @returns {string} CEP formatado
 */
const formatarCep = (cep) => {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
};

/**
 * Remove formatação do CEP
 * @param {string} cep - CEP formatado
 * @returns {string} CEP sem formatação
 */
const limparCep = (cep) => {
  return cep.replace(/\D/g, '');
};

// Exporta o objeto viaCepService
export const viaCepService = {
  buscarCep,
  formatarCep,
  limparCep
};