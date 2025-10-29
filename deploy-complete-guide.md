# 🚀 Guia Completo: Como Colocar Seu Site Online

## 📋 Resumo Executivo

**Seu projeto atual:**
- ✅ Frontend React/Vite funcionando (porta 5173)
- ✅ Backend Node.js/Express funcionando (porta 3001)
- ✅ Banco SQLite local
- ✅ Sistema de admin completo
- ✅ PromoCarousel implementado

**Para ir online, você precisa:**
1. **Hospedagem** (onde seu código vai rodar)
2. **Domínio** (endereço como www.seusaturno.com.br)
3. **Banco de dados** em produção
4. **Configuração** para ambiente de produção

---

## 🎯 **OPÇÃO 1: MAIS FÁCIL E RÁPIDA (Railway)**

### ⏱️ Tempo: ~2 horas
### 💰 Custo: Gratuito ou R$ 100/mês

**Passos:**

1. **Criar conta no Railway**
   - Acesse: https://railway.app/
   - Login com GitHub

2. **Preparar código para produção**
   ```bash
   # No seu projeto atual, criar estes arquivos:
   ```

3. **Deploy automático**
   - Connect GitHub repository
   - Railway faz deploy automaticamente

4. **Seu site estará online em:**
   - Backend: `https://seuprojeto-backend.up.railway.app`
   - Frontend: `https://seuprojeto-frontend.up.railway.app`

**Vantagens Railway:**
- ✅ Deploy automático
- ✅ SSL gratuito 
- ✅ Banco PostgreSQL gratuito
- ✅ Fácil de usar
- ✅ Domínio personalizado grátis

---

## 🎯 **OPÇÃO 2: MAIS BARATA (Contabo VPS)**

### ⏱️ Tempo: ~4-6 horas  
### 💰 Custo: ~R$ 25/mês

**O que você ganha:**
- VPS com 4GB RAM, 200GB SSD
- IP dedicado
- Controle total do servidor
- Pode hospedar múltiplos projetos

**Processo:**
1. Comprar VPS na Contabo
2. Instalar Ubuntu Server
3. Configurar Node.js, PostgreSQL, Nginx
4. Fazer deploy manual
5. Configurar SSL com Let's Encrypt

---

## 🎯 **OPÇÃO 3: NACIONAL (Hostinger Brasil)**

### ⏱️ Tempo: ~3 horas
### 💰 Custo: ~R$ 40/mês

**Vantagens:**
- ✅ Suporte em português
- ✅ Servidor no Brasil (mais rápido)
- ✅ cPanel intuitivo
- ✅ SSL gratuito

---

## 🌐 **DOMÍNIOS - Onde Comprar**

### Opções Brasileiras:
- **Registro.br** - R$ 40/ano (.com.br) - OFICIAL
- **Hostgator** - R$ 50/ano (.com)
- **Hostinger** - R$ 35/ano (.com)

### Opções Internacionais:
- **Namecheap** - $10/ano (.com)
- **Cloudflare** - $8/ano (.com) + CDN gratuito

---

## 💾 **BANCO DE DADOS**

### Problema atual: SQLite
- ❌ Não funciona em hospedagem compartilhada
- ❌ Dados podem ser perdidos no deploy
- ❌ Não é escalável

### Solução: PostgreSQL
- ✅ Gratuito no Railway (1GB)
- ✅ Confiável e escalável
- ✅ Suporte nativo do Prisma

---

## 🛠️ **PREPARAÇÃO PARA PRODUÇÃO**

### Backend:
```json
// package.json - adicionar:
{
  "scripts": {
    "start": "node src/server.js",
    "build": "echo 'Backend ready'"
  }
}
```

### Frontend:
```json
// package.json - adicionar:
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0 --port $PORT"
  }
}
```

### Variáveis de Ambiente:
```bash
# Backend (.env)
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=seu_jwt_secret_super_secreto
PORT=3001

# Frontend (.env)
VITE_API_URL=https://seu-backend.com
```

---

## 📊 **COMPARATIVO DE CUSTOS (por mês)**

| Serviço | Custo | Facilidade | Escalabilidade |
|---------|--------|------------|----------------|
| **Railway** | R$ 0-100 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Vercel + PlanetScale** | R$ 0-50 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Contabo VPS** | R$ 25 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Hostinger** | R$ 40 | ⭐⭐⭐ | ⭐⭐⭐ |
| **AWS/Google Cloud** | R$ 50-200 | ⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🚀 **RECOMENDAÇÃO: COMEÇAR SIMPLES**

### Para seu primeiro site online:

1. **Use Railway** (mais fácil)
   - Deploy em 30 minutos
   - Gratuito para começar
   - Upgrade conforme necessário

2. **Domínio .com.br**
   - Compre no Registro.br
   - Mais confiança do público brasileiro

3. **PostgreSQL do Railway**
   - Migração automática do SQLite
   - 1GB gratuito

### Evolução futura:
- Conforme o site crescer → VPS próprio
- Mais tráfego → CDN + Cache
- Mais recursos → Cloud provider

---

## ✅ **CHECKLIST DE DEPLOY**

### Antes de colocar online:
- [ ] Testar todas as funcionalidades localmente
- [ ] Configurar variáveis de ambiente
- [ ] Migrar banco SQLite → PostgreSQL
- [ ] Configurar CORS no backend
- [ ] Otimizar imagens e assets
- [ ] Testar responsividade mobile
- [ ] Configurar monitoramento básico

### Depois de online:
- [ ] Testar todas as rotas
- [ ] Verificar SSL (https://)
- [ ] Configurar Google Analytics
- [ ] Backup automático do banco
- [ ] Monitorar performance

---

## 📞 **PRÓXIMOS PASSOS**

**Quer que eu ajude você a:**
1. ✅ Preparar o código para produção?
2. ✅ Configurar o Railway step-by-step?
3. ✅ Migrar o banco SQLite para PostgreSQL?
4. ✅ Configurar domínio personalizado?

**Me fale qual opção prefere e posso te guiar passo a passo!**