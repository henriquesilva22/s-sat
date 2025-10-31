import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, X, Store, Grid, List, LogOut, Settings, BarChart3, Package, ShoppingBag } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Função helper para debounce
 */
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

/**
 * Componente Header - Cabeçalho responsivo com busca e filtros
 * 
 * @param {Object} props
 * @param {string} props.searchTerm - Termo de busca atual
 * @param {Function} props.onSearchChange - Callback para mudança de busca
 * @param {Array} props.stores - Array de lojas para filtro
 * @param {number|null} props.selectedStore - ID da loja selecionada
 * @param {Function} props.onStoreChange - Callback para mudança de loja
 * @param {string} props.viewMode - Modo de visualização ('grid' | 'list')
 * @param {Function} props.onViewModeChange - Callback para mudar visualização
 * @param {boolean} props.isAdmin - Se está na área administrativa
 * @param {string} props.className - Classes CSS adicionais
 */
const Header = ({
  searchTerm = '',
  onSearchChange,
  stores = [],
  selectedStore = null,
  onStoreChange,
  viewMode = 'grid',
  onViewModeChange,
  isAdmin = false,
  className = ''
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const navigate = useNavigate();
  const location = useLocation();

  // Sincroniza o termo local com o prop
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Debounce otimizado para busca
  const debouncedSearch = useMemo(
    () => debounce((term) => {
      if (onSearchChange) {
        onSearchChange(term);
      }
    }, 300),
    [onSearchChange]
  );

  /**
   * Lidar com mudança no campo de busca
   */
  const handleSearchInputChange = useCallback((e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  /**
   * Limpar busca
   */
  const clearSearch = useCallback(() => {
    setLocalSearchTerm('');
    debouncedSearch('');
  }, [debouncedSearch]);

  /**
   * Lidar com mudança de loja
   */
  const handleStoreChange = useCallback((storeId) => {
    if (onStoreChange) {
      onStoreChange(storeId === 'all' ? null : parseInt(storeId));
    }
    setShowFilters(false);
  }, [onStoreChange]);

  /**
   * Limpar todos os filtros
   */
  const clearAllFilters = useCallback(() => {
    setLocalSearchTerm('');
    debouncedSearch('');
    if (onStoreChange) onStoreChange(null);
    setShowFilters(false);
  }, [debouncedSearch, onStoreChange]);

  /**
   * Navegar para a página inicial
   */
  const handleLogoClick = useCallback(() => {
    navigate(isAdmin ? '/admin' : '/');
  }, [navigate, isAdmin]);

  /**
   * Fazer logout da área admin
   */
  const handleAdminLogout = useCallback(() => {
    if (window.confirm('Tem certeza que deseja sair da área administrativa?')) {
      localStorage.removeItem('adminToken');
      navigate('/');
    }
  }, [navigate]);

  /**
   * Alternar modo de visualização
   */
  const handleViewModeChange = useCallback((mode) => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  }, [onViewModeChange]);

  /**
   * Lidar com key events no search
   */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      clearSearch();
    }
  }, [clearSearch]);

  // Memoize a loja selecionada para performance
  const selectedStoreData = useMemo(() => 
    stores.find(store => store.id === selectedStore),
    [stores, selectedStore]
  );

  // Contadores de filtros ativos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (localSearchTerm) count++;
    if (selectedStore) count++;
    return count;
  }, [localSearchTerm, selectedStore]);

  return (
    <header 
      className={`
        bg-white border-b shadow-sm relative
        ${className}
      `}
      style={{ position: 'static' }}
    >
      <div className="container-responsive py-3 lg:py-4">
        {/* Linha principal do header */}
        <div className="flex items-center justify-between gap-3 lg:gap-4">
          
          {/* Logo e título */}
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 lg:gap-3 hover:opacity-80 transition-opacity group"
              aria-label={isAdmin ? "Ir para dashboard admin" : "Ir para página inicial"}
            >
              <div className="w-12 h-8 lg:w-16 lg:h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img 
                  src="/logo-s-saturno.svg" 
                  alt="S-Saturno Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                  {isAdmin ? 'Admin S-Saturno' : 'S-Saturno Deals'}
                </h1>
                <p className="text-xs text-gray-500">
                  {isAdmin ? 'Gerenciamento completo' : 'Ofertas Imperdíveis'}
                </p>
              </div>
            </button>
          </div>

          {/* Área de busca e controles (apenas se não for admin) */}
          {!isAdmin && (
            <div className="flex items-center gap-2 flex-1 max-w-2xl min-w-0">
              {/* Campo de busca */}
              <div className="relative flex-1 min-w-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={localSearchTerm}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar produtos, marcas, categorias..."
                  className="border border-gray-300 rounded-lg px-3 py-2 pl-9 lg:pl-10 pr-9 lg:pr-10 w-full text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  aria-label="Campo de busca de produtos"
                />
                {localSearchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Limpar busca"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Botão de filtros (mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 lg:hidden relative border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                aria-label={`${showFilters ? 'Ocultar' : 'Mostrar'} filtros`}
              >
                <Filter className="h-4 w-4 lg:h-5 lg:w-5" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Controles de visualização */}
              {onViewModeChange && (
                <div className="hidden md:flex items-center border border-gray-300 rounded-lg bg-white">
                  <button
                    onClick={() => handleViewModeChange('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-primary-500 text-white shadow-inner' 
                        : 'text-gray-600 hover:bg-gray-50'
                    } rounded-l-lg`}
                    aria-label="Visualização em grade"
                    aria-pressed={viewMode === 'grid'}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleViewModeChange('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-primary-500 text-white shadow-inner' 
                        : 'text-gray-600 hover:bg-gray-50'
                    } rounded-r-lg`}
                    aria-label="Visualização em lista"
                    aria-pressed={viewMode === 'list'}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navegação admin */}
          {isAdmin && (
            <nav className="flex items-center gap-2 lg:gap-4 flex-wrap">
              <button 
                onClick={() => navigate('/admin')}
                className={`nav-admin-btn ${location.pathname === '/admin' ? 'nav-admin-active' : ''}`}
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden lg:inline">Dashboard</span>
              </button>
              
              <button 
                onClick={() => navigate('/admin-dashboard')}
                className={`nav-admin-btn ${location.pathname.includes('/admin-dashboard') ? 'nav-admin-active' : ''}`}
              >
                <Package className="h-4 w-4" />
                <span className="hidden lg:inline">Produtos</span>
              </button>
              
              <button 
                onClick={() => navigate('/admin/stores')}
                className={`nav-admin-btn ${location.pathname.includes('/admin/stores') ? 'nav-admin-active' : ''}`}
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden lg:inline">Lojas</span>
              </button>
              
              <button 
                onClick={() => navigate('/admin/settings')}
                className={`nav-admin-btn ${location.pathname.includes('/admin/settings') ? 'nav-admin-active' : ''}`}
              >
                <Settings className="h-4 w-4" />
                <span className="hidden lg:inline">Config</span>
              </button>
              
              <button 
                onClick={handleAdminLogout}
                className="nav-admin-btn text-red-600 hover:bg-red-50 hover:text-red-700"
                aria-label="Sair do sistema administrativo"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">Sair</span>
              </button>
            </nav>
          )}
        </div>

        {/* Filtros (desktop sempre visível, mobile toggle) */}
        {!isAdmin && (
          <div className={`mt-3 lg:mt-4 transition-all duration-300 ${
            showFilters ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
          } lg:max-h-none lg:opacity-100 overflow-hidden`}>
            <div className="flex flex-wrap items-center gap-2 lg:gap-3 pb-1">
              {/* Filtro por loja */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Store className="h-4 w-4 text-gray-500 flex-shrink-0 dark:text-gray-400" />
                <select
                  value={selectedStore || 'all'}
                  onChange={(e) => handleStoreChange(e.target.value)}
                  className="min-w-[140px] text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  aria-label="Filtrar por loja"
                >
                  <option value="all">Todas as lojas</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name} {store.productCount ? `(${store.productCount})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Indicadores de filtros ativos */}
              <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                {localSearchTerm && (
                  <span 
                    className="filter-chip"
                    role="status"
                    aria-label={`Filtro de busca: ${localSearchTerm}`}
                  >
                    Busca: "{truncateText(localSearchTerm, 20)}"
                    <button 
                      onClick={clearSearch}
                      className="hover:text-primary-900 ml-1 transition-colors"
                      aria-label="Remover filtro de busca"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {selectedStore && selectedStoreData && (
                  <span 
                    className="filter-chip bg-primary-100 text-primary-800"
                    role="status"
                    aria-label={`Filtro de loja: ${selectedStoreData.name}`}
                  >
                    Loja: {selectedStoreData.name}
                    <button 
                      onClick={() => handleStoreChange('all')}
                      className="hover:text-primary-900 ml-1 transition-colors"
                      aria-label="Remover filtro de loja"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {/* Botão limpar tudo */}
                {(localSearchTerm || selectedStore) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors whitespace-nowrap"
                    aria-label="Limpar todos os filtros"
                  >
                    Limpar todos
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Helper function (pode ser movida para utils se necessário)
const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export default Header;