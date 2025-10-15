import React from 'react'

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
)

const ProductGridSkeleton = ({ count = 12 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }, (_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
)

export { ProductCardSkeleton, ProductGridSkeleton }