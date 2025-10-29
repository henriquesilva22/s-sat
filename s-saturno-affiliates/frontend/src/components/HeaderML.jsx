import React, { useState, useEffect } from 'react';
import { Search, Heart, ArrowLeft, User, ShoppingCart, Moon, Sun } from 'lucide-react';
import '../styles/futuristic-header.css';
import { useFavorites } from '../contexts/FavoritesContext';
import PromoCarousel from './PromoCarousel';

const HeaderML = ({ onSearch, searchQuery = "", onCategoryFilter, showBackButton = false }) => {
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [isScrolled, setIsScrolled] = useState(false);
  const { favoritesCount } = useFavorites();
  const [isBlackMode, setIsBlackMode] = useState(() => {
    try {
      return localStorage.getItem('bgBlackMode') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Apply persisted preference on mount
  useEffect(() => {
    if (isBlackMode) {
      document.body.classList.add('bg-black-mode');
    } else {
      document.body.classList.remove('bg-black-mode');
    }
    try {
      localStorage.setItem('bgBlackMode', isBlackMode ? 'true' : 'false');
    } catch (e) {
      // ignore
    }
  }, [isBlackMode]);

  // Detectar scroll para sticky header
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Categorias fixas conforme solicitado
  const categories = [
    { id: 1, name: 'Beleza & Saúde' },
    { id: 2, name: 'Eletrônicos' },
    { id: 3, name: 'Casa & Jardim' },
    { id: 4, name: 'Esportes & Lazer' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchInput.trim() !== '') {
      onSearch(searchInput);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  const handleCategoryClick = (e, categoryData) => {
    e.preventDefault();
    if (onCategoryFilter) {
      // Se categoryData tem a estrutura { category: string, type: 'category' }
      if (categoryData.category && categoryData.type === 'category') {
        onCategoryFilter(categoryData.category);
      } 
      // Se categoryData é apenas a string da categoria
      else if (typeof categoryData === 'string') {
        onCategoryFilter(categoryData);
      }
      // Se categoryData tem a estrutura completa
      else {
        onCategoryFilter(categoryData);
      }
    }
  };

  return (
    <header className={`shopee-header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Header Main - Estilo Shopee */}
      <div className="header-main-shopee">
        <div className="logo-shopee">
          <div
            onDoubleClick={() => window.location.href = '/admin'}
            title="Duplo clique para acessar área admin"
            style={{ 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              height: '80px'
            }}
          >
            <img 
              src="/logo-terra-saturno-colisao.svg" 
              alt="S-Saturno - Terra e Saturno" 
              style={{ 
                height: '100px', 
                width: 'auto', 
                maxWidth: '500px',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>

        <div className="promo-message-shopee">
          <span className="promo-text">Bem-vindos - Boas Compras</span>
        </div>
        
        <div className="search-container-shopee">
          <div className="search-box-shopee">
            <button 
              type="button" 
              className="back-btn-shopee"
              onClick={() => window.location.href = '/'}
            >
              <ArrowLeft size={18} />
            </button>
            <input 
              type="text" 
              placeholder="Buscar no S-Saturno" 
              className="search-input-shopee"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              type="submit" 
              className="search-btn-shopee"
              onClick={handleSearchSubmit}
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        <div className="cart-shopee" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            title={isBlackMode ? 'Desativar fundo preto' : 'Ativar fundo preto'}
            onClick={() => setIsBlackMode(v => !v)}
            className="action-btn-shopee"
            style={{ display: 'flex', alignItems: 'center', padding: '0.4rem', borderRadius: '0.5rem' }}
          >
            {isBlackMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="action-btn-shopee cart-btn-shopee">
            <ShoppingCart size={20} />
            <span className="badge">0</span>
          </button>
        </div>
      </div>

      {/* Carrossel Promocional Integrado */}
      <PromoCarousel />
    </header>
  )
}

export default HeaderML