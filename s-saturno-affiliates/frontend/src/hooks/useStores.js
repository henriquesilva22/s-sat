import { useState, useEffect } from 'react';
import { storesAPI } from '../services/api';

/**
 * Hook customizado para gerenciar lojas
 * Fornece funcionalidades para listar e buscar lojas
 */
export const useStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Buscar todas as lojas
   */
  const fetchStores = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await storesAPI.getStores();
      
      if (response.success) {
        setStores(response.data || []);
      } else {
        setError(response.message || 'Erro ao carregar lojas');
      }
    } catch (err) {
      setError(err.message);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Buscar loja específica
   */
  const getStore = async (id) => {
    try {
      const response = await storesAPI.getStore(id);
      return response.success ? response.data : null;
    } catch (err) {
      console.error('Erro ao buscar loja:', err);
      return null;
    }
  };

  /**
   * Recarregar lojas
   */
  const refetch = () => {
    fetchStores();
  };

  // Buscar lojas ao montar o componente
  useEffect(() => {
    fetchStores();
  }, []);

  return {
    // Dados
    stores,
    loading,
    error,

    // Funções
    getStore,
    refetch,

    // Estados derivados
    hasStores: stores.length > 0,
    isEmpty: !loading && stores.length === 0,
    hasError: !!error
  };
};