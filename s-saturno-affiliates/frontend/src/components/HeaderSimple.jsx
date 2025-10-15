import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, User, ShoppingCart, Menu, X, Heart } from 'lucide-react'
import { cn } from '../utils/cn'

export default function Header({ searchTerm, setSearchTerm, onSearch }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchTerm)
    }
  }

  return (
    <header className="bg-primary-500 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary-500 font-bold text-xl">SS</span>
            </div>
            <span className="text-white font-bold text-xl hidden md:block">S-Saturno</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar produtos, marcas e mais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 text-gray-900"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded transition-colors"
              >
                <Search size={20} className="text-gray-600" />
              </button>
            </form>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/admin" className="text-white hover:text-gray-200 transition-colors text-sm font-medium">
              Admin
            </Link>
            <button className="text-white hover:text-gray-200 transition-colors">
              <User size={24} />
            </button>
            <button className="text-white hover:text-gray-200 transition-colors">
              <Heart size={24} />
            </button>
            <button className="text-white hover:text-gray-200 transition-colors relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-primary-400">
            <nav className="space-y-3">
              <Link
                to="/admin"
                className="block text-white hover:text-primary-200 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
              <div className="flex items-center gap-4 pt-2">
                <button className="text-white hover:text-gray-200 transition-colors">
                  <User size={24} />
                </button>
                <button className="text-white hover:text-gray-200 transition-colors">
                  <Heart size={24} />
                </button>
                <button className="text-white hover:text-gray-200 transition-colors relative">
                  <ShoppingCart size={24} />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}