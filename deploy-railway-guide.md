# Deploy no Railway - Guia Completo

## 1. Preparação do Código

### Backend (Node.js + Express)
1. Criar arquivo `railway.toml` na pasta backend:
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run start"
healthcheckPath = "/"
healthcheckTimeout = 100
restartPolicyType = "on_failure"

[env]
PORT = { default = "3001" }
NODE_ENV = { default = "production" }
```

2. Modificar `package.json` do backend para incluir script de produção:
```json
{
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "build": "echo 'No build needed for backend'"
  }
}
```

3. Configurar variáveis de ambiente para produção no backend.

### Frontend (React + Vite)
1. Criar arquivo `railway.toml` na pasta frontend:
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run preview"
healthcheckPath = "/"

[env]
VITE_API_URL = { default = "https://seu-backend-railway.up.railway.app" }
```

2. Modificar `package.json` do frontend:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0 --port $PORT",
    "start": "npm run build && npm run preview"
  }
}
```

## 2. Deploy no Railway

### Passos:
1. **Criar conta no Railway**: https://railway.app/
2. **Conectar GitHub**: Faça push do seu código para um repositório GitHub
3. **Criar dois projetos**:
   - Um para o backend
   - Um para o frontend
4. **Configurar variáveis de ambiente**
5. **Deploy automático** a cada push

### Variáveis de Ambiente Necessárias:

#### Backend:
- `PORT` (Railway define automaticamente)
- `NODE_ENV=production`
- `DATABASE_URL` (se usando PostgreSQL)
- `JWT_SECRET=seu_jwt_secret_aqui`

#### Frontend:
- `VITE_API_URL=https://seu-backend.up.railway.app`

## 3. Configuração de Domínio

1. **Domínio Railway** (gratuito): `seu-app.up.railway.app`
2. **Domínio personalizado**:
   - Comprar domínio (Registro.br, Namecheap, etc.)
   - Configurar DNS no Railway
   - Apontar CNAME para o domínio Railway

## 4. Banco de Dados

### Opção 1: SQLite (Atual)
- ⚠️ Problema: Railway não persiste arquivos
- Dados serão perdidos a cada deploy

### Opção 2: PostgreSQL (Recomendado)
```bash
# Railway oferece PostgreSQL gratuito
# Conecta automaticamente via DATABASE_URL
```

## 5. Custos Estimados

### Railway:
- **Gratuito**: $0/mês (500 horas de execução)
- **Pro**: $20/mês (uso ilimitado)

### Domínio:
- **.com.br**: ~R$ 30/ano
- **.com**: ~R$ 50/ano

## 6. Checklist de Deploy

- [ ] Código no GitHub
- [ ] Backend configurado para produção
- [ ] Frontend configurado com URL do backend
- [ ] Banco de dados configurado
- [ ] Variáveis de ambiente definidas
- [ ] Deploy realizado
- [ ] Domínio configurado
- [ ] SSL/HTTPS funcionando (Railway faz automaticamente)