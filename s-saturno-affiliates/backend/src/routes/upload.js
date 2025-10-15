/**
 * Rota para upload de imagens
 * Este arquivo mostra como implementar upload de imagens no backend
 */
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configurar diretórios para armazenar uploads
const uploadBaseDir = path.join(__dirname, '../../uploads');
const imageDir = path.join(uploadBaseDir, 'images');
const productDir = path.join(uploadBaseDir, 'products');

// Criar diretórios se não existirem
[uploadBaseDir, imageDir, productDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determinar o diretório baseado no tipo de upload
    const uploadType = req.params.type || req.body.type || 'images';
    let destDir = imageDir; // padrão
    
    if (uploadType === 'products') {
      destDir = productDir;
    }
    
    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'img-' + uniqueSuffix + ext);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
});

/**
 * POST /api/upload/image
 * Upload de uma única imagem
 */
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo foi enviado'
      });
    }

    // URL da imagem (ajuste conforme sua configuração de servidor)
    const imageUrl = `/uploads/images/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Imagem enviada com sucesso',
      imageUrl: imageUrl,
      filename: req.file.filename
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * DELETE /api/upload/image/:filename
 * Remover imagem do servidor
 */
router.delete('/image/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        success: true,
        message: 'Imagem removida com sucesso'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Arquivo não encontrado'
      });
    }

  } catch (error) {
    console.error('Erro ao remover imagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * GET /api/upload/images
 * Listar todas as imagens
 */
router.get('/images', (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        filename: file,
        url: `/uploads/images/${file}`,
        uploadDate: fs.statSync(path.join(uploadDir, file)).mtime
      }));

    res.json({
      success: true,
      images: images
    });

  } catch (error) {
    console.error('Erro ao listar imagens:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota específica para upload de imagens de produtos
router.post('/product-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo foi enviado'
      });
    }

    // URL que o frontend poderá usar (URL relativa)
    const imageUrl = `/uploads/products/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Imagem do produto enviada com sucesso',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: imageUrl,
        // Também retornar path relativo para salvar no banco
        relativePath: `/uploads/products/${req.file.filename}`
      }
    });

  } catch (error) {
    console.error('Erro no upload de imagem do produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Rota para converter base64 para arquivo
router.post('/convert-base64', (req, res) => {
  try {
    const { imageData, filename } = req.body;
    
    if (!imageData || !imageData.startsWith('data:image/')) {
      return res.status(400).json({
        success: false,
        error: 'Dados de imagem inválidos'
      });
    }

    // Extrair tipo e dados da imagem
    const matches = imageData.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({
        success: false,
        error: 'Formato de imagem base64 inválido'
      });
    }

    const imageType = matches[1];
    const imageBuffer = Buffer.from(matches[2], 'base64');
    
    // Gerar nome único
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = filename ? filename.replace(/[^a-zA-Z0-9.-]/g, '_') : 'converted';
    const fullFileName = `${fileName}-${uniqueSuffix}.${imageType}`;
    
    // Salvar arquivo
    const filePath = path.join(productDir, fullFileName);
    fs.writeFileSync(filePath, imageBuffer);
    
    const imageUrl = `/uploads/products/${fullFileName}`;
    
    res.json({
      success: true,
      message: 'Imagem convertida e salva com sucesso',
      data: {
        filename: fullFileName,
        url: imageUrl,
        relativePath: `/uploads/products/${fullFileName}`,
        size: imageBuffer.length
      }
    });

  } catch (error) {
    console.error('Erro na conversão de base64:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;

/*
Para usar este endpoint, você precisa:

1. Instalar o multer:
   npm install multer

2. No seu servidor principal (server.js), adicionar:
   const uploadRoutes = require('./routes/upload');
   app.use('/api/upload', uploadRoutes);

3. Servir arquivos estáticos (para acessar as imagens):
   app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

4. No frontend, usar a função uploadImageToServer do arquivo imageUpload.js
*/