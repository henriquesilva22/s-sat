import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

/**
 * Página 404 - Não Encontrada
 * SEO otimizada para páginas não encontradas
 */
const NotFound = () => {
  // Atualizar title da página
  React.useEffect(() => {
    document.title = 'Página Não Encontrada - S-Saturno Affiliates';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* SEO Meta Tags (programaticamente) */}
        <meta name="robots" content="noindex, follow" />

        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Página Não Encontrada
          </h2>
          <p className="text-gray-600 mb-8">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Home size={20} />
            Voltar ao Início
          </Link>

          <div>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              Página Anterior
            </button>
          </div>
        </div>

        {/* Links de navegação para SEO */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Navegue por nossas categorias:
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link to="/categoria/eletronicos" className="text-primary-600 hover:text-primary-700">
              Eletrônicos
            </Link>
            <Link to="/categoria/beleza-saude" className="text-primary-600 hover:text-primary-700">
              Beleza & Saúde
            </Link>
            <Link to="/categoria/roupas-acessorios" className="text-primary-600 hover:text-primary-700">
              Roupas & Acessórios
            </Link>
            <Link to="/categoria/casa-jardim" className="text-primary-600 hover:text-primary-700">
              Casa & Jardim
            </Link>
            <Link to="/categoria/esportes-lazer" className="text-primary-600 hover:text-primary-700">
              Esportes & Lazer
            </Link>
            <Link to="/categoria/automotivo" className="text-primary-600 hover:text-primary-700">
              Automotivo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;