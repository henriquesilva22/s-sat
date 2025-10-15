const jwt = require('jsonwebtoken');

/**
 * Utilitário para gerar tokens JWT
 */
const generateToken = (payload, expiresIn = '24h') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Utilitário para verificar tokens JWT
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Utilitário para sanitizar URLs de afiliado
 * Remove caracteres perigosos e valida a URL
 */
const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Remove espaços em branco
  url = url.trim();

  // Verifica se é uma URL válida
  try {
    const urlObj = new URL(url);
    
    // Lista de protocolos permitidos
    const allowedProtocols = ['http:', 'https:'];
    
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return null;
    }

    return urlObj.toString();
  } catch (error) {
    return null;
  }
};

/**
 * Utilitário para formatar resposta de paginação
 */
const formatPaginationResponse = (data, totalItems, currentPage, perPage) => {
  const totalPages = Math.ceil(totalItems / perPage);
  
  return {
    data,
    pagination: {
      currentPage,
      perPage,
      totalItems,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1
    }
  };
};

/**
 * Utilitário para limpar strings
 */
const sanitizeString = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  // Remove caracteres perigosos e tags HTML básicas
  return str
    .trim()
    .replace(/<[^>]*>/g, '') // Remove tags HTML
    .replace(/[<>]/g, ''); // Remove < e >
};

/**
 * Utilitário para formatar tags
 * Converte string de tags em array limpo
 */
const formatTags = (tagsString) => {
  if (!tagsString || typeof tagsString !== 'string') {
    return '';
  }

  return tagsString
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0)
    .join(',');
};

/**
 * Utilitário para tratamento de erros do Prisma
 */
const handlePrismaError = (error) => {
  if (error.code === 'P2002') {
    return {
      status: 409,
      message: 'Este registro já existe',
      details: 'Violação de constraint único'
    };
  }

  if (error.code === 'P2025') {
    return {
      status: 404,
      message: 'Registro não encontrado',
      details: 'O item solicitado não existe'
    };
  }

  if (error.code === 'P2003') {
    return {
      status: 400,
      message: 'Referência inválida',
      details: 'O ID referenciado não existe'
    };
  }

  // Erro genérico
  return {
    status: 500,
    message: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? error.message : 'Erro inesperado'
  };
};

module.exports = {
  generateToken,
  verifyToken,
  sanitizeUrl,
  formatPaginationResponse,
  sanitizeString,
  formatTags,
  handlePrismaError
};