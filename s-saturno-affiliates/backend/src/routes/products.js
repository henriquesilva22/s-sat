const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { asyncHandler } = require('../middleware/auth');
const { validatePagination } = require('../middleware/validation');
const { formatPaginationResponse, handlePrismaError } = require('../utils/helpers');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/products
 * Lista produtos com filtros, busca e paginação
 * Query params:
 * - q: termo de busca (opcional)
 * - storeId: filtro por loja (opcional)
 * - categoryIds: filtro por categorias - array de IDs (opcional)
 * - page: página atual (padrão: 1)
 * - perPage: itens por página (padrão: 12, máx: 100)
 */
router.get('/', validatePagination, asyncHandler(async (req, res) => {
  const { q, storeId, categoryIds } = req.query;
  const { page, perPage, skip } = req.pagination;

  try {
    // Processar filtro de categorias
    let categoryFilter = {};
    if (categoryIds) {
      const categoryIdArray = Array.isArray(categoryIds) 
        ? categoryIds.map(id => parseInt(id)).filter(id => !isNaN(id))
        : [parseInt(categoryIds)].filter(id => !isNaN(id));
        
      if (categoryIdArray.length > 0) {
        categoryFilter = {
          categories: {
            some: {
              id: {
                in: categoryIdArray
              }
            }
          }
        };
      }
    }

    // Construir filtros de busca
    const where = {
      isActive: true, // Apenas produtos ativos
      ...(q && {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { tags: { contains: q } }
        ]
      }),
      ...(storeId && {
        storeId: parseInt(storeId)
      }),
      ...categoryFilter
    };

    // Buscar produtos com relacionamento da loja e categorias
    const [products, totalItems] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          store: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              domain: true
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
        },
        skip,
        take: perPage
      }),
      prisma.product.count({ where })
    ]);

    // Formatar response com paginação
    const response = formatPaginationResponse(products, totalItems, page, perPage);

    res.json({
      success: true,
      ...response
    });

  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

/**
 * GET /api/products/:id
 * Busca um produto específico pelo ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
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
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        isActive: true
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            domain: true,
            description: true
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

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
        message: 'O produto solicitado não existe ou não está ativo'
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

/**
 * POST /api/products/track-click
 * Registra um clique em um produto (para analytics de afiliado)
 * Body: { productId: number }
 */
router.post('/track-click', asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId || !Number.isInteger(productId)) {
    return res.status(400).json({
      success: false,
      error: 'Product ID inválido',
      message: 'É necessário informar um ID de produto válido'
    });
  }

  try {
    // Verificar se o produto existe e está ativo
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        isActive: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
        message: 'O produto não existe ou não está ativo'
      });
    }

    // Incrementar contador de cliques do produto
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        clicks: {
          increment: 1
        }
      },
      select: {
        id: true,
        title: true,
        clicks: true,
        affiliateUrl: true
      }
    });

    // Opcionalmente, registrar o clique na tabela de tracking
    const userAgent = req.get('User-Agent');
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';

    await prisma.clickTracking.create({
      data: {
        productId,
        ip: clientIp,
        userAgent
      }
    });

    res.json({
      success: true,
      message: 'Clique registrado com sucesso',
      data: {
        productId: updatedProduct.id,
        title: updatedProduct.title,
        totalClicks: updatedProduct.clicks,
        affiliateUrl: updatedProduct.affiliateUrl
      }
    });

  } catch (error) {
    console.error('Erro ao registrar clique:', error);
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

/**
 * GET /api/products/categories
 * Lista todas as categorias públicas
 */
router.get('/categories', asyncHandler(async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
        color: true,
        _count: {
          select: {
            products: {
              where: {
                isActive: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Filtrar apenas categorias que têm produtos ativos
    const categoriesWithProducts = categories.filter(cat => cat._count.products > 0);

    res.json({
      success: true,
      data: categoriesWithProducts,
      count: categoriesWithProducts.length
    });

  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

module.exports = router;