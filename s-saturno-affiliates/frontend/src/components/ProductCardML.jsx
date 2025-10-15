import { Star, Truck, Shield, Heart, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useFavorites } from '../contexts/FavoritesContext'

const ProductCardML = ({ product }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [showMore, setShowMore] = useState(false);
  // Safety checks
  if (!product) {
    return <div className="bg-white rounded-xl shadow-md p-4">Produto não encontrado</div>
  }

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const calculateDiscount = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price || !price) return null
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  const price = product.price || 0
  const discount = calculateDiscount(price, product.originalPrice)
  const installments = 12
  const installmentValue = price / installments

  // Usar valores reais do produto ou não exibir se não existir
  const rating = product.rating || null
  const reviews = product.reviewCount > 0 ? product.reviewCount : null

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 overflow-hidden group h-full flex flex-col">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl?.replace('http://localhost:3001', '') || '/placeholder-image.jpg'}
          alt={product.title || 'Produto'}
          className="w-full h-36 sm:h-40 md:h-44 lg:h-40 xl:h-44 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300/f0f0f0/999999?text=Sem+Imagem'
          }}
        />
        <div className="absolute top-2 right-2">
          <button 
            className="bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
            onClick={() => toggleFavorite(product)}
          >
            <Heart 
              size={20} 
              className={`${
                isFavorite(product.id) 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-600 hover:text-red-500'
              } transition-colors`} 
            />
          </button>
        </div>
        {discount && (
          <div className="absolute top-2 left-2">
            <span className="bg-success-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discount}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-3 lg:p-3 flex-1 flex flex-col">
        {/* Price and Discount */}
        <div className="mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">{formatPrice(price)}</span>
          </div>
          {product.originalPrice && discount && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Installments */}
        <p className="text-success-600 text-xs sm:text-sm mb-1.5">
          em {installments}x de {formatPrice(installmentValue)} sem juros
        </p>

        {/* Product Name */}
        <h3 className="text-gray-800 font-medium mb-1.5 line-clamp-2 hover:text-primary-600 transition-colors cursor-pointer flex-1 text-xs sm:text-sm lg:text-sm">
          {product.title || 'Produto sem título'}
        </h3>

        {/* Rating - Desktop only - Só exibe se tiver rating */}
        {rating && (
          <div className="hidden sm:flex items-center gap-1 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={
                    star <= Math.floor(rating) 
                      ? 'text-warning-500 fill-current' 
                      : star <= rating 
                      ? 'text-warning-500 fill-current opacity-50'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
            {reviews && <span className="text-sm text-gray-600">({reviews})</span>}
          </div>
        )}

        {/* Features - Desktop only - Só exibe se configurado como true */}
        <div className="hidden sm:block space-y-1 mb-4">
          {product.freeShipping === true && (
            <div className="flex items-center gap-1 text-sm text-success-600">
              <Truck size={16} />
              <span>Frete grátis</span>
            </div>
          )}
          {product.warranty === true && (
            <div className="flex items-center gap-1 text-sm text-primary-600">
              <Shield size={16} />
              <span>Garantia do vendedor</span>
            </div>
          )}
        </div>

        {/* Store Info - Desktop only */}
        {product.store && (
          <div className="hidden sm:flex items-center gap-2 mb-3 text-sm text-gray-600">
            {product.store.logoUrl && (
              <img 
                src={product.store.logoUrl?.replace('http://localhost:3001', '') || '/placeholder-store.jpg'} 
                alt={product.store.name}
                className="w-4 h-4 object-contain"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/40x40/f0f0f0/999999?text=Logo'
                }}
              />
            )}
            <span>por {product.store.name}</span>
          </div>
        )}

        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.categories.slice(0, 2).map((cat) => (
              <span 
                key={cat.category.id} 
                className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
              >
                {cat.category.name}
              </span>
            ))}
            {product.categories.length > 2 && (
              <span className="text-xs text-gray-500">+{product.categories.length - 2}</span>
            )}
          </div>
        )}

        {/* Mobile: Show More Section */}
        {showMore && (
          <div className="sm:hidden bg-gray-50 rounded-lg p-3 mb-3 space-y-3">
            {/* Rating Mobile - Só exibe se tiver rating */}
            {rating && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= Math.floor(rating) 
                          ? 'text-warning-500 fill-current' 
                          : star <= rating 
                          ? 'text-warning-500 fill-current opacity-50'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                {reviews && <span className="text-sm text-gray-600">({reviews})</span>}
              </div>
            )}

            {/* Store Details */}
            {product.store && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-700">Loja:</span>
                <div className="flex items-center gap-1">
                  {product.store.logoUrl && (
                    <img 
                      src={product.store.logoUrl?.replace('http://localhost:3001', '') || '/placeholder-store.jpg'} 
                      alt={product.store.name}
                      className="w-4 h-4 object-contain"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/40x40/f0f0f0/999999?text=Logo'
                      }}
                    />
                  )}
                  <span className="text-gray-600">{product.store.name}</span>
                </div>
              </div>
            )}
            
            {/* Features Mobile */}
            <div className="space-y-2">
              {product.freeShipping === true && (
                <div className="flex items-center gap-1 text-sm text-success-600">
                  <Truck size={16} />
                  <span>Frete grátis</span>
                </div>
              )}
              {product.warranty === true && (
                <div className="flex items-center gap-1 text-sm text-primary-600">
                  <Shield size={16} />
                  <span>Garantia do vendedor</span>
                </div>
              )}
              {product.soldCount > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Vendidos:</span> {product.soldCount}+ unidades
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto space-y-2">
          {/* Mobile: Two buttons */}
          <div className="sm:hidden flex gap-2">
            <button 
              onClick={() => window.open(product.affiliateUrl, '_blank')}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
            >
              <span>Ver produto</span>
              <ExternalLink size={16} />
            </button>
            <button 
              onClick={() => setShowMore(!showMore)}
              className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* Desktop: Single button */}
          <button 
            onClick={() => window.open(product.affiliateUrl, '_blank')}
            className="hidden sm:flex w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 transform hover:scale-[1.02] items-center justify-center gap-2"
          >
            <span>Ver produto</span>
            <ExternalLink size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCardML