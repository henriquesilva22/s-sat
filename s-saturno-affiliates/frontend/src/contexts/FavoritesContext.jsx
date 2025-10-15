import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    // Carregar favoritos do localStorage imediatamente na inicialização
    try {
      const savedFavorites = localStorage.getItem('s-saturno-favorites');
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      return [];
    }
  });

  // Salvar favoritos no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('s-saturno-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (product) => {
    setFavorites(prev => {
      // Verificar se já existe
      if (prev.some(fav => fav.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromFavorites = (productId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== productId));
  };

  const toggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(fav => fav.id === productId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};