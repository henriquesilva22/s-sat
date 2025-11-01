import React from 'react';
import HeaderML from '../components/HeaderML';
import FooterML from '../components/FooterML';
import SEO from '../components/SEO';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEO
        title="Contato - S-Saturno Affiliates"
        description="Fale com o S-Saturno Affiliates. Suporte, parcerias e dúvidas gerais."
        url="https://s-saturno.vercel.app/contato"
        type="website"
      />
      <HeaderML />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Contato</h1>
        <p className="text-gray-600 mb-6">Entre em contato para suporte, parcerias e mais.</p>
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <p className="text-gray-700">Email: contato@s-saturno.com</p>
          <p className="text-gray-700">Tempo de resposta: 1-2 dias úteis</p>
        </div>
      </main>
      <FooterML />
    </div>
  );
};

export default ContactPage;
