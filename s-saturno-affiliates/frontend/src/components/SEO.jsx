import { useEffect } from 'react';

/**
 * Componente SEO para gerenciar meta tags dinamicamente
 * Atualiza title, description, Open Graph, Twitter Cards, etc.
 */
const SEO = ({
  title = "S-Saturno Affiliates - Marketplace de Produtos com os Melhores Preços",
  description = "Encontre os melhores produtos com preços incríveis no S-Saturno Affiliates. Eletrônicos, beleza, moda, casa e muito mais com ofertas exclusivas.",
  keywords = "marketplace, afiliados, ofertas, produtos, eletrônicos, beleza, moda, casa, jardim, esportes, automotivo, compras online",
  image = "https://s-saturno.vercel.app/og-image.jpg",
  url = "https://s-saturno.vercel.app/",
  type = "website",
  robots = "index, follow",
  jsonLd = null // Aceita objeto ou array de objetos JSON-LD
}) => {
  useEffect(() => {
    // Atualizar title
    document.title = title;

    // Função helper para atualizar ou criar meta tag
    const updateMetaTag = (property, content, attribute = 'property') => {
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Meta description
    updateMetaTag('description', description, 'name');

    // Keywords
    updateMetaTag('keywords', keywords, 'name');

    // Robots
    updateMetaTag('robots', robots, 'name');

    // Open Graph
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:url', url, 'property');
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', image, 'property');

    // Twitter Cards
    updateMetaTag('twitter:card', 'summary_large_image', 'property');
    updateMetaTag('twitter:url', url, 'property');
    updateMetaTag('twitter:title', title, 'property');
    updateMetaTag('twitter:description', description, 'property');
    updateMetaTag('twitter:image', image, 'property');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      document.head.appendChild(canonical);
    }

    // JSON-LD Structured Data (opcional)
    // Remove anterior, se existir
    const priorJsonLd = document.getElementById('seo-jsonld');
    if (priorJsonLd) {
      priorJsonLd.remove();
    }

    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'seo-jsonld';
      const data = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      script.text = JSON.stringify(data);
      document.head.appendChild(script);
    }

  }, [title, description, keywords, image, url, type, robots, jsonLd]);

  return null; // Este componente não renderiza nada
};

export default SEO;