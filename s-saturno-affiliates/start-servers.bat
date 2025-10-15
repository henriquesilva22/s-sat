@echo off
title S-Saturno Affiliates - Servidores
echo ==========================================
echo       S-SATURNO AFFILIATES
echo ==========================================
echo.
echo Parando processos node existentes...
taskkill /F /IM node.exe >nul 2>&1
echo.
echo Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo.
echo Iniciando Backend (porta 3001)...
cd /d "A:\site\s-saturno-affiliates\backend"
start "Backend" cmd /k "npm run dev"

echo.
echo Aguardando backend inicializar...
timeout /t 5 /nobreak >nul

echo.
echo Iniciando Frontend (porta 5173)...
cd /d "A:\site\s-saturno-affiliates\frontend"
start "Frontend" cmd /k "npm run dev"

echo.
echo Aguardando frontend inicializar...
timeout /t 5 /nobreak >nul

echo.
echo ==========================================
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo ==========================================
echo.
echo Abrindo o navegador...
start http://localhost:5173

echo.
echo Servidores iniciados!
echo Pressione qualquer tecla para sair...
pause >nul