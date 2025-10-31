
const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { asyncHandler, authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateProduct, validateStore } = require('../middleware/validation');
const { generateToken, sanitizeUrl, sanitizeString, formatTags, handlePrismaError } = require('../utils/helpers');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinary');

// Use `var` here to avoid potential temporal-dead-zone errors if there is
// a circular require during module initialization in certain Node versions.
// This keeps the router declaration hoisted and prevents "Cannot access 'router' before initialization".
var router = express.Router();
const prisma = new PrismaClient();

// Helper shared across handlers to detect direct image file URLs
function isDirectImageUrl(url) {
  return typeof url === 'string' && /\.(jpg|jpeg|png|webp|gif|bmp|svg)(\?.*)?$/i.test(url);
}

/**
 * POST /api/admin/cleanup-images
 * Remove todas as imagens dos produtos e lojas do banco e do Cloudinary
 */
router.post('/cleanup-images', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  let cleanedProducts = 0;
  let cleanedStores = 0;
  let cloudinaryDeleted = 0;
  let cloudinaryErrors = 0;

  // Limpar imagens dos produtos
  const products = await prisma.product.findMany({ select: { id: true, imageUrl: true } });
  for (const product of products) {
    if (product.imageUrl) {
      // Tenta deletar do Cloudinary se for URL do Cloudinary
      if (product.imageUrl.includes('cloudinary.com')) {
        try {
          const deleted = await deleteFromCloudinary(product.imageUrl);
          if (deleted) cloudinaryDeleted++;
          else cloudinaryErrors++;
        } catch (err) {
          cloudinaryErrors++;
        }
      }
      await prisma.product.update({ where: { id: product.id }, data: { imageUrl: null } });
      cleanedProducts++;
    }
  }

  // Limpar imagens das lojas
  const stores = await prisma.store.findMany({ select: { id: true, logoUrl: true } });
  for (const store of stores) {
    if (store.logoUrl) {
      if (store.logoUrl.includes('cloudinary.com')) {
        try {
          const deleted = await deleteFromCloudinary(store.logoUrl);
          if (deleted) cloudinaryDeleted++;
          else cloudinaryErrors++;
        } catch (err) {
          cloudinaryErrors++;
        }
      }
      await prisma.store.update({ where: { id: store.id }, data: { logoUrl: null } });
      cleanedStores++;
    }
  }

  res.json({
    success: true,
    message: 'Imagens limpas com sucesso',
    cleanedProducts,
    cleanedStores,
    cloudinaryDeleted,
    cloudinaryErrors
  });
}));

/**
 * POST /api/admin/login
 * Autenticação do administrador
 * Body: { password: string }
 */
router.post('/login', asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      error: 'Senha obrigatória',
      message: 'É necessário informar a senha'
    });
  }

  // Verificar se a senha coincide com a variável de ambiente
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD não configurada no .env');
    return res.status(500).json({
      success: false,
      error: 'Configuração inválida',
      message: 'Erro na configuração do servidor'
    });
  }

  if (password !== adminPassword) {
    return res.status(401).json({
      success: false,
      error: 'Senha inválida',
      message: 'A senha informada está incorreta'
    });
  }

  // Gerar token JWT
  const token = generateToken({
    role: 'admin',
    loginAt: new Date().toISOString()
  }, '7d');

  res.json({
    success: true,
    message: 'Login realizado com sucesso',
    data: {
      token,
      role: 'admin',
      expiresIn: '7d'
    }
  });
}));

/**
 * GET /api/admin/test-token
 * Endpoint para testar validação de token
 */
router.get('/test-token', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Token válido!',
    data: {
      user: req.user,
      timestamp: new Date().toISOString()
    }
  });
}));

/**
 * GET /api/admin/dashboard
 * Estatísticas do dashboard administrativo
 */
router.get('/dashboard', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  try {
    const [
      totalProducts,
      totalStores,
      totalClicks,
      recentProducts,
      topClickedProducts
    ] = await Promise.all([
      // Total de produtos
      prisma.product.count(),
      
      // Total de lojas
      prisma.store.count(),
      
      // Total de cliques
      prisma.product.aggregate({
        _sum: { clicks: true }
      }),
      
      // Produtos recentes (últimos 5)
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          store: {
            select: { name: true }
          }
        }
      }),
      
      // Produtos mais clicados (top 5)
      prisma.product.findMany({
        take: 5,
        orderBy: { clicks: 'desc' },
        include: {
          store: {
            select: { name: true }
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          totalStores,
          totalClicks: totalClicks._sum.clicks || 0
        },
        recentProducts,
        topClickedProducts
      }
    });

  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

// ===============================
// ROTAS PARA GERENCIAR PRODUTOS
// ===============================

/**
 * GET /api/admin/products
 * Lista todos os produtos para administração
 */
router.get('/products', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  try {
    const { storeId } = req.query;
    const where = {};
    if (storeId) {
      const parsedStoreId = parseInt(storeId);
      if (!isNaN(parsedStoreId)) {
        where.storeId = parsedStoreId;
      }
    }
    const products = await prisma.product.findMany({
      where,
      include: {
        store: {
          select: {
            id: true,
            name: true,
            logoUrl: true
          }
        },
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    const { status, message, details } = handlePrismaError(error);
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

/**
 * POST /api/admin/products
 * Criar novo produto
 */
router.post('/products', authenticateToken, requireAdmin, validateProduct.create, asyncHandler(async (req, res) => {
  const { title, description, price, originalPrice = null, imageUrl, affiliateUrl, storeId, stock = 0, tags = '', isActive = true, categoryIds = [], rating, reviewCount, soldCount, freeShipping, warranty } = req.body;

  try {
    // Validar categorias (máximo 4)
    let validatedCategoryIds = [];
    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      if (categoryIds.length > 4) {
        return res.status(400).json({
          success: false,
          error: 'Muitas categorias selecionadas',
          message: 'Um produto pode ter no máximo 4 categorias'
        });
      }

      // Converter para números e filtrar IDs válidos, removendo duplicatas
      validatedCategoryIds = [...new Set(categoryIds
        .map(id => parseInt(id))
        .filter(id => !isNaN(id) && id > 0))];

      if (validatedCategoryIds.length > 0) {
        // Verificar se todas as categorias existem
        const existingCategories = await prisma.category.findMany({
          where: {
            id: {
              in: validatedCategoryIds
            }
          }
        });

        if (existingCategories.length !== validatedCategoryIds.length) {
          return res.status(400).json({
            success: false,
            error: 'Categorias inválidas',
            message: 'Uma ou mais categorias selecionadas não existem'
          });
        }
      }
    }

    // Verificar se a loja existe
    const store = await prisma.store.findUnique({
      where: { id: storeId }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        error: 'Loja não encontrada',
        message: 'A loja especificada não existe'
      });
    }

    // Processar imagem se for base64 ou URL inválida
    let processedImageUrl = imageUrl;
    console.log('🔍 [DEBUG] ImageUrl recebida:', imageUrl ? 'Base64 detectado ou URL recebida' : 'Nenhuma imagem');

    // Usamos a função global isDirectImageUrl definida no topo do arquivo

    if (imageUrl && imageUrl.startsWith('data:image/')) {
      console.log('☁️ [CLOUDINARY] Tentando upload para Cloudinary...');
      try {
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const publicId = `product-new-${uniqueSuffix}`;
          processedImageUrl = await uploadToCloudinary(imageUrl, 'products', publicId);
          console.log('✅ [CLOUDINARY] Upload concluído:', processedImageUrl);
        } else {
          console.log('⚠️ [CLOUDINARY] Não configurado, imagem não será salva');
          throw new Error('Cloudinary não configurado');
        }
      } catch (error) {
        console.error('❌ [CLOUDINARY] Erro no upload:', error);
        processedImageUrl = '';
      }
    } else if (imageUrl && !isDirectImageUrl(imageUrl)) {
      // Se não for URL direta de imagem, não salva nada
      console.log('⚠️ [IMG URL] URL não é direta de imagem, campo ficará vazio');
      processedImageUrl = '';
    }
    console.log('📋 [DEBUG] processedImageUrl final:', processedImageUrl);

    // Sanitizar dados
    const sanitizedImageUrl = sanitizeUrl(processedImageUrl);
    const sanitizedAffiliateUrl = sanitizeUrl(affiliateUrl);
    
    const sanitizedData = {
      title: sanitizeString(title),
      description: sanitizeString(description),
      price: parseFloat(price),
      originalPrice: originalPrice === null || originalPrice === '' ? null : parseFloat(originalPrice),
      imageUrl: sanitizedImageUrl !== null ? sanitizedImageUrl : '',
      affiliateUrl: sanitizedAffiliateUrl !== null ? sanitizedAffiliateUrl : '',
      storeId: parseInt(storeId),
      stock: parseInt(stock),
      tags: formatTags(tags),
      isActive: Boolean(isActive),
      rating: rating !== undefined && rating !== null && rating !== '' ? parseFloat(rating) : null,
      reviewCount: reviewCount !== undefined && reviewCount !== null && reviewCount !== '' ? parseInt(reviewCount) : 0,
      soldCount: soldCount !== undefined && soldCount !== null && soldCount !== '' ? parseInt(soldCount) : 0,
      freeShipping: freeShipping !== undefined ? Boolean(freeShipping) : true
    };

    // Debug das categorias
    console.log('🔍 [DEBUG] validatedCategoryIds:', validatedCategoryIds);
    
    const product = await prisma.product.create({
      data: {
        ...sanitizedData,
        ...(validatedCategoryIds.length > 0 && {
          categories: {
            create: validatedCategoryIds.map(id => ({
              categoryId: id
            }))
          }
        })
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            logoUrl: true
          }
        },
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: product
    });

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

/**
 * PUT /api/admin/products/:id
 * Atualizar produto existente
 */
router.put('/products/:id', authenticateToken, requireAdmin, validateProduct.update, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productId = parseInt(id);
  const updateData = req.body;

  // DEBUG: Log completo da requisição PUT
  console.log('🔄 [PUT PRODUCT DEBUG]', {
    productId,
    updateData,
    bodyKeys: Object.keys(updateData),
    timestamp: new Date().toISOString()
  });

  if (isNaN(productId)) {
    console.log('❌ [PUT PRODUCT] ID inválido:', id);
    return res.status(400).json({
      success: false,
      error: 'ID inválido',
      message: 'O ID do produto deve ser um número'
    });
  }

  try {
    // Verificar se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
        message: 'O produto especificado não existe'
      });
    }

    // Validar categorias se fornecidas (máximo 4)
    let categoryUpdate = {};
    if (updateData.categoryIds !== undefined) {
      let validatedCategoryIds = [];
      
      if (Array.isArray(updateData.categoryIds) && updateData.categoryIds.length > 0) {
        if (updateData.categoryIds.length > 4) {
          return res.status(400).json({
            success: false,
            error: 'Muitas categorias selecionadas',
            message: 'Um produto pode ter no máximo 4 categorias'
          });
        }

        // Converter para números e filtrar IDs válidos
        validatedCategoryIds = updateData.categoryIds
          .map(id => parseInt(id))
          .filter(id => !isNaN(id) && id > 0);

        if (validatedCategoryIds.length > 0) {
          // Verificar se todas as categorias existem
          const existingCategories = await prisma.category.findMany({
            where: {
              id: {
                in: validatedCategoryIds
              }
            }
          });

          if (existingCategories.length !== validatedCategoryIds.length) {
            return res.status(400).json({
              success: false,
              error: 'Categorias inválidas',
              message: 'Uma ou mais categorias selecionadas não existem'
            });
          }
        }
      }

      // Preparar update das categorias (desconectar todas e conectar as novas)
      categoryUpdate = {
        categories: {
          deleteMany: {},
          create: validatedCategoryIds.map(categoryId => ({ 
            category: { connect: { id: categoryId } }
          }))
        }
      };
    }

    // Se storeId foi fornecido, verificar se a loja existe
    if (updateData.storeId) {
      const store = await prisma.store.findUnique({
        where: { id: updateData.storeId }
      });

      if (!store) {
        return res.status(404).json({
          success: false,
          error: 'Loja não encontrada',
          message: 'A loja especificada não existe'
        });
      }
    }

    // Processar imagem se for base64 ou URL inválida
    let processedImageUrl = updateData.imageUrl;
    // Usamos a função global isDirectImageUrl definida no topo do arquivo
    if (updateData.imageUrl && updateData.imageUrl.startsWith('data:image/')) {
      console.log('☁️ [CLOUDINARY UPDATE] Tentando upload para Cloudinary...');
      try {
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const publicId = `product-${productId}-${uniqueSuffix}`;
          processedImageUrl = await uploadToCloudinary(updateData.imageUrl, 'products', publicId);
          console.log('✅ [CLOUDINARY UPDATE] Upload concluído:', processedImageUrl);
        } else {
          console.log('⚠️ [CLOUDINARY UPDATE] Não configurado, imagem não será salva');
          throw new Error('Cloudinary não configurado');
        }
      } catch (error) {
        console.error('❌ [CLOUDINARY UPDATE] Erro no upload:', error);
        processedImageUrl = '';
      }
    } else if (updateData.imageUrl && !isDirectImageUrl(updateData.imageUrl)) {
      // Se não for URL direta de imagem, não salva nada
      console.log('⚠️ [IMG URL UPDATE] URL não é direta de imagem, campo ficará vazio');
      processedImageUrl = '';
    }

    // Sanitizar dados de atualização
    const sanitizedData = {};
    
    if (updateData.title !== undefined) sanitizedData.title = sanitizeString(updateData.title);
    if (updateData.description !== undefined) sanitizedData.description = sanitizeString(updateData.description);
    if (updateData.price !== undefined) sanitizedData.price = parseFloat(updateData.price);
    if (processedImageUrl !== undefined) {
      // Para imageUrl, verificar se é upload local ou URL externa
      if (processedImageUrl?.startsWith('/uploads/')) {
        sanitizedData.imageUrl = processedImageUrl;
      } else {
        const sanitizedImageUrl = sanitizeUrl(processedImageUrl);
        if (sanitizedImageUrl !== null) {
          sanitizedData.imageUrl = sanitizedImageUrl;
        }
        // Se for string vazia, também permitir (não é null)
        else if (processedImageUrl === '') {
          sanitizedData.imageUrl = '';
        }
      }
    }
    if (updateData.affiliateUrl !== undefined) {
      const sanitizedAffiliateUrl = sanitizeUrl(updateData.affiliateUrl);
      sanitizedData.affiliateUrl = sanitizedAffiliateUrl !== null ? sanitizedAffiliateUrl : '';
    }
    if (updateData.storeId !== undefined) sanitizedData.storeId = parseInt(updateData.storeId);
    if (updateData.originalPrice !== undefined) {
      sanitizedData.originalPrice = updateData.originalPrice === null || updateData.originalPrice === '' ? null : parseFloat(updateData.originalPrice);
    }
    if (updateData.stock !== undefined) sanitizedData.stock = parseInt(updateData.stock);
    if (updateData.tags !== undefined) sanitizedData.tags = formatTags(updateData.tags);
    if (updateData.isActive !== undefined) sanitizedData.isActive = Boolean(updateData.isActive);
    if (updateData.rating !== undefined) {
      sanitizedData.rating = updateData.rating === null || updateData.rating === '' ? null : parseFloat(updateData.rating);
    }
    if (updateData.reviewCount !== undefined) {
      sanitizedData.reviewCount = updateData.reviewCount === null || updateData.reviewCount === '' ? 0 : parseInt(updateData.reviewCount);
    }
    if (updateData.soldCount !== undefined) {
      sanitizedData.soldCount = updateData.soldCount === null || updateData.soldCount === '' ? 0 : parseInt(updateData.soldCount);
    }
    if (updateData.freeShipping !== undefined) sanitizedData.freeShipping = Boolean(updateData.freeShipping);
    if (updateData.warranty !== undefined) sanitizedData.warranty = Boolean(updateData.warranty);

    // DEBUG: Log dados sanitizados antes da atualização
    console.log('📝 [PUT PRODUCT] Dados sanitizados:', {
      productId,
      sanitizedData,
      categoryUpdate,
      originalPrice: updateData.originalPrice,
      allUpdateData: updateData,
      timestamp: new Date().toISOString()
    });

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...sanitizedData,
        ...categoryUpdate
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            logoUrl: true
          }
        },
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        }
      }
    });

    console.log('✅ [PUT PRODUCT] Produto atualizado com sucesso:', { productId, updatedFields: Object.keys(sanitizedData) });
    
    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: product
    });

  } catch (error) {
    console.error('❌ [PUT PRODUCT] Erro ao atualizar produto:', {
      productId,
      error: error.message,
      stack: error.stack,
      updateData
    });
    
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

/**
 * DELETE /api/admin/products/:id
 * Deletar produto
 */
router.delete('/products/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productId = parseInt(id);

  if (isNaN(productId)) {
    return res.status(400).json({
      success: false,
      error: 'ID inválido',
      message: 'O ID do produto deve ser um número'
    });
  }

  try {
    // Verificar se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
        message: 'O produto especificado não existe'
      });
    }

    await prisma.product.delete({
      where: { id: productId }
    });

    res.json({
      success: true,
      message: 'Produto deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

// ============================
// ROTAS PARA GERENCIAR LOJAS
// ============================

/**
 * GET /api/admin/stores
 * Lista todas as lojas para administração
 */
router.get('/stores', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      success: true,
      data: stores
    });

  } catch (error) {
    console.error('Erro ao listar lojas:', error);
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

/**
 * POST /api/admin/stores
 * Criar nova loja
 */
router.post('/stores', authenticateToken, requireAdmin, validateStore.create, asyncHandler(async (req, res) => {
  const { name, description, logoUrl, domain } = req.body;

  try {
    // Processar logo se for base64
    let processedLogoUrl = logoUrl;
    if (logoUrl && logoUrl.startsWith('data:image/')) {
      console.log('☁️ [CLOUDINARY STORE] Tentando upload de logo para Cloudinary...');
      try {
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const publicId = `store-logo-${uniqueSuffix}`;
          processedLogoUrl = await uploadToCloudinary(logoUrl, 'stores', publicId);
          console.log('✅ [CLOUDINARY STORE] Upload concluído:', processedLogoUrl);
        } else {
          console.log('⚠️ [CLOUDINARY STORE] Não configurado, usando fallback');
          throw new Error('Cloudinary não configurado');
        }
        } catch (error) {
        console.error('❌ [CLOUDINARY STORE] Erro no upload:', error);
        console.log('🔄 [FALLBACK STORE] Cloudinary não configurado ou upload falhou — não será salvo o logo');
        // Não usar imagens de placeholder em produção: preferimos deixar vazio para que
        // a loja não tenha logo até que o usuário faça upload explícito.
        processedLogoUrl = '';
      }
    }

    // Sanitizar dados
    const sanitizedData = {
      name: sanitizeString(name),
      description: description ? sanitizeString(description) : null,
      logoUrl: processedLogoUrl ? (processedLogoUrl.startsWith('/uploads/') ? processedLogoUrl : sanitizeUrl(processedLogoUrl)) : null,
      domain: domain ? sanitizeString(domain) : null
    };

    const store = await prisma.store.create({
      data: sanitizedData
    });

    res.status(201).json({
      success: true,
      message: 'Loja criada com sucesso',
      data: store
    });

  } catch (error) {
    console.error('Erro ao criar loja:', error);
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

/**
 * PUT /api/admin/stores/:id
 * Atualizar loja existente
 */
router.put('/stores/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const storeId = parseInt(id);
  const updateData = req.body;

  if (isNaN(storeId)) {
    return res.status(400).json({
      success: false,
      error: 'ID inválido',
      message: 'O ID da loja deve ser um número'
    });
  }

  try {
    // Verificar se a loja existe
    const existingStore = await prisma.store.findUnique({
      where: { id: storeId }
    });

    if (!existingStore) {
      return res.status(404).json({
        success: false,
        error: 'Loja não encontrada',
        message: 'A loja especificada não existe'
      });
    }

    // Processar logo se for base64
    let processedLogoUrl = updateData.logoUrl;
    if (updateData.logoUrl && updateData.logoUrl.startsWith('data:image/')) {
      console.log('☁️ [CLOUDINARY STORE UPDATE] Tentando upload de logo para Cloudinary...');
      try {
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const publicId = `store-${storeId}-${uniqueSuffix}`;
          processedLogoUrl = await uploadToCloudinary(updateData.logoUrl, 'stores', publicId);
          console.log('✅ [CLOUDINARY STORE UPDATE] Upload concluído:', processedLogoUrl);
        } else {
          console.log('⚠️ [CLOUDINARY STORE UPDATE] Não configurado, usando fallback');
          throw new Error('Cloudinary não configurado');
        }
        } catch (error) {
        console.error('❌ [CLOUDINARY STORE UPDATE] Erro no upload:', error);
        console.log('🔄 [FALLBACK STORE UPDATE] Cloudinary não configurado ou upload falhou — não será salvo o logo');
        // Não atribuir imagem de placeholder; manter em branco para indicar ausência de logo
        processedLogoUrl = '';
      }
    }

    // Sanitizar dados de atualização
    const sanitizedData = {};
    
    if (updateData.name !== undefined) sanitizedData.name = sanitizeString(updateData.name);
    if (updateData.description !== undefined) sanitizedData.description = updateData.description ? sanitizeString(updateData.description) : null;
    if (processedLogoUrl !== undefined) {
      if (processedLogoUrl?.startsWith('/uploads/')) {
        sanitizedData.logoUrl = processedLogoUrl;
      } else {
        sanitizedData.logoUrl = processedLogoUrl ? sanitizeUrl(processedLogoUrl) : null;
      }
    }
    if (updateData.domain !== undefined) sanitizedData.domain = updateData.domain ? sanitizeString(updateData.domain) : null;

    const store = await prisma.store.update({
      where: { id: storeId },
      data: sanitizedData
    });

    res.json({
      success: true,
      message: 'Loja atualizada com sucesso',
      data: store
    });

  } catch (error) {
    console.error('Erro ao atualizar loja:', error);
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

/**
 * DELETE /api/admin/stores/:id
 * Deletar loja (apenas se não tiver produtos)
 */
router.delete('/stores/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const storeId = parseInt(id);

  if (isNaN(storeId)) {
    return res.status(400).json({
      success: false,
      error: 'ID inválido',
      message: 'O ID da loja deve ser um número'
    });
  }

  try {
    // Verificar se a loja existe e quantos produtos tem
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        error: 'Loja não encontrada',
        message: 'A loja especificada não existe'
      });
    }

    if (store._count.products > 0) {
      return res.status(400).json({
        success: false,
        error: 'Loja possui produtos',
        message: `Não é possível deletar a loja pois ela possui ${store._count.products} produto(s) associado(s)`
      });
    }

    await prisma.store.delete({
      where: { id: storeId }
    });

    res.json({
      success: true,
      message: 'Loja deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar loja:', error);
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

// ====================
// ROTAS DE RELATÓRIOS
// ====================

/**
 * GET /api/admin/reports/clicks
 * Relatório de cliques por produto
 */
router.get('/reports/clicks', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  try {
    const clicksReport = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        clicks: true,
        createdAt: true,
        store: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        clicks: 'desc'
      }
    });

    // Estatísticas gerais
    const totalClicks = clicksReport.reduce((sum, product) => sum + product.clicks, 0);
    const totalProducts = clicksReport.length;
    const averageClicks = totalProducts > 0 ? (totalClicks / totalProducts).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalClicks,
          totalProducts,
          averageClicks: parseFloat(averageClicks)
        },
        products: clicksReport
      }
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de cliques:', error);
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

// ==============================================
// ROTAS DE CATEGORIAS
// ==============================================

/**
 * GET /api/admin/categories
 * Listar todas as categorias
 */
router.get('/categories', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    // Ordenação customizada: Eletrônicos, Beleza & Saúde, Roupas & Acessórios, Outros
    const categoryOrder = {
      'eletronicos': 1,
      'beleza-saude': 2,
      'roupas-acessorios': 3
    };

    const sortedCategories = categories.sort((a, b) => {
      const orderA = categoryOrder[a.slug] || 4;
      const orderB = categoryOrder[b.slug] || 4;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      // Para categorias na mesma prioridade, ordenar alfabeticamente
      return a.name.localeCompare(b.name);
    });

    res.json({
      success: true,
      data: sortedCategories
    });

  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

/**
 * POST /api/admin/categories
 * Criar nova categoria
 * Body: { name: string, slug: string?, description: string? }
 */
router.post('/categories', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nome da categoria obrigatório'
      });
    }

    // Gerar slug se não fornecido
    const finalSlug = slug || name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    // Verificar se já existe categoria com mesmo nome ou slug
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name: name.trim() },
          { slug: finalSlug }
        ]
      }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'Categoria já existe',
        details: existingCategory.name === name.trim() ? 'Nome já utilizado' : 'Slug já utilizado'
      });
    }

    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        description: description?.trim() || null
      },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: newCategory,
      message: 'Categoria criada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

/**
 * PUT /api/admin/categories/:id
 * Atualizar categoria
 * Body: { name: string?, slug: string?, description: string? }
 */
router.put('/categories/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { name, slug, description } = req.body;

    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de categoria inválido'
      });
    }

    // Verificar se categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada'
      });
    }

    // Preparar dados para atualização
    const updateData = {};
    
    if (name && name.trim().length > 0) {
      updateData.name = name.trim();
    }
    
    if (slug && slug.trim().length > 0) {
      updateData.slug = slug.trim();
    }
    
    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    // Verificar conflitos se name ou slug foram alterados
    if (updateData.name || updateData.slug) {
      const conflictCategory = await prisma.category.findFirst({
        where: {
          AND: [
            { id: { not: categoryId } },
            {
              OR: [
                updateData.name ? { name: updateData.name } : {},
                updateData.slug ? { slug: updateData.slug } : {}
              ]
            }
          ]
        }
      });

      if (conflictCategory) {
        return res.status(400).json({
          success: false,
          error: 'Conflito com categoria existente',
          details: conflictCategory.name === updateData.name ? 'Nome já utilizado' : 'Slug já utilizado'
        });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: updatedCategory,
      message: 'Categoria atualizada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

/**
 * DELETE /api/admin/categories/:id
 * Deletar categoria
 */
router.delete('/categories/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de categoria inválido'
      });
    }

    // Verificar se categoria existe e contar produtos associados
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada'
      });
    }

    // Avisar se há produtos associados
    if (category._count.products > 0) {
      return res.status(400).json({
        success: false,
        error: 'Não é possível deletar categoria com produtos associados',
        details: `Esta categoria possui ${category._count.products} produto(s) associado(s)`
      });
    }

    await prisma.category.delete({
      where: { id: categoryId }
    });

    res.json({
      success: true,
      message: 'Categoria deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

module.exports = router;