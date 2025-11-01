import React from 'react';
import HeaderML from '../components/HeaderML';
import FooterML from '../components/FooterML';
import SEO from '../components/SEO';

const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEO
        title="Produtos - S-Saturno Affiliates"
        description="Explore todos os produtos do S-Saturno Affiliates: eletrônicos, beleza, moda, casa e muito mais, com ofertas e frete grátis."
        url="https://s-saturno.vercel.app/produtos"
        type="website"
      />
      <HeaderML />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Todos os produtos</h1>
        <p className="text-gray-600 mb-6">Navegue pelas melhores ofertas e descubra novidades atualizadas regularmente.</p>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700">Esta página reúne todos os produtos. Em breve, adicionaremos filtros e categorias dedicadas aqui também.</p>
        </div>
      </main>
      <FooterML />
    </div>
  );
};

export default ProductsPage;
