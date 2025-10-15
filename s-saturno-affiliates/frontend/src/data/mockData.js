// Dados de exemplo para demonstração
export const mockProducts = [
  {
    id: 1,
    title: "iPhone 15 Pro Max 256GB - Titânio Natural",
    price: 8999.00,
    originalPrice: 9999.00,
    imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
    affiliateUrl: "https://mercadolivre.com.br",
    clicks: 1250,
    isActive: true,
    store: {
      id: 1,
      name: "Apple Store",
      logoUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=50&h=50&fit=crop&crop=center"
    },
    categories: [
      { category: { id: 1, name: "Smartphones" } },
      { category: { id: 2, name: "Apple" } }
    ]
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra 512GB - Violeta",
    price: 6999.00,
    originalPrice: 7499.00,
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    affiliateUrl: "https://mercadolivre.com.br",
    clicks: 890,
    isActive: true,
    store: {
      id: 2,
      name: "Samsung Galaxy",
      logoUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=50&h=50&fit=crop&crop=center"
    },
    categories: [
      { category: { id: 1, name: "Smartphones" } },
      { category: { id: 3, name: "Samsung" } }
    ]
  },
  {
    id: 3,
    title: "MacBook Pro 14\" M3 Pro 512GB - Space Black",
    price: 15999.00,
    originalPrice: 17499.00,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    affiliateUrl: "https://mercadolivre.com.br",
    clicks: 720,
    isActive: true,
    store: {
      id: 1,
      name: "Apple Store",
      logoUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=50&h=50&fit=crop&crop=center"
    },
    categories: [
      { category: { id: 4, name: "Notebooks" } },
      { category: { id: 2, name: "Apple" } }
    ]
  },
  {
    id: 4,
    title: "Dell XPS 13 Plus - Intel i7 32GB 1TB SSD",
    price: 8499.00,
    originalPrice: 9299.00,
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    affiliateUrl: "https://mercadolivre.com.br",
    clicks: 540,
    isActive: true,
    store: {
      id: 3,
      name: "Dell Store",
      logoUrl: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=50&h=50&fit=crop&crop=center"
    },
    categories: [
      { category: { id: 4, name: "Notebooks" } },
      { category: { id: 5, name: "Dell" } }
    ]
  },
  {
    id: 5,
    title: "PlayStation 5 + 2 Controles - Edição Digital",
    price: 3299.00,
    originalPrice: 3799.00,
    imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
    affiliateUrl: "https://mercadolivre.com.br",
    clicks: 1890,
    isActive: true,
    store: {
      id: 4,
      name: "PlayStation Store",
      logoUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=50&h=50&fit=crop&crop=center"
    },
    categories: [
      { category: { id: 6, name: "Games" } },
      { category: { id: 7, name: "Console" } }
    ]
  },
  {
    id: 6,
    title: "AirPods Pro 3ª Geração - USB-C",
    price: 1799.00,
    originalPrice: 1999.00,
    imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400",
    affiliateUrl: "https://mercadolivre.com.br",
    clicks: 630,
    isActive: true,
    store: {
      id: 1,
      name: "Apple Store",
      logoUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=50&h=50&fit=crop&crop=center"
    },
    categories: [
      { category: { id: 8, name: "Áudio" } },
      { category: { id: 2, name: "Apple" } }
    ]
  },
  {
    id: 7,
    title: "Smart TV LG 65\" OLED 4K - C3 Series",
    price: 7499.00,
    originalPrice: 8999.00,
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
    affiliateUrl: "https://mercadolivre.com.br",
    clicks: 980,
    isActive: true,
    store: {
      id: 5,
      name: "LG Electronics",
      logoUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=50&h=50&fit=crop&crop=center"
    },
    categories: [
      { category: { id: 9, name: "TV" } },
      { category: { id: 10, name: "Casa" } }
    ]
  },
  {
    id: 8,
    title: "Nike Air Jordan 1 Retro High OG - Chicago",
    price: 1299.00,
    originalPrice: 1499.00,
    imageUrl: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400",
    affiliateUrl: "https://mercadolivre.com.br",
    clicks: 2150,
    isActive: true,
    store: {
      id: 6,
      name: "Nike Store",
      logoUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50&h=50&fit=crop&crop=center"
    },
    categories: [
      { category: { id: 11, name: "Tênis" } },
      { category: { id: 12, name: "Moda" } }
    ]
  }
];

export const mockStores = [
  { id: 1, name: "Apple Store", logoUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=50&h=50&fit=crop&crop=center" },
  { id: 2, name: "Samsung Galaxy", logoUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=50&h=50&fit=crop&crop=center" },
  { id: 3, name: "Dell Store", logoUrl: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=50&h=50&fit=crop&crop=center" },
  { id: 4, name: "PlayStation Store", logoUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=50&h=50&fit=crop&crop=center" },
  { id: 5, name: "LG Electronics", logoUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=50&h=50&fit=crop&crop=center" },
  { id: 6, name: "Nike Store", logoUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50&h=50&fit=crop&crop=center" }
];

export const mockCategories = [
  { id: 1, name: "Smartphones" },
  { id: 2, name: "Apple" },
  { id: 3, name: "Samsung" },
  { id: 4, name: "Notebooks" },
  { id: 5, name: "Dell" },
  { id: 6, name: "Games" },
  { id: 7, name: "Console" },
  { id: 8, name: "Áudio" },
  { id: 9, name: "TV" },
  { id: 10, name: "Casa" },
  { id: 11, name: "Tênis" },
  { id: 12, name: "Moda" }
];