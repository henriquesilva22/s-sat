import axios from 'axios';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://s-sat.onrender.com');

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    const fullStorage = { ...localStorage };
    
    // DEBUG: Log do token com mais detalhes
    console.log('🔑 [API DEBUG]', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenType: typeof token,
      tokenValue: token,
      tokenPreview: token && token !== 'null' ? `${token.substring(0, 30)}...` : 'Inválido/Null',
      localStorageKeys: Object.keys(fullStorage),
      timestamp: new Date().toISOString()
    });
    
    // Verificação adicional para requisições PUT/POST
    if (config.method?.toLowerCase() === 'put' || config.method?.toLowerCase() === 'post') {
      console.log('🚨 [CRITICAL DEBUG] Requisição PUT/POST:', {
        url: config.url,
        token: token,
        tokenIsNull: token === null,
        tokenIsStringNull: token === 'null',
        authHeader: config.headers.Authorization
      });
    }
    
    // Validação mais rigorosa do token
    if (token && token !== 'null' && token !== 'undefined' && token.length > 10) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.error('🚨 [TOKEN ERROR] Token inválido detectado:', token);
      // Limpar token inválido
      localStorage.removeItem('adminToken');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // DEBUG: Log de erro de autenticação
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('🚨 [AUTH ERROR]', {
        status: error.response.status,
        message: error.response?.data?.message,
        url: error.config?.url,
        method: error.config?.method,
        hadToken: !!localStorage.getItem('adminToken'),
        timestamp: new Date().toISOString()
      });
      
      localStorage.removeItem('adminToken');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Serviços para produtos
 */
export const productsAPI = {
  /**
   * Buscar produtos com filtros e paginação
   */
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/api/products', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar produtos');
    }
  },

  /**
   * Buscar produto específico por ID
   */
  getProduct: async (id) => {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar produto');
    }
  },

  /**
   * Registrar clique em um produto
   */
  trackClick: async (productId) => {
    try {
      const response = await api.post('/api/products/track-click', { productId });
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar clique:', error);
      // Não exibir erro para o usuário pois é apenas tracking
      return null;
    }
  },
};

/**
 * Serviços para lojas
 */
export const storesAPI = {
  /**
   * Buscar todas as lojas
   */
  getStores: async () => {
    try {
      const response = await api.get('/api/stores');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar lojas');
    }
  },

  /**
   * Buscar loja específica por ID
   */
  getStore: async (id) => {
    try {
      const response = await api.get(`/api/stores/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar loja');
    }
  },
};

/**
 * Serviços administrativos
 */
export const adminAPI = {
  /**
   * Login do administrador
   */
  login: async (password) => {
    try {
      const response = await api.post('/api/admin/login', { password });
      
      // Salvar token no localStorage
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('adminToken', response.data.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  },

  /**
   * Logout do administrador
   */
  logout: () => {
    localStorage.removeItem('adminToken');
  },

  /**
   * Verificar se está logado
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },

  /**
   * Testar token (DEBUG)
   */
  testToken: async () => {
    try {
      const response = await api.get('/api/admin/test-token');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao testar token');
    }
  },

  /**
   * Dashboard com estatísticas
   */
  getDashboard: async () => {
    try {
      const response = await api.get('/api/admin/dashboard');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar dashboard');
    }
  },

  // ==================
  // PRODUTOS ADMIN
  // ==================

  /**
   * Listar todos os produtos (admin)
   */
  getAdminProducts: async () => {
    try {
      const response = await api.get('/api/admin/products');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar produtos');
    }
  },

  /**
   * Criar produto
   */
  createProduct: async (productData) => {
    try {
      const response = await api.post('/api/admin/products', productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar produto');
    }
  },

  /**
   * Atualizar produto
   */
  updateProduct: async (id, productData) => {
    try {
      // DEBUG: Verificar token antes da requisição
      const token = localStorage.getItem('adminToken');
      console.log('🔧 [UPDATE PRODUCT] Token check:', {
        hasToken: !!token,
        tokenPreview: token && token !== 'null' ? `${token.substring(0, 20)}...` : 'Inválido',
        productId: id
      });

      // Se não há token válido, redirecionar para login
      if (!token || token === 'null' || token === 'undefined') {
        console.error('🚨 [UPDATE PRODUCT] Token inválido, redirecionando para login');
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        throw new Error('Token inválido. Faça login novamente.');
      }

      const response = await api.put(`/api/admin/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar produto');
    }
  },

  /**
   * Deletar produto
   */
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/api/admin/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar produto');
    }
  },

  // ================
  // LOJAS ADMIN
  // ================

  /**
   * Listar todas as lojas (admin)
   */
  getAdminStores: async () => {
    try {
      const response = await api.get('/api/admin/stores');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar lojas');
    }
  },

  /**
   * Criar loja
   */
  createStore: async (storeData) => {
    try {
      const response = await api.post('/api/admin/stores', storeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar loja');
    }
  },

  /**
   * Atualizar loja
   */
  updateStore: async (id, storeData) => {
    try {
      const response = await api.put(`/api/admin/stores/${id}`, storeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar loja');
    }
  },

  /**
   * Deletar loja
   */
  deleteStore: async (id) => {
    try {
      const response = await api.delete(`/api/admin/stores/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar loja');
    }
  },

  // ================
  // RELATÓRIOS
  // ================

  /**
   * Relatório de cliques
   */
  getClicksReport: async () => {
    try {
      const response = await api.get('/api/admin/reports/clicks');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar relatório');
    }
  },
};

export default api;