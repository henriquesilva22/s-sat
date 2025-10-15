import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';

const FloatingFavoritesButton = () => {
  const { favoritesCount } = useFavorites();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // O botão sempre fica visível, mas pode adicionar lógica para esconder/mostrar
      setIsVisible(true);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={() => window.location.href = '/favoritos'}
      className="floating-favorites-btn"
      aria-label="Ver favoritos"
    >
      <Heart size={24} className={favoritesCount > 0 ? 'text-white fill-white' : 'text-white'} />
      {favoritesCount > 0 && (
        <span className="floating-favorites-count">{favoritesCount}</span>
      )}
    </button>
  );
};

export default FloatingFavoritesButton;