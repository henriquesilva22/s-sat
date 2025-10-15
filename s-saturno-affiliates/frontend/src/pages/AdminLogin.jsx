import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAdmin';
import toast from 'react-hot-toast';

/**
 * Página de login administrativo
 */
const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/admin';
    }
  }, [isAuthenticated]);

  /**
   * Lidar com submit do formulário
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast.error('Por favor, insira a senha');
      return;
    }

    setLoading(true);

    try {
      const result = await login(password);
      
      if (result.success) {
        toast.success('Login realizado com sucesso!');
        // Pequeno delay para mostrar o toast
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1000);
      } else {
        toast.error(result.error || 'Senha incorreta');
        setPassword(''); // Limpar senha em caso de erro
      }
    } catch (error) {
      toast.error('Erro inesperado. Tente novamente.');
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-saturno flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold text-white">
            Área Administrativa
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Faça login para acessar o painel de controle
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Campo de senha */}
            <div>
              <label htmlFor="password" className="form-label">
                Senha de Administrador
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-base pl-10 pr-12"
                  placeholder="Digite a senha administrativa"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Botão de submit */}
            <div>
              <button
                type="submit"
                disabled={loading || !password.trim()}
                className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Entrar no Painel'
                )}
              </button>
            </div>
          </form>

          {/* Informações adicionais */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <h4 className="font-medium mb-2">Acesso Administrativo</h4>
              <ul className="space-y-1 text-xs">
                <li>• Gerenciar produtos e lojas</li>
                <li>• Visualizar relatórios de cliques</li>
                <li>• Configurar marketplace</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 text-white/80 text-sm">
            <button 
              onClick={() => window.location.href = '/'}
              className="hover:text-white transition-colors underline"
            >
              ← Voltar ao Marketplace
            </button>
          </div>
          
          <div className="mt-4 text-xs text-white/60">
            © 2024 S-Saturno Affiliates. Acesso restrito.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;