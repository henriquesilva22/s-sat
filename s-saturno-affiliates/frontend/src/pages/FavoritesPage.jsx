import React from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import HeaderML from '../components/HeaderML';
import FooterML from '../components/FooterML';
import ProductCardML from '../components/ProductCardML';
import FloatingFavoritesButton from '../components/FloatingFavoritesButton';
import { Heart, ShoppingBag } from 'lucide-react';

const FavoritesPage = () => {
  const { favorites, clearFavorites } = useFavorites();

  const handleSearch = () => {
    // Função vazia para o header
  };

  const handleCategorySearch = () => {
    // Função vazia para o header
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderML onSearch={handleSearch} onCategoryFilter={handleCategorySearch} showBackButton={true} />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header da página */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Heart className="text-red-500" size={32} />
                <h1 className="text-3xl font-bold text-gray-900">Meus Favoritos</h1>
              </div>
            </div>

            {/* Estado vazio */}
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Heart className="mx-auto text-gray-300 mb-4" size={80} />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Nenhum favorito ainda
                </h2>
                <p className="text-gray-600 mb-6">
                  Explore nossos produtos e adicione seus favoritos clicando no ícone de coração.
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ShoppingBag size={20} />
                  Explorar Produtos
                </button>
              </div>
            </div>
          </div>
        </main>

        <FooterML />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderML onSearch={handleSearch} onCategoryFilter={handleCategorySearch} showBackButton={true} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header da página */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Heart className="text-red-500" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">Meus Favoritos</h1>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {favorites.length} {favorites.length === 1 ? 'item' : 'itens'}
              </span>
            </div>
            
            <button
              onClick={clearFavorites}
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Limpar Favoritos
            </button>
          </div>

          {/* Grid de produtos favoritos */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favorites.map((product) => (
              <ProductCardML key={product.id} product={product} />
            ))}
          </div>

          {/* Estatísticas */}
          <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo dos Favoritos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{favorites.length}</div>
                <div className="text-sm text-gray-600">Total de Favoritos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(favorites.map(p => p.storeId)).size}
                </div>
                <div className="text-sm text-gray-600">Lojas Diferentes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  R$ {favorites.reduce((acc, p) => acc + (p.price || 0), 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Valor Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(favorites.flatMap(p => p.categories?.map(c => c.category?.name) || [])).size}
                </div>
                <div className="text-sm text-gray-600">Categorias</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterML />
      <FloatingFavoritesButton />
    </div>
  );
};

export default FavoritesPage;