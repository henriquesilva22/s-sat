#!/bin/bash
# Deploy Backend para Render.com

echo "📦 Preparando deploy do backend para Render..."

# 1. Build e preparação
echo "1️⃣ Instalando dependências..."
npm install

# 2. Gerar cliente Prisma
echo "2️⃣ Gerando cliente Prisma..."
npx prisma generate

# 3. Executar migrações (se necessário)
echo "3️⃣ Executando migrações do banco..."
npx prisma migrate deploy

# 4. Seed do banco (se necessário)
echo "4️⃣ Executando seed do banco..."
npx prisma db seed

echo "✅ Backend preparado para deploy!"
echo ""
echo "🚀 PRÓXIMOS PASSOS MANUAIS:"
echo "1. Acesse: https://render.com"
echo "2. Conecte seu repositório GitHub: https://github.com/henriquesilva22/s-sat"
echo "3. Configure os serviços conforme render.yaml"
echo "4. Aguarde o deploy ser concluído"
echo "5. Copie a URL do backend e configure no frontend"