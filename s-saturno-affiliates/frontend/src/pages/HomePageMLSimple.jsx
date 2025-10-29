import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { productsAPI } from '../services/api'

// Components
import HeaderML from '../components/HeaderML'
import FooterML from '../components/FooterML'
import ProductCardML from '../components/ProductCardML'
import FloatingFavoritesButton from '../components/FloatingFavoritesButton'
import { ProductGridSkeleton } from '../components/SkeletonLoader'

const HomePageMLSimple = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 [HomePageMLSimple] Buscando produtos via productsAPI...')
        const data = await productsAPI.getProducts()
        console.log('📋 [HomePageMLSimple] Dados:', data)
        if (data && data.success && data.data) {
          setProducts(data.data)
        } else {
          throw new Error(data?.message || 'Dados inválidos')
        }
      } catch (err) {
        console.error('❌ [HomePageMLSimple] Erro:', err)
        setError(err.message || String(err))
        toast.error(`Erro: ${err.message || String(err)}`)
      } finally {
        setLoading(false)
        console.log('🏁 [HomePageMLSimple] Loading finalizado')
      }
    }

    fetchProducts()
  }, [])

  console.log('🎯 [HomePageMLSimple] Renderização:', { loading, error, productsCount: products.length })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderML />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Produtos ({products.length})
          </h1>
          <p className="text-gray-600">
            {loading ? 'Carregando...' : error ? `Erro: ${error}` : `${products.length} produtos encontrados`}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <ProductGridSkeleton count={12} />
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-bold text-red-800 mb-2">
              Erro ao carregar produtos
            </h3>
            <p className="text-red-600 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Tentar novamente
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Nenhum produto encontrado
            </h3>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCardML key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <FooterML />
      
      {/* Floating Favorites Button */}
      <FloatingFavoritesButton />
    </div>
  )
}

export default HomePageMLSimple