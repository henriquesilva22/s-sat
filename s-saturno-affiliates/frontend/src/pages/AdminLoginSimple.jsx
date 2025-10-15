import React, { useState } from 'react';
import toast from 'react-hot-toast';

/**
 * Página de login administrativa - Versão simplificada
 */
const AdminLoginSimple = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast.error('Por favor, insira a senha');
      return;
    }

    setLoading(true);
    
    try {
      // Fazer login simples
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://s-sat.onrender.com';
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          localStorage.setItem('adminToken', data.data.token);
          toast.success('Login realizado com sucesso!');
          window.location.href = '/admin';
        } else {
          toast.error('Senha incorreta');
        }
      } else {
        toast.error('Erro no servidor');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 S-Saturno Admin
          </h1>
          <p className="text-gray-600">Área Administrativa</p>
        </div>

        {/* Formulário */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha de Acesso
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha administrativa"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? '🔄 Entrando...' : '🔓 Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Senha padrão: admin123
            </p>
          </div>
        </div>

        {/* Voltar */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            ← Voltar para o site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginSimple;