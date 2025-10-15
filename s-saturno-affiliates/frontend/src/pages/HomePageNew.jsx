import { useState, useEffect } from 'react'
import { Filter } from 'lucide-react'
import HeaderSimple from '../components/HeaderSimple'
import ProductCardNew from '../components/ProductCardNew'
import FilterSidebar from '../components/FilterSidebar'
import { ProductGridSkeleton } from '../components/LoadingSkeleton'
import ToastProvider from '../components/ToastProvider'
import toast from 'react-hot-toast'

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])

  // Mock data para demonstração
  const mockProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB - Titânio Natural',
      price: 8999.00,
      originalPrice: 9999.00,
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop',
      rating: 5,
      reviews: 1250,
      store: { id: 1, name: 'Apple Store' }
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra 512GB',
      price: 7500.00,
      originalPrice: 8200.00,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      rating: 4,
      reviews: 980,
      store: { id: 2, name: 'Samsung Official' }
    },
    {
      id: 3,
      name: 'MacBook Air M3 13" 256GB',
      price: 12999.00,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      rating: 5,
      reviews: 750,
      store: { id: 1, name: 'Apple Store' }
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5 Fone de Ouvido',
      price: 1899.00,
      originalPrice: 2299.00,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      rating: 4,
      reviews: 425,
      store: { id: 3, name: 'Sony Brasil' }
    },
    {
      id: 5,
      name: 'Nintendo Switch OLED',
      price: 2499.00,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop',
      rating: 5,
      reviews: 890,
      store: { id: 4, name: 'Nintendo Store' }
    },
    {
      id: 6,
      name: 'iPad Pro M4 11" 128GB',
      price: 8999.00,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
      rating: 4,
      reviews: 320,
      store: { id: 1, name: 'Apple Store' }
    }
  ]

  const mockStores = [
    { id: 1, name: 'Apple Store' },
    { id: 2, name: 'Samsung Official' },
    { id: 3, name: 'Sony Brasil' },
    { id: 4, name: 'Nintendo Store' }
  ]

  const handleSearch = (term) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      if (term) {
        toast.success(`Buscando por "${term}"`)
      }
    }, 1000)
  }

  const handleStoreFilter = (storeIds) => {
    toast.success(`Filtro de lojas aplicado`)
  }

  const handleCategoryFilter = (categoryIds) => {
    setSelectedCategories(categoryIds)
    if (categoryIds.length > 0) {
      toast.success(`${categoryIds.length} categoria(s) selecionada(s)`)
    }
  }

  const handlePriceFilter = (range) => {
    if (range.min || range.max) {
      toast.success(`Filtro de preço: R$ ${range.min || 0} - R$ ${range.max || '∞'}`)
    }
  }

  // Carregar categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/admin/categories')
        if (response.ok) {
          const result = await response.json()
          setCategories(result.data || [])
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
      }
    }
    
    fetchCategories()
    setProducts(mockProducts) // Para demonstração
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastProvider />
      
      {/* Header */}
      <HeaderSimple 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <FilterSidebar 
            stores={mockStores}
            categories={categories}
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            onStoreFilter={handleStoreFilter}
            onCategoryFilter={handleCategoryFilter}
            onPriceFilter={handlePriceFilter}
          />

          {/* Products Area */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                <Filter size={20} />
                Filtros
              </button>
            </div>

            {/* Products Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos os produtos'}
                </h1>
                <p className="text-gray-600">
                  {mockProducts.length} produtos encontrados
                </p>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <ProductGridSkeleton count={6} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products
                  .filter(product => {
                    // Filtrar por categoria se selecionada
                    if (selectedCategories.length === 0) return true
                                        return product.categories?.some(cat => selectedCategories.includes(cat.category.id))
                  })
                  .map((product) => (
                    <ProductCardNew key={product.id} product={product} />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage