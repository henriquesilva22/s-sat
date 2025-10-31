import React, { useState, useEffect } from 'react';
import { Store, ChevronDown, ChevronUp } from 'lucide-react';
import './FloatingStoreFilter.css';
import { storesAPI } from '../services/api';

// Import mock data as fallback
const mockStores = [
  { id: 1, name: 'AliExpress', description: 'Produtos da China', logoUrl: null },
  { id: 2, name: 'Amazon Brasil', description: 'Loja online brasileira', logoUrl: null },
  { id: 3, name: 'Mercado Livre', description: 'Marketplace brasileiro', logoUrl: null }
];

const FloatingStoreFilter = ({ onStoreFilter, stores: storesProp = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stores, setStores] = useState(storesProp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch stores from API
  useEffect(() => {
    // Se já recebemos stores via props e elas têm dados, usar elas
    if (storesProp && Array.isArray(storesProp) && storesProp.length > 0) {
      console.log('📦 [FloatingStoreFilter] Usando stores via props:', storesProp.length);
      setStores(storesProp);
      setLoading(false);
      setError(null);
      return;
    }

    // Se não temos stores via props, tentar buscar da API
    console.log('🌐 [FloatingStoreFilter] Buscando stores da API...');
    const fetchStores = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await storesAPI.getStores();
        const storesData = data.data || [];
        console.log('✅ [FloatingStoreFilter] Stores carregadas da API:', storesData.length);
        setStores(storesData);
      } catch (err) {
        console.warn('❌ [FloatingStoreFilter] Erro ao carregar lojas:', err.message || err);
        // Se falhar a API e não temos stores via props, usar dados mockados
        if (!storesProp || storesProp.length === 0) {
          console.log('🔧 [FloatingStoreFilter] Usando dados mockados como fallback');
          setStores(mockStores);
          setError(null); // Limpar erro pois temos dados mockados
        } else {
          setError('Não foi possível carregar as lojas no momento. Tente novamente mais tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [storesProp]);

  const handleStoreClick = (store) => {
    if (onStoreFilter) {
      onStoreFilter([store.id]);
    }
    setIsOpen(false);
  };

  const clearFilter = () => {
    if (onStoreFilter) {
      onStoreFilter([]);
    }
    setIsOpen(false);
  };

  return (
    <div className="floating-store-filter">
      <button 
        className="store-filter-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Store size={20} />
        <span>Filtro Lojas</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="store-dropdown">
          <div className="store-dropdown-header">
            <h3>Selecione uma Loja</h3>
            <button 
              className="clear-filter-btn"
              onClick={clearFilter}
            >
              Limpar Filtro
            </button>
          </div>
          
          <div className="store-list">
            {loading ? (
              <div className="store-loading">Carregando lojas...</div>
            ) : error ? (
              <div className="store-error">
                <div>{error}</div>
                <button className="retry-btn" onClick={() => {
                  setError(null);
                  setLoading(true);
                  // re-fetch
                  storesAPI.getStores().then(d => {
                    setStores(d.data || []);
                  }).catch(e => {
                    setError('Não foi possível carregar as lojas no momento. Tente novamente mais tarde.');
                  }).finally(() => setLoading(false));
                }}>Tentar novamente</button>
              </div>
            ) : stores.length > 0 ? (
              stores.map((store) => (
                <button
                  key={store.id}
                  className="store-item"
                  onClick={() => handleStoreClick(store)}
                >
                  <div className="store-info">
                    {store.logoUrl && (
                      <img 
                        src={store.logoUrl} 
                        alt={store.name}
                        className="store-logo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="store-details">
                      <span className="store-name">{store.name}</span>
                      {store.description && (
                        <span className="store-description">{store.description}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="no-stores">Nenhuma loja encontrada</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingStoreFilter;