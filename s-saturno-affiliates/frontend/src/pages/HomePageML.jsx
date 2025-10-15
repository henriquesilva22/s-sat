import React, { useState, useEffect, useMemo } from 'react'
import { Filter, Grid, List } from 'lucide-react'
import toast from 'react-hot-toast'

// Components
import HeaderML from '../components/HeaderML'
import FooterML from '../components/FooterML'
import ProductCardML from '../components/ProductCardML'
import FilterSidebarML from '../components/FilterSidebarML'
import FloatingFavoritesButton from '../components/FloatingFavoritesButton'
import FloatingStoreFilter from '../components/FloatingStoreFilter'
import { ProductGridSkeleton } from '../components/SkeletonLoader'

// Contexts
import { useFavorites } from '../contexts/FavoritesContext'

// API service
import { productsAPI, storesAPI } from '../services/api'

// Mock data for demonstration
import { mockProducts, mockStores, mockCategories } from '../data/mockData'

const HomePageML = () => {
  console.log('🚀 [HomePageML] Componente iniciado');
  
  // API URL for logging
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://s-sat.onrender.com');
  
  // States
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Admin access shortcut
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        window.location.href = '/admin';
      }
    };
    
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStores, setSelectedStores] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('relevance')
  
  // UI states
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 [HomePageML] Iniciando carregamento de dados...')
        setLoading(true)
        setError(null)
        
        // Tentar carregar dados da API, mas usar mockados como fallback
        try {
          console.log('🌐 [HomePageML] Conectando com API:', API_BASE_URL)
          
          const [productsData, storesData] = await Promise.all([
            productsAPI.getProducts(),
            storesAPI.getStores()
          ])
          
          if (productsData && productsData.data && Array.isArray(productsData.data)) {
            console.log('✅ [HomePageML] Dados da API carregados:', productsData.data.length, 'produtos')
            setProducts(productsData.data)
            setStores(storesData.data || [])
            
            // Usar categorias do mock por enquanto
            console.log('📂 [HomePageML] Usando categorias mock')
            setCategories(mockCategories)
            
            // Mostrar toast de sucesso
            toast.success('📡 Conectado à API - produtos atualizados!')
          } else {
            throw new Error('API retornou dados inválidos')
          }
        } catch (apiError) {
          console.log('📦 [HomePageML] API indisponível, usando dados de demonstração')
          
          // Usar dados mockados
          setProducts(mockProducts)
          setStores(mockStores)
          setCategories(mockCategories)
          
          // Mostrar toast informativo apenas uma vez
          if (!sessionStorage.getItem('demoDataNotified')) {
            toast.success('🌟 Visualizando dados de demonstração!', {
              duration: 4000,
              position: 'top-center'
            })
            sessionStorage.setItem('demoDataNotified', 'true')
          }
        }
        
        // Sucesso - finalizar loading
        console.log('🎯 [HomePageML] Carregamento finalizado')
        setLoading(false)
        
      } catch (error) {
        console.error('💥 [HomePageML] Erro crítico:', error)
        // Em caso de erro crítico, usar dados mockados como fallback
        setProducts(mockProducts)
        setStores(mockStores)
        setCategories(mockCategories)
        setError(null) // Não mostrar erro se temos dados mockados
        setLoading(false)
        
        toast.success('� Visualizando dados de demonstração!', {
          duration: 4000,
          position: 'top-center'
        })
      }
    }

    fetchData()
  }, [])

  // Filter and search products
  const filteredProducts = useMemo(() => {
    console.log('🔍 [HomePageML] Filtrando produtos:', {
      totalProducts: products.length,
      searchQuery,
      selectedStores: selectedStores.length,
      selectedCategories: selectedCategories.length,
      productsArray: products
    })
    
    // Se não há produtos, retorna array vazio
    if (!products || products.length === 0) {
      console.log('⚠️ [HomePageML] Nenhum produto disponível para filtrar')
      return []
    }
    
    let filtered = [...products]  // Criar cópia para não modificar o array original

    // Search by name/title/categories
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(product => 
        (product.title && product.title.toLowerCase().includes(query)) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.tags && product.tags.toLowerCase().includes(query)) ||
        (product.store && product.store.name && product.store.name.toLowerCase().includes(query)) ||
        (product.categories && product.categories.some(cat => 
          cat && cat.category && cat.category.name && 
          cat.category.name.toLowerCase().includes(query)
        ))
      )
    }

    // Filter by stores
    if (selectedStores.length > 0) {
      filtered = filtered.filter(product => 
        selectedStores.includes(product.storeId)
      )
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        product.categories && product.categories.length > 0 && 
        product.categories.some(cat => 
          cat && cat.category && selectedCategories.includes(cat.category.id)
        )
      )
    }

    // Filter by price range
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(product => {
        const price = product.price
        const min = priceRange.min ? parseFloat(priceRange.min) : 0
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity
        return price >= min && price <= max
      })
    }

    // Sort products
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        // Keep original order (relevance)
        break
    }

    console.log('✅ [HomePageML] Produtos filtrados:', {
      filteredCount: filtered.length,
      firstProduct: filtered[0]?.title || 'N/A'
    })

    return filtered
  }, [products, searchQuery, selectedStores, selectedCategories, priceRange, sortBy])

  // Event handlers
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleStoreFilter = (storeIds) => {
    setSelectedStores(storeIds)
  }

  const handleCategoryFilter = (categoryIds) => {
    setSelectedCategories(categoryIds)
  }

  const handleCategorySearch = (categoryName) => {
    if (categoryName === 'all') {
      // Mostrar todos os produtos (limpar filtros)
      setSearchQuery('');
      setSelectedCategories([]);
      setSelectedStores([]);
      setPriceRange({ min: '', max: '' });
    } else {
      // Buscar por nome da categoria
      setSearchQuery(categoryName);
      // Limpar outros filtros para focar na categoria
      setSelectedCategories([]);
      setSelectedStores([]);
      setPriceRange({ min: '', max: '' });
    }
  }

  const handlePriceFilter = (range) => {
    setPriceRange(range)
  }

  const handleRetry = () => {
    window.location.reload()
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderML onSearch={handleSearch} searchQuery={searchQuery} onCategoryFilter={handleCategorySearch} />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Algo deu errado</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderML onSearch={handleSearch} searchQuery={searchQuery} onCategoryFilter={handleCategorySearch} />
      
      <div className="flex-1 container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="flex gap-3 sm:gap-4 lg:gap-6">
          {/* Filter Sidebar */}
          <FilterSidebarML
            stores={stores}
            categories={categories}
            onStoreFilter={handleStoreFilter}
            onCategoryFilter={handleCategoryFilter}
            onPriceFilter={handlePriceFilter}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-50"
                >
                  <Filter size={20} />
                  <span>Filtros</span>
                </button>
                
                <div>
                  {loading ? (
                    <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                  ) : (
                    <>
                      <h1 className="text-lg font-medium text-gray-900">
                        {searchQuery ? `Resultados para "${searchQuery}"` : 'Todos os produtos'}
                      </h1>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-0 flex-shrink"
                >
                  <option value="relevance">Mais relevantes</option>
                  <option value="price-low">Menor preço</option>
                  <option value="price-high">Maior preço</option>
                  <option value="name">Nome A-Z</option>
                </select>

                {/* View Mode Toggle */}
                <div className="hidden md:flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {(() => {
              console.log('🎯 [HomePageML] Renderização:', {
                loading,
                error,
                productsCount: products.length,
                filteredCount: filteredProducts.length
              })
              return null
            })()}
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
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  Tente ajustar os filtros ou fazer uma nova busca
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedStores([])
                    setSelectedCategories([])
                    setPriceRange({ min: '', max: '' })
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className={`grid gap-3 ${
                viewMode === 'grid'
                  ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5'
                  : 'grid-cols-1 sm:grid-cols-2'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCardML key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <FooterML />
      
      {/* Floating Buttons */}
      <FloatingFavoritesButton />
      <FloatingStoreFilter onStoreFilter={handleStoreFilter} />
    </div>
  )
}

export default HomePageML