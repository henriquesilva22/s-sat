import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

/**
 * Hook para gerenciar autenticação do admin
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  /**
   * Verificar se está autenticado
   */
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      setUser({ role: 'admin' });
    }
    setLoading(false);
  }, []);

  /**
   * Login
   */
  const login = async (password) => {
    try {
      const response = await adminAPI.login(password);
      
      if (response.success) {
        setIsAuthenticated(true);
        setUser({ role: 'admin' });
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    adminAPI.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    loading,
    user,
    login,
    logout
  };
};

/**
 * Hook para gerenciar dados administrativos
 */
export const useAdmin = () => {
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Carregar dashboard
   */
  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminAPI.getDashboard();
      if (response.success) {
        setDashboard(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carregar produtos administrativos
   */
  const fetchAdminProducts = async () => {
    try {
      const response = await adminAPI.getAdminProducts();
      if (response.success) {
        setProducts(response.data || []);
      }
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Carregar lojas administrativas
   */
  const fetchAdminStores = async () => {
    try {
      const response = await adminAPI.getAdminStores();
      if (response.success) {
        setStores(response.data || []);
      }
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Criar produto
   */
  const createProduct = async (productData) => {
    try {
      const response = await adminAPI.createProduct(productData);
      if (response.success) {
        await fetchAdminProducts(); // Recarregar lista
      }
      return response;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Atualizar produto
   */
  const updateProduct = async (id, productData) => {
    try {
      const response = await adminAPI.updateProduct(id, productData);
      if (response.success) {
        await fetchAdminProducts(); // Recarregar lista
      }
      return response;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Deletar produto
   */
  const deleteProduct = async (id) => {
    try {
      const response = await adminAPI.deleteProduct(id);
      if (response.success) {
        await fetchAdminProducts(); // Recarregar lista
      }
      return response;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Criar loja
   */
  const createStore = async (storeData) => {
    try {
      const response = await adminAPI.createStore(storeData);
      if (response.success) {
        await fetchAdminStores(); // Recarregar lista
      }
      return response;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Atualizar loja
   */
  const updateStore = async (id, storeData) => {
    try {
      const response = await adminAPI.updateStore(id, storeData);
      if (response.success) {
        await fetchAdminStores(); // Recarregar lista
      }
      return response;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Deletar loja
   */
  const deleteStore = async (id) => {
    try {
      const response = await adminAPI.deleteStore(id);
      if (response.success) {
        await fetchAdminStores(); // Recarregar lista
      }
      return response;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Carregar relatório de cliques
   */
  const fetchClicksReport = async () => {
    try {
      const response = await adminAPI.getClicksReport();
      return response;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    // Dados
    dashboard,
    products,
    stores,
    loading,
    error,

    // Funções
    fetchDashboard,
    fetchAdminProducts,
    fetchAdminStores,
    createProduct,
    updateProduct,
    deleteProduct,
    createStore,
    updateStore,
    deleteStore,
    fetchClicksReport,

    // Estados derivados
    hasProducts: products.length > 0,
    hasStores: stores.length > 0
  };
};