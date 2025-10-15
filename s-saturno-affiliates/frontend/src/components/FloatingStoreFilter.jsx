import React, { useState, useEffect } from 'react';
import { Store, ChevronDown, ChevronUp } from 'lucide-react';
import './FloatingStoreFilter.css';

const FloatingStoreFilter = ({ onStoreFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch stores from API
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/stores');
        if (response.ok) {
          const data = await response.json();
          setStores(data.data || []);
        }
      } catch (error) {
        console.error('Erro ao carregar lojas:', error);
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