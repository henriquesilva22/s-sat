#!/bin/bash

# S-Saturno Affiliates - Script de instalação automática
echo "🚀 S-Saturno Affiliates - Instalação Automática"
echo "================================================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado!"
    echo "   Por favor, instale o Node.js 18+ em: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado!"
    exit 1
fi

echo "✅ npm encontrado: $(npm --version)"

# Instalar dependências do projeto principal
echo ""
echo "📦 Instalando dependências do projeto principal..."
npm install

# Instalar dependências do backend
echo ""
echo "📦 Instalando dependências do backend..."
cd backend
npm install

# Configurar banco de dados
echo ""
echo "🗄️ Configurando banco de dados..."
npm run db:generate
npm run db:push

# Popular banco com dados de exemplo
echo ""
echo "🌱 Populando banco com dados de exemplo..."
npm run db:seed

# Voltar para diretório raiz
cd ..

# Instalar dependências do frontend
echo ""
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install

# Voltar para diretório raiz
cd ..

echo ""
echo "🎉 Instalação concluída com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Configure as variáveis de ambiente:"
echo "      - backend/.env (JWT_SECRET, ADMIN_PASSWORD)"
echo "      - frontend/.env.local (se necessário)"
echo ""
echo "   2. Execute a aplicação:"
echo "      npm run dev"
echo ""
echo "   3. Acesse:"
echo "      - Marketplace: http://localhost:5173"
echo "      - Admin: http://localhost:5173/admin/login (senha: admin123)"
echo ""
echo "📖 Leia o README.md para mais informações!"