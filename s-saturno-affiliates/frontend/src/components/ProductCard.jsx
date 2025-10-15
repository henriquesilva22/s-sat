import React from 'react';
import { ExternalLink, Eye } from 'lucide-react';
import { formatPrice, truncateText, extractDomain } from '../utils/helpers';
import { productsAPI } from '../services/api';

/**
 * Componente ProductCard - Card de produto estilo Mercado Livre
 * Props:
 * - product: objeto com dados do produto
 * - onClick: função chamada ao clicar no produto (opcional)
 * - className: classes CSS adicionais (opcional)
 */
const ProductCard = ({ product, onClick, className = '' }) => {
  /**
   * Lidar com clique no botão "Ir ao Produto"
   */
  const handleProductClick = async (e) => {
    e.stopPropagation(); // Evitar propagação do evento
    
    try {
      // Registrar o clique para analytics
      await productsAPI.trackClick(product.id);
      
      // Abrir URL de afiliado em nova aba
      window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Erro ao registrar clique:', error);
      // Mesmo com erro, ainda abrir o link
      window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
    }
  };

  /**
   * Lidar com clique no card (para visualização)
   */
  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  /**
   * Lidar com erro no carregamento da imagem
   */
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/250x250/e5e7eb/9ca3af?text=Sem+Imagem';
  };

  return (
    <div 
      className={`card-hover p-4 cursor-pointer group animate-fade-in ${className}`}
      onClick={handleCardClick}
    >
      {/* Imagem do produto */}
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <img
          src={product.imageUrl?.replace('http://localhost:3001', '') || product.imageUrl}
          alt={product.title}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Badge da loja */}
        {product.store && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
            {product.store.name}
          </div>
        )}
        
        {/* Badge de cliques (apenas se houver) */}
        {product.clicks > 0 && (
          <div className="absolute top-2 right-2 bg-saturno-500/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-white shadow-sm flex items-center gap-1">
            <Eye size={12} />
            {product.clicks}
          </div>
        )}
      </div>

      {/* Informações do produto */}
      <div className="space-y-2">
        {/* Título */}
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight text-truncate-2 min-h-[2.5rem] group-hover:text-saturno-600 transition-colors">
          {product.title}
        </h3>

        {/* Preço */}
        <div className="flex items-center justify-between">
          <span className="text-lg sm:text-xl font-bold text-green-600">
            {formatPrice(product.price)}
          </span>
          
          {/* Domínio da loja */}
          {product.affiliateUrl && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {extractDomain(product.affiliateUrl)}
            </span>
          )}
        </div>

        {/* Descrição */}
        {product.description && (
          <p className="text-sm text-gray-600 text-truncate-2 leading-relaxed">
            {truncateText(product.description, 120)}
          </p>
        )}

        {/* Tags */}
        {product.tags && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.split(',').slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-block bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full font-medium"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Botão de ação */}
        <button
          onClick={handleProductClick}
          className="w-full btn-primary mt-3 py-3 font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 group-hover:bg-primary-600"
          aria-label={`Ir para produto ${product.title}`}
        >
          <span>Ir ao Produto</span>
          <ExternalLink size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Informações adicionais no hover */}
      <div className="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Estoque: {product.stock || 'N/A'}</span>
          {product.createdAt && (
            <span>Adicionado em {new Date(product.createdAt).toLocaleDateString('pt-BR')}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;