@echo off
REM S-Saturno Affiliates - Script de instalacao automatica para Windows

echo.
echo 🚀 S-Saturno Affiliates - Instalacao Automatica
echo =================================================

REM Verificar se Node.js esta instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js nao esta instalado!
    echo    Por favor, instale o Node.js 18+ em: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
node --version

REM Verificar se npm esta instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm nao esta instalado!
    pause
    exit /b 1
)

echo ✅ npm encontrado
npm --version

REM Instalar dependencias do projeto principal
echo.
echo 📦 Instalando dependencias do projeto principal...
npm install

REM Instalar dependencias do backend
echo.
echo 📦 Instalando dependencias do backend...
cd backend
npm install

REM Configurar banco de dados
echo.
echo 🗄️ Configurando banco de dados...
npm run db:generate
npm run db:push

REM Popular banco com dados de exemplo
echo.
echo 🌱 Populando banco com dados de exemplo...
npm run db:seed

REM Voltar para diretorio raiz
cd ..

REM Instalar dependencias do frontend
echo.
echo 📦 Instalando dependencias do frontend...
cd frontend
npm install

REM Voltar para diretorio raiz
cd ..

echo.
echo 🎉 Instalacao concluida com sucesso!
echo.
echo 📋 Proximos passos:
echo    1. Configure as variaveis de ambiente:
echo       - backend/.env (JWT_SECRET, ADMIN_PASSWORD)
echo       - frontend/.env.local (se necessario)
echo.
echo    2. Execute a aplicacao:
echo       npm run dev
echo.
echo    3. Acesse:
echo       - Marketplace: http://localhost:5173
echo       - Admin: http://localhost:5173/admin/login (senha: admin123)
echo.
echo 📖 Leia o README.md para mais informacoes!
echo.
pause