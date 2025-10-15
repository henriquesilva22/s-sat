# S-Saturno Affiliates

Um marketplace completo de afiliados moderno, bonito e responsivo, desenvolvido com **React**, **Node.js**, **Express** e **Prisma**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)

## 🎯 Visão Geral

O **S-Saturno Affiliates** é uma plataforma completa para marketplace de produtos afiliados, onde administradores podem cadastrar lojas parceiras e produtos, enquanto visitantes navegam pelos produtos e são redirecionados para os links de afiliado correspondentes.

### ✨ Características Principais

- 🛍️ **Interface moderna** inspirada no Mercado Livre
- 📱 **Totalmente responsiva** (mobile, tablet, desktop)  
- 🔍 **Busca e filtros** avançados por produtos e lojas
- 📊 **Painel administrativo** completo com dashboard
- 📈 **Analytics de cliques** em tempo real
- 🔐 **Autenticação JWT** para área administrativa
- 🎨 **Design moderno** com TailwindCSS
- ⚡ **Performance otimizada** com React + Vite
- 💾 **Banco SQLite** local (fácil deployment)

## 🏗️ Arquitetura

### Backend (Node.js + Express)
- **API REST** completa com documentação
- **Prisma ORM** para gerenciamento do banco
- **SQLite** como banco de dados local
- **JWT** para autenticação administrativa
- **Middlewares** de segurança e validação
- **Rate limiting** e proteção CORS

### Frontend (React + Vite)
- **React 18** com hooks modernos
- **TailwindCSS** para estilização
- **React Router** para navegação
- **Axios** para requisições HTTP
- **React Hot Toast** para notificações
- **Lucide React** para ícones

## 🚀 Instalação e Configuração

### Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**

### 1. Clone o repositório

```bash
git clone https://github.com/s-saturno/s-saturno-affiliates.git
cd s-saturno-affiliates
```

### 2. Instalação automática

```bash
# Instalar todas as dependências (backend + frontend)
npm run setup
```

**OU** fazer manualmente:

```bash
# Instalar dependências
npm run install:all

# Configurar banco de dados
npm run db:setup

# Popular com dados de exemplo
npm run db:seed
```

### 3. Configurar variáveis de ambiente

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edite o arquivo `backend/.env`:
```env
# Servidor
PORT=3001
NODE_ENV=development

# Banco de dados  
DATABASE_URL="file:./dev.db"

# JWT (ALTERE EM PRODUÇÃO!)
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_123456789

# Senha admin (ALTERE EM PRODUÇÃO!)
ADMIN_PASSWORD=admin123

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### Frontend (.env.local)
```bash
cd frontend  
cp .env.example .env.local
```

Edite o arquivo `frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_NODE_ENV=development
```

### 4. Executar em desenvolvimento

```bash
# Executar backend e frontend simultaneamente
npm run dev
```

**OU** separadamente:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

## 🌐 Acesso à Aplicação

Após executar `npm run dev`:

- **Frontend (Marketplace)**: http://localhost:5173
- **Backend (API)**: http://localhost:3001  
- **Painel Admin**: http://localhost:5173/admin/login

### 🔐 Credenciais Administrativas

- **Senha padrão**: `admin123` (configurável no `.env`)

## 📖 Uso da Aplicação

### Área Pública (Marketplace)

1. **Navegação**: Veja todos os produtos na página inicial
2. **Busca**: Use a barra de pesquisa para encontrar produtos específicos
3. **Filtros**: Filtre por loja parceira
4. **Produtos**: Clique em "Ir ao Produto" para ser redirecionado ao link de afiliado
5. **Responsivo**: Funciona perfeitamente em mobile, tablet e desktop

### Área Administrativa

1. **Login**: Acesse `/admin/login` com a senha configurada
2. **Dashboard**: Veja estatísticas de produtos, lojas e cliques
3. **Gerenciar Produtos**: 
   - Visualizar todos os produtos
   - Criar, editar e excluir produtos
   - Ver analytics de cliques
4. **Gerenciar Lojas**:
   - Cadastrar lojas parceiras  
   - Editar informações das lojas
   - Ver quantidade de produtos por loja

## 🛠️ Comandos Disponíveis

### Comandos Principais
```bash
npm run dev          # Executar em desenvolvimento (backend + frontend)
npm run build        # Build para produção
npm start           # Executar em produção (apenas backend)
npm run setup       # Configuração inicial completa
```

### Banco de Dados
```bash
npm run db:setup    # Configurar banco (generate + push)  
npm run db:seed     # Popular com dados de exemplo
npm run db:reset    # Resetar banco (cuidado!)
```

### Utilitários
```bash
npm run clean       # Limpar node_modules e banco
npm run lint        # Verificar código (ESLint)
```

## 📊 API Endpoints

### Públicos
- `GET /api/products` - Listar produtos com filtros
- `GET /api/products/:id` - Buscar produto específico
- `POST /api/products/track-click` - Registrar clique
- `GET /api/stores` - Listar lojas

### Administrativos (Requerem autenticação)
- `POST /api/admin/login` - Login administrativo
- `GET /api/admin/dashboard` - Estatísticas do dashboard
- `GET|POST|PUT|DELETE /api/admin/products` - CRUD de produtos
- `GET|POST|PUT|DELETE /api/admin/stores` - CRUD de lojas  
- `GET /api/admin/reports/clicks` - Relatório de cliques

## 🎨 Estrutura de Pastas

```
s-saturno-affiliates/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares de autenticação e validação  
│   │   ├── utils/          # Utilitários e helpers
│   │   └── server.js       # Servidor principal
│   ├── prisma/
│   │   ├── schema.prisma   # Schema do banco de dados
│   │   └── seed.js         # Script de seed
│   └── package.json
├── frontend/               # Frontend React + Vite
│   ├── src/
│   │   ├── components/     # Componentes React reutilizáveis
│   │   ├── pages/          # Páginas da aplicação  
│   │   ├── hooks/          # Hooks customizados
│   │   ├── services/       # Serviços de API
│   │   ├── utils/          # Utilitários do frontend
│   │   └── main.jsx        # Entrada da aplicação
│   └── package.json
└── package.json            # Scripts principais do projeto
```

## 🚀 Deploy em Produção

### 1. Build da aplicação
```bash
npm run build
```

### 2. Configurar variáveis de produção

**Backend (.env):**
```env
NODE_ENV=production  
PORT=3001
JWT_SECRET=sua_chave_secreta_super_forte
ADMIN_PASSWORD=sua_senha_admin_forte
DATABASE_URL="file:./production.db"
CORS_ORIGIN=https://seudominio.com
```

### 3. Executar em produção
```bash
npm start
```

### 4. Servir frontend estático

O build do frontend fica na pasta `frontend/dist`. Você pode:
- Servir com **Nginx**, **Apache** ou **Vercel**
- Usar **PM2** para o backend em VPS
- Deploy no **Railway**, **Heroku** ou **DigitalOcean**

### Exemplo de deploy com banco PostgreSQL/MySQL

Para usar PostgreSQL ou MySQL em produção, altere o `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // ou "mysql"  
  url      = env("DATABASE_URL")
}
```

E configure a `DATABASE_URL` apropriada:
```env
DATABASE_URL="postgresql://usuario:senha@host:5432/database"
```

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)  
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- 📧 **Email**: suporte@s-saturno.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/s-saturno/s-saturno-affiliates/issues)
- 📖 **Documentação**: [Wiki do projeto](https://github.com/s-saturno/s-saturno-affiliates/wiki)

## 🎉 Agradecimentos  

- **React** pela biblioteca fantástica
- **TailwindCSS** pelo sistema de design
- **Prisma** pelo ORM moderno
- **Vite** pela velocidade de desenvolvimento
- Comunidade open source pelo suporte

---

<div align="center">

**Desenvolvido com ❤️ pela equipe S-Saturno**

[🌐 Website](https://s-saturno.com) • [📧 Email](mailto:contato@s-saturno.com) • [🐙 GitHub](https://github.com/s-saturno)

</div>