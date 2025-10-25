import api from './api';

const listarTodos = () => {
    return api.get('/vendedores');
};

const buscarPorId = (id) => {
    return api.get(`/vendedores/${id}`);
};

const buscarPorCpf = (cpf) => {
    return api.get(`/vendedores/cpf/${cpf}`);
};

const criar = (vendedorData) => {
    return api.post('/vendedores', vendedorData);
};

const atualizar = (id, vendedorData) => {
    return api.put(`/vendedores/${id}`, vendedorData);
};

const deletar = (id) => {
    return api.delete(`/vendedores/${id}`);
};

const atualizarStatus = (id, status) => {
    return api.patch(`/vendedores/${id}/status`, { status });
};

const filtrar = (params) => {
    return api.get('/vendedores/filtrar', { params });
};

const obterEstatisticas = () => {
    return api.get('/vendedores/estatisticas');
};

const buscarPorNome = (nome) => {
    return api.get(`/vendedores/buscar/nome/${nome}`);
};

const buscarPorStatus = (status) => {
    return api.get(`/vendedores/status/${status}`);
};

// Validações
const validarCpf = (cpf) => {
    if (!cpf) return false;
    
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;
    
    return true;
};

const validarEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validarSenha = (senha) => {
    if (!senha) return false;
    return senha.length >= 6;
};

const formatarCpf = (cpf) => {
    if (!cpf) return cpf;
    
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');
    
    // Aplica a máscara XXX.XXX.XXX-XX
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    
    return cpf;
};

const limparCpf = (cpf) => {
    if (!cpf) return cpf;
    
    // Remove todos os caracteres não numéricos
    return cpf.replace(/\D/g, '');
};

const validarNome = (nome) => {
    if (!nome || nome.trim().length < 2) {
        return false;
    }
    
    // Verifica se contém apenas letras e espaços
    const regex = /^[a-zA-ZÀ-ÿ\s]+$/;
    return regex.test(nome.trim());
};

const formatarNome = (nome) => {
    if (!nome) return nome;
    
    return nome
        .trim()
        .toLowerCase()
        .split(' ')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(' ');
};

export default {
    listarTodos,
    buscarPorId,
    buscarPorCpf,
    criar,
    atualizar,
    deletar,
    atualizarStatus,
    filtrar,
    obterEstatisticas,
    buscarPorNome,
    buscarPorStatus,
    validarCpf,
    validarEmail,
    validarSenha,
    formatarCpf,
    limparCpf,
    validarNome,
    formatarNome
};