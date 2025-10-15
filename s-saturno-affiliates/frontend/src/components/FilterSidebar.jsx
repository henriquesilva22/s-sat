import { ChevronDown, X } from 'lucide-react'
import { useState } from 'react'

const FilterSidebar = ({ stores = [], categories = [], onStoreFilter, onCategoryFilter, onPriceFilter, isOpen, onClose }) => {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedStores, setSelectedStores] = useState([])

  const handlePriceChange = (field, value) => {
    const newRange = { ...priceRange, [field]: value }
    setPriceRange(newRange)
    if (onPriceFilter) {
      onPriceFilter(newRange)
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

  const handleStoreToggle = (storeId) => {
    const newStores = selectedStores.includes(storeId)
      ? selectedStores.filter(s => s !== storeId)
      : [...selectedStores, storeId]
    setSelectedStores(newStores)
    if (onStoreFilter) {
      onStoreFilter(newStores)
    }
  }

  const clearAllFilters = () => {
    setPriceRange({ min: '', max: '' })
    setSelectedCategories([])
    setSelectedStores([])
    if (onPriceFilter) onPriceFilter({ min: '', max: '' })
    if (onStoreFilter) onStoreFilter([])
    if (onCategoryFilter) onCategoryFilter([])
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static top-0 left-0 h-full lg:h-fit
        w-80 bg-white p-6 rounded-lg shadow-md z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:sticky lg:top-24
      `}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Filtrar por</h2>
          <button 
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Price Range */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Preço</h3>
          <div className="space-y-2">
            <input 
              type="range" 
              min="0" 
              max="1000" 
              className="w-full accent-primary-500" 
            />
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Mín" 
                value={priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary-500"
              />
              <input 
                type="number" 
                placeholder="Máx" 
                value={priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Categorias</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="rounded text-primary-500 focus:ring-primary-500" 
                />
                <span className="text-sm">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Stores */}
        {stores.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-3">Lojas</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {stores.map((store) => (
                <label key={store.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input 
                    type="checkbox" 
                    checked={selectedStores.includes(store.id)}
                    onChange={() => handleStoreToggle(store.id)}
                    className="rounded text-primary-500 focus:ring-primary-500" 
                  />
                  <span className="text-sm">{store.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        <button 
          onClick={clearAllFilters}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors"
        >
          Limpar filtros
        </button>
      </aside>
    </>
  )
}

export default FilterSidebar