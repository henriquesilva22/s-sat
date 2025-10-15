const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Middleware para verificar autenticação JWT
 * Verifica se o token é válido e adiciona os dados do usuário à requisição
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  // DEBUG: Log da autenticação
  console.log('🔐 [AUTH DEBUG]', {
    url: req.url,
    method: req.method,
    authHeader: authHeader ? 'Presente' : 'Ausente',
    token: token ? `${token.substring(0, 20)}...` : 'Não encontrado',
    timestamp: new Date().toISOString()
  });

  if (!token) {
    console.log('❌ [AUTH] Token ausente para:', req.url);
    return res.status(401).json({ 
      error: 'Token de acesso requerido',
      message: 'Por favor, faça login para acessar este recurso' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('❌ [AUTH] Token inválido:', err.message);
      return res.status(403).json({ 
        error: 'Token inválido',
        message: 'O token fornecido é inválido ou expirou' 
      });
    }

    console.log('✅ [AUTH] Token válido para:', req.url);
    // Adiciona os dados do usuário decodificados à requisição
    req.user = decoded;
    next();
  });
};

/**
 * Middleware para verificar se o usuário é admin
 * Deve ser usado após o authenticateToken
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Acesso negado',
      message: 'Apenas administradores podem acessar este recurso' 
    });
  }
  next();
};

/**
 * Middleware para capturar erros assíncronos
 * Evita a necessidade de try/catch em todas as rotas
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  asyncHandler
};