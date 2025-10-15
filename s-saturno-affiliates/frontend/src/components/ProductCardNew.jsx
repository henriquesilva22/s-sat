import { Star, Truck, Shield, Heart } from 'lucide-react'
import { cn } from '../utils/cn'

const ProductCard = ({ product }) => {
  // Calcular rating se não existir
  const rating = product.rating || Math.floor(Math.random() * 2) + 4 // 4-5 estrelas
  const reviews = product.reviews || Math.floor(Math.random() * 500) + 50
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 overflow-hidden group">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <button className="bg-white/90 hover:bg-white rounded-full p-2 transition-colors">
            <Heart size={20} className="text-gray-600 hover:text-red-500" />
          </button>
        </div>
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-success text-white px-2 py-1 rounded text-sm font-medium">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Price and Discount */}
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              R$ {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-success bg-success/10 px-2 py-1 rounded">
                {discountPercent}% OFF
              </span>
            )}
          </div>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              R$ {typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.originalPrice}
            </span>
          )}
        </div>

        {/* Installments */}
        <p className="text-green-600 text-sm mb-2">
          em 12x de R$ {(parseFloat(product.price) / 12).toFixed(2)} sem juros
        </p>

        {/* Product Name */}
        <h3 className="text-gray-800 font-medium mb-2 line-clamp-2 hover:text-primary-600 transition-colors cursor-pointer leading-tight">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={cn(
                  star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                )}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({reviews})</span>
        </div>

        {/* Store */}
        {product.store && (
          <p className="text-sm text-gray-600 mb-2">
            por <span className="text-primary-600 font-medium">{product.store.name}</span>
          </p>
        )}

        {/* Features */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-1 text-sm text-green-600">
            <Truck size={16} />
            <span>Frete grátis</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-blue-600">
            <Shield size={16} />
            <span>Compra garantida</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 transform hover:scale-[1.02]">
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  )
}

export default ProductCard