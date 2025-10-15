# 🚀 GUIA RÁPIDO - S-Saturno Affiliates

## 📋 Instalação Rápida

### Windows:
```bash
# Execute o instalador automático
install.bat
```

### Linux/Mac:
```bash
# Execute o instalador automático
chmod +x install.sh
./install.sh
```

### Manual:
```bash
# 1. Instalar dependências
npm run setup

# 2. Executar aplicação
npm run dev
```

## 🌐 Acessos

- **Marketplace**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin/login
- **API**: http://localhost:3001

## 🔐 Credenciais

- **Senha Admin**: `admin123` (configurável em `backend/.env`)

## 📁 Estrutura Principal

```
s-saturno-affiliates/
├── backend/          # API Node.js + Express + Prisma
├── frontend/         # React + Vite + TailwindCSS
├── README.md         # Documentação completa
└── package.json      # Scripts principais
```

## 🛠️ Comandos Essenciais

```bash
npm run dev           # Executar em desenvolvimento
npm run build         # Build para produção
npm start            # Executar em produção
npm run db:seed      # Recriar dados de exemplo
npm run db:reset     # Resetar banco de dados
```

## 📖 Documentação

Leia o **README.md** completo para:
- Configuração detalhada
- Deploy em produção
- Customização avançada
- API endpoints
- Troubleshooting

## 🆘 Problemas Comuns

### Erro "Cannot connect to database"
```bash
cd backend
npm run db:generate
npm run db:push
```

### Porta já em uso
- Backend (3001): altere `PORT` em `backend/.env`
- Frontend (5173): altere em `frontend/vite.config.js`

### CORS errors
- Verifique `CORS_ORIGIN` em `backend/.env`
- Deve ser `http://localhost:5173` em desenvolvimento

---
**Desenvolvido com ❤️ pela equipe S-Saturno**