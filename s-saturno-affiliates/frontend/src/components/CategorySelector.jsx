import { useState, useEffect } from 'react'
import { X, Check, AlertCircle } from 'lucide-react'
import { cn } from '../utils/cn'

const CategorySelector = ({ 
  selectedCategories = [], 
  onCategoriesChange, 
  categories = [],
  maxCategories = 4,
  className = '',
  disabled = false
}) => {
  const [localSelected, setLocalSelected] = useState(selectedCategories)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    setLocalSelected(selectedCategories)
  }, [selectedCategories])

  const handleCategoryToggle = (categoryId) => {
    if (disabled) return

    const isSelected = localSelected.includes(categoryId)
    let newSelected

    if (isSelected) {
      // Remove category
      newSelected = localSelected.filter(id => id !== categoryId)
    } else {
      // Add category if under limit
      if (localSelected.length >= maxCategories) {
        return // Don't add if at limit
      }
      newSelected = [...localSelected, categoryId]
    }

    setLocalSelected(newSelected)
    if (onCategoriesChange) {
      onCategoriesChange(newSelected)
    }
  }

  const removeCategoryById = (categoryId) => {
    const newSelected = localSelected.filter(id => id !== categoryId)
    setLocalSelected(newSelected)
    if (onCategoriesChange) {
      onCategoriesChange(newSelected)
    }
  }

  const isLimitReached = localSelected.length >= maxCategories
  const remainingSlots = maxCategories - localSelected.length

  const visibleCategories = showAll ? categories : categories.slice(0, 8)
  const hasMoreCategories = categories.length > 8

  return (
    <div className={cn('space-y-4', className)}>
      {/* Selected Categories Display */}
      {localSelected.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Categorias Selecionadas ({localSelected.length}/{maxCategories})
            </span>
            {isLimitReached && (
              <div className="flex items-center gap-1 text-amber-600 text-xs">
                <AlertCircle size={14} />
                <span>Limite atingido</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {localSelected.map(categoryId => {
              const category = categories.find(c => c.id === categoryId)
              return category ? (
                <div
                  key={categoryId}
                  className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  <Check size={14} />
                  <span>{category.name}</span>
                  {!disabled && (
                    <button
                      onClick={() => removeCategoryById(categoryId)}
                      className="ml-1 hover:bg-primary-200 rounded-full p-0.5 transition-colors"
                      type="button"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ) : null
            })}
          </div>
        </div>
      )}

      {/* Available Categories */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Categorias Disponíveis
          </span>
          {remainingSlots > 0 && (
            <span className="text-xs text-gray-500">
              {remainingSlots} restantes
            </span>
          )}
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle size={24} className="mx-auto mb-2" />
            <p>Nenhuma categoria disponível</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {visibleCategories.map((category) => {
                const isSelected = localSelected.includes(category.id)
                const canSelect = !isSelected && !isLimitReached && !disabled

                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
                    disabled={!canSelect && !isSelected}
                    className={cn(
                      'flex items-center justify-between p-3 border rounded-lg text-left transition-all',
                      isSelected
                        ? 'border-primary-500 bg-primary-50 text-primary-900'
                        : canSelect
                        ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed',
                      disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    type="button"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {category.name}
                      </div>
                      {category.description && (
                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {category.description}
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-2">
                      {isSelected ? (
                        <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      ) : (
                        <div className={cn(
                          'w-5 h-5 border-2 rounded-full',
                          canSelect 
                            ? 'border-gray-300' 
                            : 'border-gray-200'
                        )} />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Show More/Less Button */}
            {hasMoreCategories && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full mt-2 text-sm text-primary-600 hover:text-primary-700 py-2 border border-dashed border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
                type="button"
              >
                {showAll ? 'Ver menos categorias' : `Ver mais ${categories.length - 8} categorias`}
              </button>
            )}
          </>
        )}
      </div>

      {/* Helper Text */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <div>
            <p>Selecione até {maxCategories} categorias que melhor descrevem este produto.</p>
            <p className="mt-1">As categorias ajudam os clientes a encontrar produtos mais facilmente.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategorySelector