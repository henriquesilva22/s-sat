import React, { useState, useEffect } from 'react';
import { Store, ChevronDown, ChevronUp } from 'lucide-react';
import './FloatingStoreFilter.css';
import { storesAPI } from '../services/api';

const FloatingStoreFilter = ({ onStoreFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch stores from API
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await storesAPI.getStores();
        setStores(data.data || []);
      } catch (err) {
        // Friendly error handling for UI
        console.warn('Erro ao carregar lojas:', err.message || err);
        setError('Não foi possível carregar as lojas no momento. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

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