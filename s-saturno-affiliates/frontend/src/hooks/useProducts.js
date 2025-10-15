import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

/**
 * Hook customizado para gerenciar produtos
 * Fornece funcionalidades de busca, filtros e paginação
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 12,
    hasNext: false,
    hasPrev: false
  });

  // Filtros
  const [filters, setFilters] = useState({
    searchTerm: '',
    storeId: null,
    page: 1,
    perPage: 12
  });

  /**
   * Buscar produtos com filtros
   */
  const fetchProducts = async (customFilters = {}) => {
    console.log('🔄 [useProducts] Iniciando busca de produtos...');
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        ...filters,
        ...customFilters
      };

      // Mapear parâmetros para API e remover vazios
      const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          // Mapear searchTerm para q (esperado pela API)
          if (key === 'searchTerm') {
            acc['q'] = value;
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {});

      console.log('📝 [useProducts] Parâmetros da busca:', cleanParams);
      
      const response = await productsAPI.getProducts(cleanParams);
      
      console.log('📊 [useProducts] Resposta da API:', response);
      
      if (response.success) {
        console.log('✅ [useProducts] Produtos carregados:', response.data?.length || 0);
        setProducts(response.data || []);
        setPagination(response.pagination || pagination);
      } else {
        console.error('❌ [useProducts] Erro na resposta:', response.message);
        setError(response.message || 'Erro ao carregar produtos');
      }
    } catch (err) {
      console.error('💥 [useProducts] Erro na requisição:', err.message);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualizar filtros e buscar
   */
  const updateFilters = (newFilters) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
      // Resetar página ao mudar filtros
      page: newFilters.page !== undefined ? newFilters.page : 1
    };
    
    setFilters(updatedFilters);
  };

  /**
   * Buscar produto específico
   */
  const getProduct = async (id) => {
    try {
      const response = await productsAPI.getProduct(id);
      return response.success ? response.data : null;
    } catch (err) {
      console.error('Erro ao buscar produto:', err);
      return null;
    }
  };

  /**
   * Registrar clique em produto
   */
  const trackProductClick = async (productId) => {
    try {
      return await productsAPI.trackClick(productId);
    } catch (err) {
      console.error('Erro ao registrar clique:', err);
      return null;
    }
  };

  /**
   * Ir para próxima página
   */
  const nextPage = () => {
    if (pagination.hasNext) {
      updateFilters({ page: pagination.currentPage + 1 });
    }
  };

  /**
   * Ir para página anterior
   */
  const previousPage = () => {
    if (pagination.hasPrev) {
      updateFilters({ page: pagination.currentPage - 1 });
    }
  };

  /**
   * Ir para página específica
   */
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      updateFilters({ page });
    }
  };

  /**
   * Limpar filtros
   */
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      storeId: null,
      page: 1,
      perPage: 12
    });
  };

  /**
   * Recarregar produtos
   */
  const refetch = () => {
    fetchProducts();
  };

  // Buscar produtos quando filtros mudarem
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  return {
    // Dados
    products,
    loading,
    error,
    pagination,
    filters,

    // Funções
    updateFilters,
    getProduct,
    trackProductClick,
    nextPage,
    previousPage,
    goToPage,
    clearFilters,
    refetch,

    // Estados derivados
    hasProducts: products.length > 0,
    isEmpty: !loading && products.length === 0,
    hasError: !!error
  };
};