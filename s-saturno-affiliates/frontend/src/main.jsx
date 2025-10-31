import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';

// Importar páginas
import Home from './pages/Home';
import HomePageNew from './pages/HomePageNew';
import HomePageML from './pages/HomePageML';
import FavoritesPage from './pages/FavoritesPage';
import AdminLogin from './pages/AdminLogin';
import AdminLoginSimple from './pages/AdminLoginSimple';
import AdminDashboard from './pages/AdminDashboard';
import TestProducts from './pages/TestProducts';
import HomePageMLSimple from './pages/HomePageMLSimple';

// Importar componentes
import NotFound from './components/NotFound';
import SEO from './components/SEO';

// Importar contextos
import { FavoritesProvider } from './contexts/FavoritesContext';

/**
 * Componente principal da aplicação
 * 
 * ACESSO ADMIN:
 * - Duplo clique no logo "S-SATURNO"
 * - URL direta: /s-admin-2024
 * - URL alternativa: /gerenciar-saturno
 * - Teclas: Ctrl+Shift+A na homepage
 */
function App() {
  return (
    <FavoritesProvider>
      <Router>
        {/* SEO Global */}
        <SEO />

        <div className="App">
          <Routes>
            {/* Rota principal - Nova versão com design MercadoLivre */}
            <Route path="/" element={<HomePageML />} />
            
            {/* Página de favoritos */}
            <Route path="/favoritos" element={<FavoritesPage />} />
            
            {/* Versão antiga */}
            <Route path="/old" element={<Home />} />
            
            {/* Versão intermediária */}
            <Route path="/new" element={<HomePageNew />} />
            
            {/* Página de teste */}
            <Route path="/test" element={<TestProducts />} />
            
            {/* Página simples */}
            <Route path="/simple" element={<HomePageMLSimple />} />
            
            {/* Rotas administrativas */}
            <Route path="/admin/login" element={<AdminLoginSimple />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            
            {/* Rota secreta para admin */}
            <Route path="/s-admin-2024" element={<AdminLoginSimple />} />
            <Route path="/gerenciar-saturno" element={<AdminLoginSimple />} />
            
            {/* Rota 404 - Página não encontrada */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </div>
    </Router>
    </FavoritesProvider>
  );
}

// Renderizar a aplicação
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);