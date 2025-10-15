require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');

// Importar rotas
const productsRoutes = require('./routes/products');
const storesRoutes = require('./routes/stores');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');

// Inicializar Express e Prisma
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// ===============================
// MIDDLEWARES GLOBAIS
// ===============================

// Segurança básica
app.use(helmet({
  crossOriginEmbedderPolicy: false // Para permitir imagens externas
}));

// Rate limiting - limitar requisições por IP
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por window
  message: {
    error: 'Muitas requisições',
    message: 'Tente novamente em alguns minutos',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 1000)
  },
  standardHeaders: true, // Retorna rate limit info nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
});

app.use(limiter);

// CORS - configurar origens permitidas
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requisições sem origin (ex: aplicativos mobile)
    if (!origin) return callback(null, true);
    
    // Lista de origens permitidas
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      process.env.CORS_ORIGIN
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Parser de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para adicionar informações de request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  
  // Log das requisições em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log(`${req.method} ${req.path} - ${req.ip} - ${req.requestTime}`);
  }
  
  next();
});

// ===============================
// ARQUIVOS ESTÁTICOS (UPLOADS)
// ===============================

// Servir arquivos de upload como estáticos
app.use('/uploads', express.static('uploads'));

// ===============================
// ROTAS DA API
// ===============================

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'S-Saturno Affiliates API está funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota raiz com informações da API
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API S-Saturno Affiliates! 🛍️',
    version: '1.0.0',
    documentation: {
      endpoints: {
        public: [
          'GET /api/products - Listar produtos',
          'GET /api/products/:id - Buscar produto específico',
          'POST /api/products/track-click - Registrar clique',
          'GET /api/stores - Listar lojas'
        ],
        admin: [
          'POST /api/admin/login - Login administrativo',
          'GET /api/admin/dashboard - Dashboard com estatísticas',
          'GET /api/admin/products - Gerenciar produtos',
          'GET /api/admin/stores - Gerenciar lojas',
          'GET /api/admin/reports/clicks - Relatórios de cliques'
        ]
      }
    },
    timestamp: req.requestTime
  });
});

// Servir arquivos estáticos (imagens de upload)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Registrar rotas da API
app.use('/api/products', productsRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// ===============================
// TRATAMENTO DE ERROS
// ===============================

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    message: `A rota ${req.method} ${req.originalUrl} não existe`,
    suggestion: 'Verifique a documentação da API em GET /'
  });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);

  // Erro de JSON malformado
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'JSON inválido',
      message: 'O corpo da requisição contém JSON malformado'
    });
  }

  // Erro do Prisma
  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({
      success: false,
      error: 'Erro de banco de dados',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor'
    });
  }

  // Erro genérico
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.stack : 'Algo deu errado'
  });
});

// ===============================
// INICIALIZAÇÃO DO SERVIDOR
// ===============================

/**
 * Função para inicializar o servidor
 */
async function startServer() {
  try {
    // Testar conexão com o banco de dados
    await prisma.$connect();
    console.log('✅ Conexão com o banco de dados estabelecida');

    // Verificar se as variáveis de ambiente obrigatórias estão configuradas
    const requiredEnvVars = ['JWT_SECRET', 'ADMIN_PASSWORD'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Variáveis de ambiente obrigatórias não configuradas:');
      missingVars.forEach(varName => console.error(`   - ${varName}`));
      process.exit(1);
    }

    // Iniciar o servidor
    const server = app.listen(PORT, () => {
      console.log('\n🚀 ====================================');
      console.log(`   S-SATURNO AFFILIATES API`);
      console.log('🚀 ====================================');
      console.log(`📡 Servidor rodando na porta: ${PORT}`);
      console.log(`🌍 URL: http://localhost:${PORT}`);
      console.log(`📚 Documentação: http://localhost:${PORT}/`);
      console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Banco de dados: SQLite (${process.env.DATABASE_URL})`);
      console.log('🚀 ====================================\n');
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('🔄 Recebido SIGTERM, desligando servidor...');
      await prisma.$disconnect();
      server.close(() => {
        console.log('✅ Servidor desligado com sucesso');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('\n🔄 Recebido SIGINT, desligando servidor...');
      await prisma.$disconnect();
      server.close(() => {
        console.log('✅ Servidor desligado com sucesso');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Erro ao inicializar o servidor:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Inicializar o servidor apenas se este arquivo for executado diretamente
if (require.main === module) {
  startServer();
}

module.exports = app;