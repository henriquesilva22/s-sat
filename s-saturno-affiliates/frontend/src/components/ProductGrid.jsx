import React from 'react';
import { Package } from 'lucide-react';
import ProductCard from './ProductCard';

/**
 * Componente ProductGrid - Grade de produtos responsiva
 * Props:
 * - products: array de produtos
 * - loading: boolean indicando carregamento
 * - error: string com mensagem de erro
 * - emptyMessage: mensagem quando não há produtos
 * - onProductClick: função chamada ao clicar em um produto
 * - className: classes CSS adicionais
 */
const ProductGrid = ({ 
  products = [], 
  loading = false, 
  error = null, 
  emptyMessage = 'Nenhum produto encontrado',
  onProductClick,
  className = ''
}) => {

  // Estado de carregamento
  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Skeletons de carregamento */}
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="card p-4 animate-pulse">
              {/* Skeleton da imagem */}
              <div className="bg-gray-300 rounded-lg h-48 sm:h-56 mb-4"></div>
              
              {/* Skeleton do título */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
              
              {/* Skeleton do preço */}
              <div className="mt-3">
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
              </div>
              
              {/* Skeleton da descrição */}
              <div className="mt-3 space-y-2">
                <div className="h-3 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
              </div>
              
              {/* Skeleton do botão */}
              <div className="mt-4">
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <Package className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-red-900 mb-2">
              Erro ao carregar produtos
            </h3>
            <p className="text-red-700 text-sm">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 btn-primary"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Estado vazio
  if (!products || products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {emptyMessage}
          </h3>
          <p className="text-gray-500 mb-6">
            Tente ajustar os filtros de busca ou volte mais tarde para ver novos produtos.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="btn-secondary"
          >
            Ver Todos os Produtos
          </button>
        </div>
      </div>
    );
  }

  // Grade de produtos
  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product, index) => (
          <div 
            key={product.id || index}
            className="animate-slide-up"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'both'
            }}
          >
            <ProductCard 
              product={product} 
              onClick={onProductClick}
            />
          </div>
        ))}
      </div>
      
      {/* Informação sobre o total de produtos */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Mostrando {products.length} produto{products.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default ProductGrid;