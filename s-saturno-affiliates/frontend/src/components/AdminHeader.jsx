import React from 'react';
import { LogOut, Home, Settings, User, BarChart3, Package, Store } from 'lucide-react';

const AdminHeader = ({ activeTab, setActiveTab }) => {
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'stores', label: 'Lojas', icon: Store }
  ];

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        {/* Logo e Título */}
        <div className="admin-logo">
          <div className="admin-logo-icon">🛠️</div>
          <div className="admin-logo-text">
            <h1>S-SATURNO</h1>
            <span>Painel Administrativo</span>
          </div>
        </div>

        {/* Navegação */}
        <nav className="admin-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`admin-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Ações */}
        <div className="admin-actions">
          <button
            onClick={() => window.location.href = '/'}
            className="admin-action-btn"
            title="Voltar ao Site"
          >
            <Home size={20} />
          </button>
          
          <button
            onClick={handleLogout}
            className="admin-action-btn logout"
            title="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;