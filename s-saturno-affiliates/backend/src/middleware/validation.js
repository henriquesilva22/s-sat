const validator = require('validator');

/**
 * Validações para produtos
 */
const validateProduct = {
  /**
   * Valida os dados de criação/edição de um produto
   */
  create: (req, res, next) => {
    const { title, description, price, imageUrl, affiliateUrl, storeId, stock } = req.body;
    const errors = [];

    // DEBUG: Log completo dos dados recebidos
    console.log('🔍 [VALIDATION CREATE DEBUG]', {
      title: { value: title, type: typeof title },
      description: { value: description?.substring?.(0, 50) + '...', type: typeof description },
      price: { value: price, type: typeof price },
      imageUrl: { length: imageUrl?.length, type: typeof imageUrl, starts: imageUrl?.substring?.(0, 50) + '...' },
      affiliateUrl: { value: affiliateUrl, type: typeof affiliateUrl },
      storeId: { value: storeId, type: typeof storeId },
      stock: { value: stock, type: typeof stock }
    });

    // Validação do título
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      errors.push('Título deve ter pelo menos 3 caracteres');
    }

    // Validação da descrição
    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      errors.push('Descrição deve ter pelo menos 10 caracteres');
    }

    // Validação do preço
    const priceNum = typeof price === 'string' ? parseFloat(price) : price;
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      errors.push('Preço deve ser um número positivo');
    }

    // Validação da URL da imagem
    if (!imageUrl || (typeof imageUrl !== 'string')) {
      errors.push('URL da imagem é obrigatória');
    } else {
      const isValidUrl = validator.isURL(imageUrl);
      const isDataUrl = imageUrl.startsWith('data:image/');
      const isOurBackendUrl = imageUrl.startsWith('https://s-sat.onrender.com/uploads/') || 
                              imageUrl.startsWith('http://localhost:') ||
                              imageUrl.startsWith('/uploads/');
      
      if (!isValidUrl && !isDataUrl && !isOurBackendUrl) {
        errors.push('URL da imagem deve ser uma URL válida ou uma imagem em base64');
      }
    }

    // Validação da URL de afiliado
    if (!affiliateUrl || !validator.isURL(affiliateUrl)) {
      errors.push('URL de afiliado deve ser uma URL válida');
    }

    // Validação do ID da loja
    const storeIdNum = typeof storeId === 'string' ? parseInt(storeId) : storeId;
    if (!storeId || !Number.isInteger(storeIdNum) || storeIdNum <= 0) {
      errors.push('ID da loja deve ser um número inteiro positivo');
    }

    // Validação do estoque
    if (stock !== undefined) {
      const stockNum = typeof stock === 'string' ? parseInt(stock) : stock;
      if (!Number.isInteger(stockNum) || stockNum < 0) {
        errors.push('Estoque deve ser um número inteiro não negativo');
      }
    }

    if (errors.length > 0) {
      console.log('❌ [VALIDATION CREATE] Erros encontrados:', errors);
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors
      });
    }

    next();
  },

  /**
   * Valida os dados de atualização de um produto (campos opcionais)
   */
  update: (req, res, next) => {
    const { title, description, price, imageUrl, affiliateUrl, storeId, stock } = req.body;
    const errors = [];

    // DEBUG: Log dos tipos de dados recebidos
    console.log('🔍 [VALIDATION DEBUG]', {
      price: { value: price, type: typeof price },
      storeId: { value: storeId, type: typeof storeId },
      stock: { value: stock, type: typeof stock },
      allBody: req.body
    });

    // Validações apenas para campos presentes
    if (title !== undefined && (typeof title !== 'string' || title.trim().length < 3)) {
      errors.push('Título deve ter pelo menos 3 caracteres');
    }

    if (description !== undefined && (typeof description !== 'string' || description.trim().length < 10)) {
      errors.push('Descrição deve ter pelo menos 10 caracteres');
    }

    if (price !== undefined) {
      const priceNum = typeof price === 'string' ? parseFloat(price) : price;
      if (isNaN(priceNum) || priceNum <= 0) {
        errors.push('Preço deve ser um número positivo');
      }
    }

    if (imageUrl !== undefined && imageUrl !== '' && imageUrl !== null) {
      // Debug log para investigar o problema
      console.log('🖼️ [VALIDATION DEBUG] imageUrl:', {
        value: imageUrl,
        type: typeof imageUrl,
        length: imageUrl?.length,
        isEmpty: imageUrl === '',
        isUndefined: imageUrl === undefined,
        isNull: imageUrl === null
      });
      
      // Aceitar tanto URLs normais quanto data URLs (base64) ou URLs que começam com /uploads/
      const isValidUrl = validator.isURL(imageUrl);
      const isDataUrl = imageUrl.startsWith('data:image/');
      const isLocalUpload = imageUrl.startsWith('/uploads/');
      
      console.log('🖼️ [VALIDATION DEBUG] Validação URL:', {
        isValidUrl,
        isDataUrl,
        isLocalUpload,
        willFail: !isValidUrl && !isDataUrl && !isLocalUpload
      });
      
      if (!isValidUrl && !isDataUrl && !isLocalUpload) {
        errors.push('URL da imagem deve ser uma URL válida ou uma imagem em base64');
      }
    }

    if (affiliateUrl !== undefined && affiliateUrl !== '' && !validator.isURL(affiliateUrl)) {
      errors.push('URL de afiliado deve ser uma URL válida');
    }

    if (storeId !== undefined) {
      const storeIdNum = typeof storeId === 'string' ? parseInt(storeId) : storeId;
      if (!Number.isInteger(storeIdNum) || storeIdNum <= 0) {
        errors.push('ID da loja deve ser um número inteiro positivo');
      }
    }

    if (stock !== undefined) {
      const stockNum = typeof stock === 'string' ? parseInt(stock) : stock;
      if (!Number.isInteger(stockNum) || stockNum < 0) {
        errors.push('Estoque deve ser um número inteiro não negativo');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors
      });
    }

    next();
  }
};

/**
 * Validações para lojas
 */
const validateStore = {
  /**
   * Valida os dados de criação/edição de uma loja
   */
  create: (req, res, next) => {
    const { name, description, logoUrl, domain } = req.body;
    const errors = [];

    // Validação do nome
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    // Validação da URL do logo (opcional)
    if (logoUrl && !validator.isURL(logoUrl)) {
      errors.push('URL do logo deve ser uma URL válida');
    }

    // Validação do domínio (opcional) - aceita URL completa ou apenas domínio
    if (domain && domain.trim() !== '') {
      const isValidUrl = validator.isURL(domain);
      const isValidDomain = validator.isFQDN(domain);
      
      if (!isValidUrl && !isValidDomain) {
        errors.push('Domínio deve ser uma URL válida (ex: https://example.com) ou domínio (ex: example.com)');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors
      });
    }

    next();
  }
};

/**
 * Validação para paginação
 */
const validatePagination = (req, res, next) => {
  let { page = 1, perPage = 12 } = req.query;

  // Converter para números
  page = parseInt(page);
  perPage = parseInt(perPage);

  // Validações
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  if (isNaN(perPage) || perPage < 1 || perPage > 100) {
    perPage = 12; // Limite máximo de 100 itens por página
  }

  // Adicionar à requisição para uso nas rotas
  req.pagination = {
    page,
    perPage,
    skip: (page - 1) * perPage
  };

  next();
};

module.exports = {
  validateProduct,
  validateStore,
  validatePagination
};