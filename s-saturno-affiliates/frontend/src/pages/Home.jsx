import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw, Search, X, Store } from 'lucide-react';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { useStores } from '../hooks/useStores';

/**
 * Página principal do marketplace
 * Exibe produtos com busca, filtros e paginação
 */
const Home = () => {
  const {
    products,
    loading: productsLoading,
    error: productsError,
    pagination,
    filters,
    updateFilters,
    nextPage,
    previousPage,
    goToPage,
    refetch
  } = useProducts();

  const {
    stores,
    loading: storesLoading
  } = useStores();

  const [viewMode, setViewMode] = useState('grid');

  /**
   * Lidar com mudança de busca
   */
  const handleSearchChange = (searchTerm) => {
    updateFilters({ searchTerm });
  };

  /**
   * Lidar com mudança de loja
   */
  const handleStoreChange = (storeId) => {
    updateFilters({ storeId });
  };

  /**
   * Lidar com clique em produto (para futuras funcionalidades)
   */
  const handleProductClick = (product) => {
    // Pode ser usado para modal de detalhes, analytics, etc.
    console.log('Produto clicado:', product);
  };

  /**
   * Carregar mais produtos (pagination)
   */
  const handleLoadMore = () => {
    if (pagination.hasNext && !productsLoading) {
      nextPage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com busca e filtros */}
      <Header
        searchTerm={filters.searchTerm}
        onSearchChange={handleSearchChange}
        stores={stores}
        selectedStore={filters.storeId}
        onStoreChange={handleStoreChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Conteúdo principal */}
      <main className="container-responsive py-6">
        {/* Filtros Ativos */}
        {(filters.searchTerm || filters.storeId) && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700">Filtros aplicados:</span>
                
                {filters.searchTerm && (
                  <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 text-sm px-2 py-1 rounded-full">
                    <Search size={12} />
                    "{filters.searchTerm}"
                    <button 
                      onClick={() => handleSearchChange('')}
                      className="ml-1 hover:bg-primary-200 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                
                {filters.storeId && stores.length > 0 && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                    <Store size={12} />
                    {stores.find(s => s.id === filters.storeId)?.name}
                    <button 
                      onClick={() => handleStoreChange(null)}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
              
              <button
                onClick={() => {
                  handleSearchChange('');
                  handleStoreChange(null);
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Limpar todos
              </button>
            </div>
          </div>
        )}

        {/* Barra de status e controles */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {filters.searchTerm 
                ? `${pagination.totalItems} resultado${pagination.totalItems !== 1 ? 's' : ''} para "${filters.searchTerm}"` 
                : 'Produtos em Destaque'
              }
            </h2>
            
            {/* Loading indicator inline */}
            {productsLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
            )}
          </div>

          {/* Botão de recarregar */}
          <button
            onClick={refetch}
            disabled={productsLoading}
            className="btn-secondary p-2"
            title="Recarregar produtos"
          >
            <RefreshCw className={`h-4 w-4 ${productsLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Informações de resultado */}
        {!productsLoading && pagination.totalItems > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            Mostrando {products.length} de {pagination.totalItems} produtos
            {filters.storeId && stores.length > 0 && (
              <span className="ml-2">
                da loja {stores.find(s => s.id === filters.storeId)?.name}
              </span>
            )}
          </div>
        )}

        {/* Grade de produtos */}
        <ProductGrid
          products={products}
          loading={productsLoading}
          error={productsError}
          emptyMessage={
            filters.searchTerm || filters.storeId
              ? 'Nenhum produto encontrado com os filtros aplicados'
              : 'Nenhum produto disponível no momento'
          }
          onProductClick={handleProductClick}
          className="mb-8"
        />

        {/* Paginação */}
        {!productsLoading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {/* Botão página anterior */}
            <button
              onClick={previousPage}
              disabled={!pagination.hasPrev}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            {/* Números das páginas */}
            <div className="flex items-center gap-1 mx-4">
              {/* Primeira página */}
              {pagination.currentPage > 3 && (
                <>
                  <button
                    onClick={() => goToPage(1)}
                    className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 text-sm hover:bg-gray-50"
                  >
                    1
                  </button>
                  {pagination.currentPage > 4 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                </>
              )}

              {/* Páginas próximas à atual */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const startPage = Math.max(1, pagination.currentPage - 2);
                const page = startPage + i;
                
                if (page > pagination.totalPages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-md text-sm transition-colors ${
                      page === pagination.currentPage
                        ? 'bg-primary-500 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Última página */}
              {pagination.currentPage < pagination.totalPages - 2 && (
                <>
                  {pagination.currentPage < pagination.totalPages - 3 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => goToPage(pagination.totalPages)}
                    className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 text-sm hover:bg-gray-50"
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}
            </div>

            {/* Botão próxima página */}
            <button
              onClick={nextPage}
              disabled={!pagination.hasNext}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        )}

        {/* Informações de paginação */}
        {!productsLoading && pagination.totalPages > 1 && (
          <div className="text-center mt-4 text-sm text-gray-500">
            Página {pagination.currentPage} de {pagination.totalPages}
          </div>
        )}
      </main>

      {/* Footer simples */}
      <footer className="bg-white border-t mt-16">
        <div className="container-responsive py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              S-Saturno Affiliates
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Marketplace com os melhores produtos e ofertas especiais
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span>Total de {pagination.totalItems || 0} produtos</span>
              <span>•</span>
              <a 
                href="/admin/login" 
                className="hover:text-primary-500 transition-colors"
              >
                Área Administrativa
              </a>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-400">
              © 2024 S-Saturno Affiliates. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;