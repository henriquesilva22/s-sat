const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { asyncHandler } = require('../middleware/auth');
const { handlePrismaError } = require('../utils/helpers');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/stores
 * Lista todas as lojas ativas
 */
router.get('/', asyncHandler(async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        domain: true,
        createdAt: true,
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

    // Adicionar contagem de produtos ativos
    const storesWithProductCount = stores.map(store => ({
      ...store,
      productCount: store._count.products
    }));

    res.json({
      success: true,
      data: storesWithProductCount
    });

  } catch (error) {
    console.error('Erro ao buscar lojas:', error);
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

/**
 * GET /api/stores/:id
 * Busca uma loja específica pelo ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
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
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        products: {
          where: {
            isActive: true
          },
          select: {
            id: true,
            title: true,
            price: true,
            imageUrl: true,
            clicks: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        error: 'Loja não encontrada',
        message: 'A loja solicitada não existe'
      });
    }

    res.json({
      success: true,
      data: store
    });

  } catch (error) {
    console.error('Erro ao buscar loja:', error);
    const { status, message, details } = handlePrismaError(error);
    
    res.status(status).json({
      success: false,
      error: message,
      details
    });
  }
}));

module.exports = router;