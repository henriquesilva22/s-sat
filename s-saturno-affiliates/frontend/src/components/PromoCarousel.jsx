import React, { useState, useEffect } from 'react';
import './PromoCarousel.css';

const PromoCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      id: 1,
      isLogo: true,
      title: 'S-Saturno',
      description: 'Atualizamos diariamente as melhores promoções da internet, escolhidas especialmente para você!'
    },
    {
      id: 2,
      icon: '🛒',
      title: 'Conectamos Você',
      description: 'Nosso sistema conecta você às principais lojas do mercado, permitindo escolher a que mais combina com sua confiança e preferência.'
    },
    {
      id: 3,
      icon: '🚀',
      title: 'Ofertas Exclusivas',
      description: 'Explore ofertas exclusivas e descubra oportunidades incríveis que mudam todos os dias! Aproveite agora — antes que acabe!'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Transição automática a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className="promo-carousel">
      <div className="carousel-container">
        <div 
          className="slides-wrapper"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            >
              <div className="slide-content">
                <div className="slide-layout">
                  {slide.isLogo ? (
                    <div className="slide-icon" aria-hidden={false}>
                      <svg
                        width="80"
                        height="80"
                        viewBox="0 0 64 64"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-label="Ícone de planeta"
                      >
                        <title>Ícone de planeta</title>
                        {/* Planeta */}
                        <circle cx="32" cy="32" r="14" fill="none" stroke="#FFFFFF" strokeWidth="3" />
                        {/* Anel (frente) */}
                        <ellipse
                          cx="32"
                          cy="32"
                          rx="26"
                          ry="10"
                          transform="rotate(-20 32 32)"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeOpacity="0.9"
                          strokeWidth="3"
                        />
                        {/* Anel (glow) */}
                        <ellipse
                          cx="32"
                          cy="32"
                          rx="26"
                          ry="10"
                          transform="rotate(-20 32 32)"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeOpacity="0.3"
                          strokeWidth="6"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="slide-icon">{slide.icon}</div>
                  )}
                  <div className="slide-text">
                    <h2 className="slide-title">{slide.title}</h2>
                    <p className="slide-description">{slide.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botões de navegação */}
        <button className="carousel-btn prev-btn" onClick={prevSlide}>
          ‹
        </button>
        <button className="carousel-btn next-btn" onClick={nextSlide}>
          ›
        </button>

        {/* Indicadores */}
        <div className="indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoCarousel;