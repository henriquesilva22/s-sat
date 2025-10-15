import React, { useState } from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';

const FuturisticHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const menuItems = [
    { text: 'Início', link: '/' },
    { text: 'Produtos', link: '/produtos' },
    { text: 'Ofertas', link: '/ofertas' },
    { text: 'Novidades', link: '/novidades' },
    { text: 'Suporte', link: '/contato' }
  ];

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      // Implementar lógica de busca aqui
      console.log('Pesquisando por:', searchQuery);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="futuristic-header">
      {/* Header Glow Effect */}
      <div className="header-glow"></div>
      
      {/* Header Top */}
      <div className="header-top">
        <div className="welcome-message">
          <span className="welcome-text">Bem-vindo à S-Saturno</span>
          <span className="sub-text">Boas compras!</span>
        </div>
        <div className="user-actions">
          <button className="icon-btn" id="user-btn" aria-label="Usuário">
            <User size={20} />
          </button>
          <button className="icon-btn" id="cart-btn" aria-label="Carrinho">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </div>
      
      {/* Header Main */}
      <div className="header-main">
        <div className="logo-container">
          <div className="logo">
            <span className="logo-text">S-SATURNO</span>
            <div className="logo-glow"></div>
          </div>
        </div>
        
        <div className="search-container">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Pesquisar produtos..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="search-btn" onClick={handleSearch}>
              <Search size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="navigation">
        <ul className="nav-menu">
          {menuItems.map((item, index) => (
            <li key={index} className="nav-item">
              <a href={item.link} className="nav-link">{item.text}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default FuturisticHeader;