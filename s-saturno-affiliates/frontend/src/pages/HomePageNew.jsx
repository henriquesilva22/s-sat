import { useState, useEffect } from 'react'
import { Filter } from 'lucide-react'
import { Smartphone, Heart, Shirt, Home, Dumbbell, Car, Package } from 'lucide-react'
import HeaderSimple from '../components/HeaderSimple'
import ProductCardNew from '../components/ProductCardNew'
import FilterSidebar from '../components/FilterSidebar'
import { ProductGridSkeleton } from '../components/LoadingSkeleton'
import ToastProvider from '../components/ToastProvider'
import toast from 'react-hot-toast'
import api from '../services/api'

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
      store: { id: 1, name: 'Apple Store' },
      categories: [{ category: { id: 1, name: 'Eletrônicos', slug: 'eletronicos' } }]
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra 512GB',
      price: 7500.00,
      originalPrice: 8200.00,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      rating: 4,
      reviews: 980,
      store: { id: 2, name: 'Samsung Official' },
      categories: [{ category: { id: 1, name: 'Eletrônicos', slug: 'eletronicos' } }]
    },
    {
      id: 3,
      name: 'MacBook Air M3 13" 256GB',
      price: 12999.00,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      rating: 5,
      reviews: 750,
      store: { id: 1, name: 'Apple Store' },
      categories: [{ category: { id: 1, name: 'Eletrônicos', slug: 'eletronicos' } }]
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5 Fone de Ouvido',
      price: 1899.00,
      originalPrice: 2299.00,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      rating: 4,
      reviews: 425,
      store: { id: 3, name: 'Sony Brasil' },
      categories: [{ category: { id: 1, name: 'Eletrônicos', slug: 'eletronicos' } }]
    },
    {
      id: 5,
      name: 'Nintendo Switch OLED',
      price: 2499.00,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop',
      rating: 5,
      reviews: 890,
      store: { id: 4, name: 'Nintendo Store' },
      categories: [{ category: { id: 1, name: 'Eletrônicos', slug: 'eletronicos' } }]
    },
    {
      id: 6,
      name: 'iPad Pro M4 11" 128GB',
      price: 8999.00,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
      rating: 4,
      reviews: 320,
      store: { id: 1, name: 'Apple Store' },
      categories: [{ category: { id: 1, name: 'Eletrônicos', slug: 'eletronicos' } }]
    },
    {
      id: 7,
      name: 'Baseus Wireless Charger 15W',
      price: 89.90,
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
      rating: 4,
      reviews: 156,
      store: { id: 5, name: 'AliExpress' },
      categories: [{ category: { id: 1, name: 'Eletrônicos', slug: 'eletronicos' } }]
    },
    {
      id: 9,
      name: 'Kit Shampoo + Condicionador Elseve',
      price: 45.90,
      originalPrice: 59.90,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
      rating: 4,
      reviews: 89,
      store: { id: 7, name: 'Drogasil' },
      categories: [{ category: { id: 2, name: 'Beleza & Saúde', slug: 'beleza-saude' } }]
    },
    {
      id: 10,
      name: 'Base Líquida Maybelline Fit Me',
      price: 39.90,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
      rating: 4,
      reviews: 156,
      store: { id: 8, name: 'Sephora' },
      categories: [{ category: { id: 2, name: 'Beleza & Saúde', slug: 'beleza-saude' } }]
    },
    {
      id: 11,
      name: 'Camiseta Básica Algodão Masculina',
      price: 29.90,
      originalPrice: 49.90,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      rating: 4,
      reviews: 234,
      store: { id: 9, name: 'Renner' },
      categories: [{ category: { id: 3, name: 'Roupas & Acessórios', slug: 'roupas-acessorios' } }]
    },
    {
      id: 12,
      name: 'Tênis Nike Air Max 270',
      price: 599.90,
      originalPrice: 799.90,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      rating: 5,
      reviews: 445,
      store: { id: 10, name: 'Nike Store' },
      categories: [{ category: { id: 3, name: 'Roupas & Acessórios', slug: 'roupas-acessorios' } }]
    },
    {
      id: 13,
      name: 'Jogo de Panelas Tramontina 5 Peças',
      price: 189.90,
      originalPrice: 249.90,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      rating: 4,
      reviews: 78,
      store: { id: 11, name: 'Magazine Luiza' },
      categories: [{ category: { id: 4, name: 'Casa & Jardim', slug: 'casa-jardim' } }]
    },
    {
      id: 14,
      name: 'Bola de Futebol Penalty',
      price: 89.90,
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop',
      rating: 4,
      reviews: 167,
      store: { id: 12, name: 'Centauro' },
      categories: [{ category: { id: 5, name: 'Esportes & Lazer', slug: 'esportes-lazer' } }]
    },
    {
      id: 15,
      name: 'Óleo de Motor 5W30 Castrol',
      price: 34.90,
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
      rating: 4,
      reviews: 92,
      store: { id: 13, name: 'AutoZone' },
      categories: [{ category: { id: 6, name: 'Automotivo', slug: 'automotivo' } }]
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

  // Carregar categorias e produtos
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/admin/categories')
        if (response?.data) {
          setCategories(response.data.data || [])
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
      }
    }
    
    fetchCategories()
    setProducts(mockProducts) // Para demonstração
  }, [])

  // Agrupar produtos por categoria
  const productsByCategory = () => {
    const grouped = {}
    
    // Inicializar grupos com categorias disponíveis
    categories.forEach(category => {
      grouped[category.id] = {
        ...category,
        products: []
      }
    })
    
    // Adicionar produtos sem categoria ao grupo "Outros"
    grouped['outros'] = {
      id: 'outros',
      name: 'Outros',
      slug: 'outros',
      products: []
    }
    
    // Agrupar produtos
    products.forEach(product => {
      if (product.categories && product.categories.length > 0) {
        product.categories.forEach(cat => {
          if (grouped[cat.category.id]) {
            grouped[cat.category.id].products.push(product)
          }
        })
      } else {
        grouped['outros'].products.push(product)
      }
    })
    
    // Filtrar apenas categorias que têm produtos e ordenar
    const result = Object.values(grouped).filter(group => group.products.length > 0)
    
    // Ordenação customizada das categorias
    const categoryOrder = {
      'eletronicos': 1,
      'beleza-saude': 2,
      'roupas-acessorios': 3,
      'casa-jardim': 4,
      'esportes-lazer': 5,
      'automotivo': 6,
      'outros': 7
    }
    
    return result.sort((a, b) => {
      const orderA = categoryOrder[a.slug] || 99
      const orderB = categoryOrder[b.slug] || 99
      
      if (orderA !== orderB) {
        return orderA - orderB
      }
      
      // Para categorias na mesma prioridade, ordenar alfabeticamente
      return a.name.localeCompare(b.name)
    })
  }

  const groupedProducts = productsByCategory()

  // Função para obter ícone da categoria
  const getCategoryIcon = (slug) => {
    const iconProps = { size: 20, className: "text-white" }
    
    switch (slug) {
      case 'eletronicos':
        return <Smartphone {...iconProps} />
      case 'beleza-saude':
        return <Heart {...iconProps} />
      case 'roupas-acessorios':
        return <Shirt {...iconProps} />
      case 'casa-jardim':
        return <Home {...iconProps} />
      case 'esportes-lazer':
        return <Dumbbell {...iconProps} />
      case 'automotivo':
        return <Car {...iconProps} />
      default:
        return <Package {...iconProps} />
    }
  }

  // Função para obter cor da categoria
  const getCategoryColor = (slug) => {
    switch (slug) {
      case 'eletronicos':
        return 'bg-blue-500'
      case 'beleza-saude':
        return 'bg-pink-500'
      case 'roupas-acessorios':
        return 'bg-purple-500'
      case 'casa-jardim':
        return 'bg-green-500'
      case 'esportes-lazer':
        return 'bg-orange-500'
      case 'automotivo':
        return 'bg-gray-600'
      default:
        return 'bg-primary-500'
    }
  }

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
                  {searchTerm ? `Resultados para "${searchTerm}"` : 'Produtos por Categoria'}
                </h1>
                <p className="text-gray-600">
                  {mockProducts.length} produtos encontrados em {groupedProducts.length} categorias
                </p>
              </div>
            </div>

            {/* Products by Category */}
            {isLoading ? (
              <ProductGridSkeleton count={6} />
            ) : (
              <div className="space-y-12">
                {groupedProducts.map((categoryGroup) => (
                  <div key={categoryGroup.id} className="category-section bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                      <div className={`p-2 rounded-lg ${getCategoryColor(categoryGroup.slug)}`}>
                        {getCategoryIcon(categoryGroup.slug)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {categoryGroup.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {categoryGroup.products.length} produto{categoryGroup.products.length !== 1 ? 's' : ''} disponível{categoryGroup.products.length !== 1 ? 'is' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Products Grid for this Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categoryGroup.products
                        .filter(product => {
                          // Aplicar filtros de categoria se selecionados
                          if (selectedCategories.length === 0) return true
                          return product.categories?.some(cat => selectedCategories.includes(cat.category.id))
                        })
                        .map((product) => (
                          <ProductCardNew key={`${categoryGroup.id}-${product.id}`} product={product} />
                        ))}
                    </div>
                  </div>
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