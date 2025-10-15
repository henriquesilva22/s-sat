# 🚀 Guia de Deploy - S-Saturno Affiliates

## 🌐 **Opção 1: Vercel (Recomendado)**

### **Vantagens:**
- ✅ Grátis para projetos pessoais
- ✅ Deploy automático via GitHub
- ✅ SSL gratuito
- ✅ CDN global
- ✅ Fácil configuração

### **Passos:**

#### 1. **Instalar Vercel CLI** (já feito)
```bash
npm install -g vercel
```

#### 2. **Login na Vercel**
```bash
vercel login
```

#### 3. **Deploy Inicial**
```bash
# Na pasta raiz do projeto
vercel

# Responda as perguntas:
# - Set up and deploy? Yes
# - Which scope? Sua conta
# - Link to existing project? No
# - Project name? s-saturno-affiliates
# - Directory? ./
```

#### 4. **Deploy de Produção**
```bash
vercel --prod
```

---

## 🌐 **Opção 2: Netlify**

### **1. Via GitHub (Automático)**
1. Acesse [netlify.com](https://netlify.com)
2. Conecte sua conta GitHub
3. Selecione o repositório `s-sat`
4. Configurações:
   - **Build command**: `cd frontend && npm run build`
   - **Publish directory**: `frontend/dist`

### **2. Via Drag & Drop**
```bash
# Build do frontend
cd frontend
npm run build

# Arraste a pasta 'dist' para netlify.com
```

---

## 🌐 **Opção 3: Railway**

### **Deploy do Backend:**
1. Acesse [railway.app](https://railway.app)
2. Conecte ao GitHub
3. Selecione `s-sat`
4. Configure:
   - **Root directory**: `backend`
   - **Build command**: `npm install && npx prisma generate`
   - **Start command**: `npm start`

### **Deploy do Frontend:**
1. Novo projeto no Railway
2. Configure:
   - **Root directory**: `frontend`
   - **Build command**: `npm run build`
   - **Start command**: `npm run preview`

---

## 🌐 **Opção 4: Render**

### **Backend:**
1. [render.com](https://render.com) → New Web Service
2. Conecte GitHub → Selecione `s-sat`
3. Configure:
   - **Root directory**: `backend`
   - **Build command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start command**: `npm start`

### **Frontend:**
1. New Static Site
2. Configure:
   - **Root directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

---

## ⚡ **Deploy Rápido (Recomendado)**

### **Usando Vercel:**

```bash
# 1. Login
vercel login

# 2. Deploy
vercel

# 3. Seguir instruções na tela
# 4. Deploy de produção
vercel --prod
```

Seu site estará online em: `https://seu-projeto.vercel.app`

---

## 🔧 **Configurações Importantes**

### **1. Variáveis de Ambiente**

**Frontend (.env.production):**
```env
VITE_API_URL=https://sua-api.vercel.app/api
```

**Backend (.env.production):**
```env
NODE_ENV=production
DATABASE_URL="file:./prod.db"
JWT_SECRET="seu-jwt-secret-super-seguro"
PORT=3001
```

### **2. CORS no Backend**
Atualize o `backend/src/server.js` para incluir seu domínio:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://seu-projeto.vercel.app'
  ]
}));
```

---

## 📋 **Checklist Pré-Deploy**

- [ ] ✅ Código no GitHub atualizado
- [ ] ✅ Arquivos de configuração criados
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Build do frontend testado localmente
- [ ] ✅ CORS configurado para domínio de produção

---

## 🎯 **Próximos Passos Após Deploy**

1. **Configurar domínio personalizado** (opcional)
2. **Configurar analytics** (Google Analytics)
3. **Otimizar SEO** (meta tags, sitemap)
4. **Configurar monitoramento** (uptime)
5. **Backup automático** do banco de dados

---

## 🆘 **Problemas Comuns e Soluções**

### **Erro de CORS:**
```javascript
// backend/src/server.js
app.use(cors({
  origin: ['https://seu-dominio.vercel.app'],
  credentials: true
}));
```

### **Rotas não funcionam:**
```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### **Banco de dados não persiste:**
Use PostgreSQL ou MySQL em produção para dados permanentes.

---

**🌌 Escolha a opção que preferir e seu S-Saturno estará online em minutos!**