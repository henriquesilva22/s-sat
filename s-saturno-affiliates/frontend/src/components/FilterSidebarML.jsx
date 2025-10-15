import React, { useState } from 'react'
import { ChevronDown, ChevronUp, X, Filter } from 'lucide-react'

const FilterSidebar = ({ stores = [], categories = [], onStoreFilter, onCategoryFilter, onPriceFilter, isOpen, onClose }) => {
  const [selectedStores, setSelectedStores] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    stores: true,
    price: true
  })

  const handleStoreToggle = (storeId) => {
    const newStores = selectedStores.includes(storeId)
      ? selectedStores.filter(s => s !== storeId)
      : [...selectedStores, storeId]
    setSelectedStores(newStores)
    if (onStoreFilter) {
      onStoreFilter(newStores)
    }
  }

  const handleCategoryToggle = (categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(c => c !== categoryId)
      : [...selectedCategories, categoryId]
    setSelectedCategories(newCategories)
    
    if (onCategoryFilter) {
      onCategoryFilter(newCategories)
    }
  }

  const handlePriceChange = (type, value) => {
    const newPriceRange = { ...priceRange, [type]: value }
    setPriceRange(newPriceRange)
    if (onPriceFilter) {
      onPriceFilter(newPriceRange)
    }
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const clearFilters = () => {
    setSelectedStores([])
    setSelectedCategories([])
    setPriceRange({ min: '', max: '' })
    if (onStoreFilter) onStoreFilter([])
    if (onCategoryFilter) onCategoryFilter([])
    if (onPriceFilter) onPriceFilter({ min: '', max: '' })
  }

  const totalFilters = selectedStores.length + selectedCategories.length + 
    (priceRange.min || priceRange.max ? 1 : 0)

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-80 bg-white shadow-lg md:shadow-md 
        transition-transform duration-300 ease-in-out overflow-y-auto h-screen md:h-fit md:sticky md:top-24
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="text-primary-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
              {totalFilters > 0 && (
                <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {totalFilters}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="md:hidden text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Clear Filters */}
          {totalFilters > 0 && (
            <button
              onClick={clearFilters}
              className="w-full mb-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Limpar todos os filtros
            </button>
          )}

          {/* Price Range */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full py-2"
            >
              <h3 className="font-semibold text-gray-900">Preço</h3>
              {expandedSections.price ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {expandedSections.price && (
              <div className="mt-3 space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Mínimo</label>
                    <input 
                      type="number"
                      placeholder="R$ 0"
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Máximo</label>
                    <input 
                      type="number"
                      placeholder="R$ 1000"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => toggleSection('categories')}
                className="flex items-center justify-between w-full py-2"
              >
                <h3 className="font-semibold text-gray-900">Categorias</h3>
                {expandedSections.categories ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {expandedSections.categories && (
                <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                  {categories.map((category) => (
                    <label 
                      key={category.id} 
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 flex-1">{category.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stores */}
          {stores.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => toggleSection('stores')}
                className="flex items-center justify-between w-full py-2"
              >
                <h3 className="font-semibold text-gray-900">Lojas</h3>
                {expandedSections.stores ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {expandedSections.stores && (
                <div className="mt-3 space-y-2">
                  {stores.map((store) => (
                    <label 
                      key={store.id} 
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStores.includes(store.id)}
                        onChange={() => handleStoreToggle(store.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        {store.logoUrl && (
                          <img 
                            src={store.logoUrl} 
                            alt={store.name}
                            className="w-4 h-4 object-contain"
                          />
                        )}
                        <span className="text-sm text-gray-700">{store.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default FilterSidebar