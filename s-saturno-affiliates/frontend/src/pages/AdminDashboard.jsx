import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  Store, 
  MousePointer, 
  TrendingUp,
  Eye,
  Calendar,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Tag
} from 'lucide-react';
import AdminHeader from '../components/AdminHeader';
import FooterML from '../components/FooterML';
import CategorySelector from '../components/CategorySelector';
import ImageUpload from '../components/ImageUploadSimple';
import { adminAPI, API_BASE_URL } from '../services/api';
import { useAuth, useAdmin } from '../hooks/useAdmin';
import { formatPrice, formatDate, formatNumber } from '../utils/helpers';
import toast from 'react-hot-toast';
import '../styles/admin-header.css';

/**
 * Página principal do painel administrativo
 */
const AdminDashboard = () => {
  // NOTE: use adminAPI for requests; no need for manual base URL handling here
  
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    dashboard,
    products,
    stores,
    loading,
    fetchDashboard,
    fetchAdminProducts,
    fetchAdminStores,
    deleteProduct,
    deleteStore
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  
  // Estados para modals
  const [showNewStoreModal, setShowNewStoreModal] = useState(false);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showEditStoreModal, setShowEditStoreModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  
  // Estados para filtros de produtos
  const [productFilter, setProductFilter] = useState('all'); // 'all', 'eletronicos', 'beleza', 'moda', 'outros1', 'outros2'
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Estados para seleção de categorias
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [editSelectedCategories, setEditSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Estados para formulários
  const [newStore, setNewStore] = useState({
    name: '',
    domain: '',
    logoUrl: ''
  });
  
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    originalPrice: '',
    imageUrl: '',
    affiliateUrl: '',
    storeId: '',
    description: '',
    rating: '',
    reviewCount: '',
    soldCount: '',
    freeShipping: true
  });
  
  const [editStore, setEditStore] = useState({
    id: '',
    name: '',
    domain: '',
    logoUrl: ''
  });
  
  const [editProduct, setEditProduct] = useState({
    id: '',
    title: '',
    price: '',
    originalPrice: '',
    imageUrl: '',
    affiliateUrl: '',
    storeId: '',
    description: '',
    rating: '',
    reviewCount: '',
    soldCount: '',
    freeShipping: true
  });

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = '/admin/login';
    }
  }, [isAuthenticated, authLoading]);

  // Filtrar produtos por categoria
  useEffect(() => {
    if (productFilter === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => {
        if (!product.categories || product.categories.length === 0) {
          return productFilter === 'outros1'; // Produtos sem categoria vão para "outros1"
        }
        
        return product.categories.some(cat => {
          const categoryName = cat.category?.name?.toLowerCase() || '';
          switch (productFilter) {
            case 'eletronicos':
              return categoryName.includes('eletrôn') || categoryName.includes('eletron') || categoryName.includes('celular') || categoryName.includes('computador');
            case 'beleza':
              return categoryName.includes('beleza') || categoryName.includes('cosmétic') || categoryName.includes('perfume') || categoryName.includes('cabelo');
            case 'moda':
              return categoryName.includes('moda') || categoryName.includes('roupa') || categoryName.includes('vestuário') || categoryName.includes('acessóri');
            case 'outros1':
              return !categoryName.includes('eletrôn') && !categoryName.includes('eletron') && !categoryName.includes('celular') && 
                     !categoryName.includes('computador') && !categoryName.includes('beleza') && !categoryName.includes('cosmétic') && 
                     !categoryName.includes('perfume') && !categoryName.includes('cabelo') && !categoryName.includes('moda') && 
                     !categoryName.includes('roupa') && !categoryName.includes('vestuário') && !categoryName.includes('acessóri');
            case 'outros2':
              return false; // Por enquanto vazio, pode ser usado para outras categorias
            default:
              return true;
          }
        });
      });
      setFilteredProducts(filtered);
    }
  }, [products, productFilter]);

  /**
   * Lidar com exclusão de produto
   */
  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${product.title}"?`)) {
      const result = await deleteProduct(product.id);
      if (result.success) {
        toast.success('Produto excluído com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao excluir produto');
      }
    }
  };

  /**
   * Lidar com exclusão de loja
   */
  const handleDeleteStore = async (store) => {
    if (window.confirm(`Tem certeza que deseja excluir a loja "${store.name}"?`)) {
      const result = await deleteStore(store.id);
      if (result.success) {
        toast.success('Loja excluída com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao excluir loja');
      }
    }
  };

  /**
   * Criar nova loja
   */
  const handleCreateStore = async (e) => {
    e.preventDefault();
    
    try {
      // Use adminAPI which already aplica token e baseURL via axios
      console.log('Dados da loja:', newStore);
      const result = await adminAPI.createStore(newStore);

      if (result && result.success) {
        toast.success('Loja criada com sucesso!');
        setShowNewStoreModal(false);
        setNewStore({ name: '', domain: '', logoUrl: '' });
        fetchAdminStores(); // Recarregar lista
      } else {
        const errorMessage = result?.error || result?.message || 'Erro ao criar loja';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Erro completo ao criar loja:', error);
      console.error('Stack trace:', error.stack);
      toast.error(`Erro ao criar loja: ${error.message}`);
    }
  };

  /**
   * Criar novo produto
   */
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    try {
      // Validação básica antes de enviar
      if (!newProduct.title?.trim()) {
        toast.error('Título é obrigatório');
        return;
      }
      if (!newProduct.price || isNaN(parseFloat(newProduct.price))) {
        toast.error('Preço deve ser um número válido');
        return;
      }
      if (!newProduct.storeId || isNaN(parseInt(newProduct.storeId))) {
        toast.error('Loja deve ser selecionada');
        return;
      }
      if (!newProduct.affiliateUrl?.trim()) {
        toast.error('URL de afiliado é obrigatória');
        return;
      }
      if (!newProduct.description?.trim()) {
        toast.error('Descrição é obrigatória');
        return;
      }

      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : null,
        storeId: parseInt(newProduct.storeId),
        rating: newProduct.rating ? parseFloat(newProduct.rating) : null,
        reviewCount: newProduct.reviewCount ? parseInt(newProduct.reviewCount) : 0,
        soldCount: newProduct.soldCount ? parseInt(newProduct.soldCount) : 0,
        freeShipping: newProduct.freeShipping,
        categoryIds: selectedCategories
      };

      // Verificar se o token está presente
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      console.log('🔍 [DEBUG] Dados do produto sendo enviados:', productData);
      console.log('🔍 [DEBUG] imageUrl tamanho:', newProduct.imageUrl?.length || 0);
      console.log('🔍 [DEBUG] Token presente:', !!token);
      console.log('🔍 [DEBUG] selectedCategories:', selectedCategories);
      
      // DEBUG DETALHADO - Valores exatos sendo enviados
      console.log('� [DEBUG] API_BASE_URL:', API_BASE_URL);
      console.log('🔍 [DEBUG] URL completa:', `${API_BASE_URL}/api/admin/products`);

      const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        toast.success('Produto criado com sucesso!');
        setShowNewProductModal(false);
        setNewProduct({
          title: '',
          price: '',
          originalPrice: '',
          imageUrl: '',
          affiliateUrl: '',
          storeId: '',
          description: '',
          rating: '',
          reviewCount: '',
          soldCount: '',
          freeShipping: true
        });
        setSelectedCategories([]);
        fetchAdminProducts(); // Recarregar lista
      } else {
        console.error('❌ Erro HTTP:', response.status, response.statusText);
        const error = await response.json();
        console.error('❌ Detalhes do erro:', error);
        toast.error(error.error || error.message || 'Erro ao criar produto');
      }
    } catch (error) {
      console.error('❌ Erro ao criar produto:', error);
      console.error('❌ Stack trace:', error.stack);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Erro de conexão com o servidor. Verifique se o backend está rodando.');
      } else {
        toast.error(`Erro ao criar produto: ${error.message}`);
      }
    }
  };

  /**
   * Abrir modal de edição de loja
   */
  const handleEditStore = (store) => {
    setEditStore({
      id: store.id,
      name: store.name,
      domain: store.domain,
      logoUrl: store.logoUrl || ''
    });
    setShowEditStoreModal(true);
  };

  /**
   * Abrir modal de edição de produto
   */
  const handleEditProduct = (product) => {
    setEditProduct({
      id: product.id,
      title: product.title,
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      imageUrl: product.imageUrl,
      affiliateUrl: product.affiliateUrl,
      storeId: product.storeId.toString(),
      description: product.description || '',
      rating: product.rating ? product.rating.toString() : '',
      reviewCount: product.reviewCount ? product.reviewCount.toString() : '',
      soldCount: product.soldCount ? product.soldCount.toString() : '',
      freeShipping: product.freeShipping !== undefined ? product.freeShipping : true
    });
    // Configurar categorias selecionadas
    const productCategories = product.categories ? product.categories.map(cat => cat.category.id) : [];
    setEditSelectedCategories(productCategories);
    setShowEditProductModal(true);
  };

  /**
   * Atualizar loja
   */
  const handleUpdateStore = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/stores/${editStore.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          name: editStore.name,
          domain: editStore.domain,
          logoUrl: editStore.logoUrl
        })
      });

      if (response.ok) {
        toast.success('Loja atualizada com sucesso!');
        setShowEditStoreModal(false);
        setEditStore({ id: '', name: '', domain: '', logoUrl: '' });
        fetchAdminStores(); // Recarregar lista
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erro ao atualizar loja');
      }
    } catch (error) {
      console.error('Erro ao atualizar loja:', error);
      toast.error('Erro ao atualizar loja');
    }
  };

  /**
   * Atualizar produto
   */
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    try {
      // Validar e sanitizar dados antes do envio
      const price = parseFloat(editProduct.price);
      const originalPrice = editProduct.originalPrice ? parseFloat(editProduct.originalPrice) : null;
      const storeId = parseInt(editProduct.storeId);
      const rating = editProduct.rating ? parseFloat(editProduct.rating) : null;
      const reviewCount = editProduct.reviewCount ? parseInt(editProduct.reviewCount) : 0;
      const soldCount = editProduct.soldCount ? parseInt(editProduct.soldCount) : 0;

      // Verificar se os valores são válidos
      if (isNaN(price) || price <= 0) {
        toast.error('Preço deve ser um número válido e positivo');
        return;
      }

      if (isNaN(storeId) || storeId <= 0) {
        toast.error('Loja deve ser selecionada');
        return;
      }

      if (!editProduct.title || editProduct.title.trim().length < 3) {
        toast.error('Título deve ter pelo menos 3 caracteres');
        return;
      }

      if (!editProduct.description || editProduct.description.trim().length < 10) {
        toast.error('Descrição deve ter pelo menos 10 caracteres');
        return;
      }

      // Sanitizar imageUrl para evitar valores undefined/null
      let sanitizedImageUrl = '';
      if (editProduct.imageUrl && typeof editProduct.imageUrl === 'string' && editProduct.imageUrl.trim().length > 0) {
        sanitizedImageUrl = editProduct.imageUrl.trim();
      }
      
      // Sanitizar affiliateUrl
      let sanitizedAffiliateUrl = '';
      if (editProduct.affiliateUrl && typeof editProduct.affiliateUrl === 'string' && editProduct.affiliateUrl.trim().length > 0) {
        sanitizedAffiliateUrl = editProduct.affiliateUrl.trim();
      }

      const productData = {
        title: editProduct.title.trim(),
        price: price,
        originalPrice: originalPrice,
        imageUrl: sanitizedImageUrl,
        affiliateUrl: sanitizedAffiliateUrl,
        storeId: storeId,
        description: editProduct.description.trim(),
        rating: rating,
        reviewCount: reviewCount,
        soldCount: soldCount,
        freeShipping: Boolean(editProduct.freeShipping),
        categoryIds: editSelectedCategories
      };

      console.log('🔄 [FRONTEND] Enviando dados para update:', {
        productId: editProduct.id,
        productData,
        url: `${API_BASE_URL}/api/admin/products/${editProduct.id}`,
        token: localStorage.getItem('adminToken') ? 'Token presente' : 'Token ausente'
      });

      const response = await fetch(`${API_BASE_URL}/api/admin/products/${editProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(productData)
      });

      console.log('📊 [FRONTEND] Resposta da API:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ [FRONTEND] Sucesso na atualização:', result);
        toast.success('Produto atualizado com sucesso!');
        setShowEditProductModal(false);
        setEditProduct({
          id: '',
          title: '',
          price: '',
          originalPrice: '',
          imageUrl: '',
          affiliateUrl: '',
          storeId: '',
          description: '',
          rating: '',
          reviewCount: '',
          soldCount: '',
          freeShipping: true,
          warranty: true
        });
        setEditSelectedCategories([]);
        fetchAdminProducts(); // Recarregar lista
      } else {
        const errorText = await response.text();
        console.error('❌ [FRONTEND] Erro na resposta:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { message: errorText || 'Erro desconhecido' };
        }
        
        toast.error(error.message || 'Erro ao atualizar produto');
      }
    } catch (error) {
      console.error('💥 [FRONTEND] Erro ao atualizar produto:', {
        message: error.message,
        stack: error.stack,
        productData,
        editProduct
      });
      toast.error(`Erro ao atualizar produto: ${error.message}`);
    }
  };

  // Carregar categorias
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/categories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  // Criar nova categoria
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(newCategory)
      });

      if (response.ok) {
        toast.success('Categoria criada com sucesso!');
        setShowNewCategoryModal(false);
        setNewCategory({ name: '', description: '' });
        fetchCategories(); // Recarregar lista
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao criar categoria');
      }
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      toast.error('Erro ao criar categoria');
    }
  };

  // Atualizar dados iniciais para incluir categorias
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboard();
      fetchAdminProducts();
      fetchAdminStores();
      fetchCategories();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Será redirecionado
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header administrativo */}
      <AdminHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="container-responsive py-6 flex-1">

        {/* Conteúdo das abas */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboard?.stats?.totalProducts || 0}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-primary-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lojas Parceiras</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboard?.stats?.totalStores || 0}
                    </p>
                  </div>
                  <Store className="h-8 w-8 text-saturno-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Cliques</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(dashboard?.stats?.totalClicks || 0)}
                    </p>
                  </div>
                  <MousePointer className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa Média</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboard?.stats?.totalProducts > 0 
                        ? Math.round((dashboard?.stats?.totalClicks || 0) / dashboard.stats.totalProducts)
                        : 0
                      } <span className="text-sm font-normal text-gray-500">cliques/produto</span>
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Produtos recentes e mais clicados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Produtos recentes */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Produtos Recentes</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {dashboard?.recentProducts?.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {product.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {product.store.name} • {formatDate(product.createdAt)}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-green-600">
                          {formatPrice(product.price)}
                        </div>
                      </div>
                    ))}
                    {(!dashboard?.recentProducts || dashboard.recentProducts.length === 0) && (
                      <p className="text-gray-500 text-sm">Nenhum produto encontrado</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Produtos mais clicados */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Mais Clicados</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {dashboard?.topClickedProducts?.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {product.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {product.store.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Eye size={14} className="text-gray-400" />
                          <span className="font-medium">{product.clicks}</span>
                        </div>
                      </div>
                    ))}
                    {(!dashboard?.topClickedProducts || dashboard.topClickedProducts.length === 0) && (
                      <p className="text-gray-500 text-sm">Nenhum clique registrado</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aba de Produtos */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Produtos</h2>
              <button 
                onClick={() => setShowNewProductModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={16} />
                Novo Produto
              </button>
            </div>

            {/* Filtros por categoria */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por Categoria</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setProductFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    productFilter === 'all'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos ({products.length})
                </button>
                <button
                  onClick={() => setProductFilter('eletronicos')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    productFilter === 'eletronicos'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Eletrônicos ({products.filter(p => p.categories?.some(cat => 
                    (cat.category?.name?.toLowerCase() || '').includes('eletrôn') || 
                    (cat.category?.name?.toLowerCase() || '').includes('eletron') ||
                    (cat.category?.name?.toLowerCase() || '').includes('celular') ||
                    (cat.category?.name?.toLowerCase() || '').includes('computador')
                  )).length})
                </button>
                <button
                  onClick={() => setProductFilter('beleza')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    productFilter === 'beleza'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Beleza ({products.filter(p => p.categories?.some(cat => 
                    (cat.category?.name?.toLowerCase() || '').includes('beleza') || 
                    (cat.category?.name?.toLowerCase() || '').includes('cosmétic') ||
                    (cat.category?.name?.toLowerCase() || '').includes('perfume') ||
                    (cat.category?.name?.toLowerCase() || '').includes('cabelo')
                  )).length})
                </button>
                <button
                  onClick={() => setProductFilter('moda')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    productFilter === 'moda'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Moda ({products.filter(p => p.categories?.some(cat => 
                    (cat.category?.name?.toLowerCase() || '').includes('moda') || 
                    (cat.category?.name?.toLowerCase() || '').includes('roupa') ||
                    (cat.category?.name?.toLowerCase() || '').includes('vestuário') ||
                    (cat.category?.name?.toLowerCase() || '').includes('acessóri')
                  )).length})
                </button>
                <button
                  onClick={() => setProductFilter('outros1')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    productFilter === 'outros1'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Outros 1 ({products.filter(p => {
                    if (!p.categories || p.categories.length === 0) return true;
                    return p.categories.some(cat => {
                      const name = cat.category?.name?.toLowerCase() || '';
                      return !name.includes('eletrôn') && !name.includes('eletron') && !name.includes('celular') && 
                             !name.includes('computador') && !name.includes('beleza') && !name.includes('cosmétic') && 
                             !name.includes('perfume') && !name.includes('cabelo') && !name.includes('moda') && 
                             !name.includes('roupa') && !name.includes('vestuário') && !name.includes('acessóri');
                    });
                  }).length})
                </button>
                <button
                  onClick={() => setProductFilter('outros2')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    productFilter === 'outros2'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Outros 2 (0)
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loja
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliques
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded object-cover"
                              src={product.imageUrl}
                              alt={product.title}
                              onError={(e) => {
                                // Evita loop infinito de fallback
                                if (!e.target.dataset.fallback) {
                                  console.error('❌ [IMG ERROR] Falha ao carregar imagem:', product.imageUrl);
                                  e.target.src = 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=40&h=40&fit=crop&q=80';
                                  e.target.dataset.fallback = 'true';
                                }
                              }}
                              onLoad={(e) => {
                                console.log('✅ [IMG OK] Imagem carregada:', product.imageUrl);
                              }}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                {product.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {product.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {product.store?.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(product.price)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-900">
                            <Eye size={14} />
                            {product.clicks}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                            product.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={product.affiliateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <ExternalLink size={16} />
                            </a>
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Aba de Lojas */}
        {activeTab === 'stores' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Lojas</h2>
              <button 
                onClick={() => setShowNewStoreModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={16} />
                Nova Loja
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => (
                <div key={store.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {store.logoUrl ? (
                        <img
                          src={store.logoUrl}
                          alt={store.name}
                          className="w-10 h-10 rounded object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/40x40/e5e7eb/9ca3af?text=' + store.name.charAt(0);
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-600 font-semibold">
                            {store.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{store.name}</h3>
                        {store.domain && (
                          <p className="text-sm text-gray-500">{store.domain}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditStore(store)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteStore(store)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {store.description && (
                    <p className="text-sm text-gray-600 mb-4">
                      {store.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {store._count?.products || 0} produto{(store._count?.products || 0) !== 1 ? 's' : ''}
                    </span>
                    <span className="text-gray-500">
                      Criada em {formatDate(store.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aba de Categorias */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Categorias</h2>
              <button 
                onClick={() => setShowNewCategoryModal(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={16} />
                Nova Categoria
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      {category.slug && (
                        <p className="text-sm text-gray-500">/{category.slug}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {/* handleEditCategory(category) */}}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {/* handleDeleteCategory(category) */}}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-4">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {category._count?.products || 0} produto{(category._count?.products || 0) !== 1 ? 's' : ''}
                    </span>
                    <div className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs font-medium">
                      #{category.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Nova Loja */}
      {showNewStoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nova Loja</h3>
            
            <form onSubmit={handleCreateStore} className="space-y-4">
              <div>
                <label className="form-label">Nome da Loja</label>
                <input
                  type="text"
                  value={newStore.name}
                  onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                  className="input-base"
                  required
                  placeholder="Ex: MercadoLivre"
                />
              </div>
              
              <div>
                <label className="form-label">Domínio</label>
                <input
                  type="text"
                  value={newStore.domain}
                  onChange={(e) => setNewStore({...newStore, domain: e.target.value})}
                  className="input-base"
                  required
                  placeholder="Ex: https://www.mercadolivre.com.br ou mercadolivre.com.br"
                />
              </div>
              
              <div>
                <label className="form-label">Logo da Loja</label>
                <ImageUpload
                  value={newStore.logoUrl}
                  onChange={(imageUrl) => setNewStore({...newStore, logoUrl: imageUrl})}
                  placeholder="Selecionar logo da loja..."
                  maxSize={2 * 1024 * 1024} // 2MB para logos
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewStoreModal(false);
                    setNewStore({ name: '', domain: '', logoUrl: '' });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Criar Loja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Novo Produto */}
      {showNewProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Novo Produto</h3>
            
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="form-label">Título do Produto</label>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                  className="input-base"
                  required
                  placeholder="Ex: iPhone 15 Pro Max 256GB"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="input-base"
                    required
                    placeholder="2999.99"
                  />
                </div>
                
                <div>
                  <label className="form-label">Preço Original (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                    className="input-base"
                    placeholder="3499.99"
                  />
                </div>
              </div>
              
              {/* Novos campos para avaliação e vendas */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="form-label">Avaliação (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={newProduct.rating}
                    onChange={(e) => setNewProduct({...newProduct, rating: e.target.value})}
                    className="input-base"
                    placeholder="4.5"
                  />
                </div>
                
                <div>
                  <label className="form-label">Nº Avaliações</label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.reviewCount}
                    onChange={(e) => setNewProduct({...newProduct, reviewCount: e.target.value})}
                    className="input-base"
                    placeholder="150"
                  />
                </div>
                
                <div>
                  <label className="form-label">Vendidos</label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.soldCount}
                    onChange={(e) => setNewProduct({...newProduct, soldCount: e.target.value})}
                    className="input-base"
                    placeholder="500"
                  />
                </div>
              </div>
              
              {/* Checkboxes para frete e garantia */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="newFreeShipping"
                    checked={newProduct.freeShipping}
                    onChange={(e) => setNewProduct({...newProduct, freeShipping: e.target.checked})}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <label htmlFor="newFreeShipping" className="text-sm font-medium text-gray-700">
                    Frete Grátis
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="newWarranty"
                    checked={newProduct.warranty}
                    onChange={(e) => setNewProduct({...newProduct, warranty: e.target.checked})}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <label htmlFor="newWarranty" className="text-sm font-medium text-gray-700">
                    Garantia do Vendedor
                  </label>
                </div>
              </div>
              
              <div>
                <label className="form-label">Loja</label>
                <select
                  value={newProduct.storeId}
                  onChange={(e) => setNewProduct({...newProduct, storeId: e.target.value})}
                  className="input-base"
                  required
                >
                  <option value="">Selecione uma loja</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="form-label">Categorias (máximo 4)</label>
                <CategorySelector
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoriesChange={setSelectedCategories}
                  maxCategories={4}
                />
              </div>
              
              <div>
                <label className="form-label">Imagem do Produto</label>
                <ImageUpload
                  value={newProduct.imageUrl}
                  onChange={(imageUrl) => setNewProduct({...newProduct, imageUrl: imageUrl})}
                  placeholder="Selecionar imagem do produto..."
                  maxSize={5 * 1024 * 1024} // 5MB para produtos
                />
              </div>
              
              <div>
                <label className="form-label">URL de Afiliado</label>
                <input
                  type="url"
                  value={newProduct.affiliateUrl}
                  onChange={(e) => setNewProduct({...newProduct, affiliateUrl: e.target.value})}
                  className="input-base"
                  required
                  placeholder="https://mercadolivre.com/produto-afiliado"
                />
              </div>
              
              <div>
                <label className="form-label">Descrição (opcional)</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="input-base"
                  rows="3"
                  placeholder="Descrição do produto..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewProductModal(false);
                    setNewProduct({
                      title: '',
                      price: '',
                      originalPrice: '',
                      imageUrl: '',
                      affiliateUrl: '',
                      storeId: '',
                      category: '',
                      description: ''
                    });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Criar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Loja */}
      {showEditStoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Editar Loja</h3>
            
            <form onSubmit={handleUpdateStore} className="space-y-4">
              <div>
                <label className="form-label">Nome da Loja</label>
                <input
                  type="text"
                  value={editStore.name}
                  onChange={(e) => setEditStore({...editStore, name: e.target.value})}
                  className="input-base"
                  required
                  placeholder="Ex: MercadoLivre"
                />
              </div>
              
              <div>
                <label className="form-label">Domínio</label>
                <input
                  type="text"
                  value={editStore.domain}
                  onChange={(e) => setEditStore({...editStore, domain: e.target.value})}
                  className="input-base"
                  required
                  placeholder="Ex: https://www.mercadolivre.com.br ou mercadolivre.com.br"
                />
              </div>
              
              <div>
                <label className="form-label">Logo da Loja</label>
                <ImageUpload
                  value={editStore.logoUrl}
                  onChange={(imageUrl) => setEditStore({...editStore, logoUrl: imageUrl})}
                  placeholder="Selecionar logo da loja..."
                  maxSize={2 * 1024 * 1024} // 2MB para logos
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditStoreModal(false);
                    setEditStore({ id: '', name: '', domain: '', logoUrl: '' });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Produto */}
      {showEditProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Editar Produto</h3>
            
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="form-label">Título do Produto</label>
                <input
                  type="text"
                  value={editProduct.title}
                  onChange={(e) => setEditProduct({...editProduct, title: e.target.value})}
                  className="input-base"
                  required
                  placeholder="Ex: iPhone 15 Pro Max 256GB"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editProduct.price}
                    onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                    className="input-base"
                    required
                    placeholder="2999.99"
                  />
                </div>
                
                <div>
                  <label className="form-label">Preço Original (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editProduct.originalPrice}
                    onChange={(e) => setEditProduct({...editProduct, originalPrice: e.target.value})}
                    className="input-base"
                    placeholder="3499.99"
                  />
                </div>
              </div>
              
              {/* Novos campos para avaliação e vendas */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="form-label">Avaliação (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editProduct.rating}
                    onChange={(e) => setEditProduct({...editProduct, rating: e.target.value})}
                    className="input-base"
                    placeholder="4.5"
                  />
                </div>
                
                <div>
                  <label className="form-label">Nº Avaliações</label>
                  <input
                    type="number"
                    min="0"
                    value={editProduct.reviewCount}
                    onChange={(e) => setEditProduct({...editProduct, reviewCount: e.target.value})}
                    className="input-base"
                    placeholder="150"
                  />
                </div>
                
                <div>
                  <label className="form-label">Vendidos</label>
                  <input
                    type="number"
                    min="0"
                    value={editProduct.soldCount}
                    onChange={(e) => setEditProduct({...editProduct, soldCount: e.target.value})}
                    className="input-base"
                    placeholder="500"
                  />
                </div>
              </div>
              
              {/* Checkboxes para frete e garantia */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="editFreeShipping"
                    checked={editProduct.freeShipping}
                    onChange={(e) => setEditProduct({...editProduct, freeShipping: e.target.checked})}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <label htmlFor="editFreeShipping" className="text-sm font-medium text-gray-700">
                    Frete Grátis
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="editWarranty"
                    checked={editProduct.warranty}
                    onChange={(e) => setEditProduct({...editProduct, warranty: e.target.checked})}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <label htmlFor="editWarranty" className="text-sm font-medium text-gray-700">
                    Garantia do Vendedor
                  </label>
                </div>
              </div>
              
              <div>
                <label className="form-label">Loja</label>
                <select
                  value={editProduct.storeId}
                  onChange={(e) => setEditProduct({...editProduct, storeId: e.target.value})}
                  className="input-base"
                  required
                >
                  <option value="">Selecione uma loja</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="form-label">Categorias (máximo 4)</label>
                <CategorySelector
                  categories={categories}
                  selectedCategories={editSelectedCategories}
                  onCategoriesChange={setEditSelectedCategories}
                  maxCategories={4}
                />
              </div>
              
              <div>
                <label className="form-label">Imagem do Produto</label>
                <ImageUpload
                  value={editProduct.imageUrl}
                  onChange={(imageUrl) => setEditProduct({...editProduct, imageUrl: imageUrl})}
                  placeholder="Selecionar imagem do produto..."
                  maxSize={5 * 1024 * 1024} // 5MB para produtos
                />
              </div>
              
              <div>
                <label className="form-label">URL de Afiliado</label>
                <input
                  type="url"
                  value={editProduct.affiliateUrl}
                  onChange={(e) => setEditProduct({...editProduct, affiliateUrl: e.target.value})}
                  className="input-base"
                  required
                  placeholder="https://mercadolivre.com/produto-afiliado"
                />
              </div>
              
              <div>
                <label className="form-label">Descrição (opcional)</label>
                <textarea
                  value={editProduct.description}
                  onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                  className="input-base"
                  rows="3"
                  placeholder="Descrição do produto..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProductModal(false);
                    setEditProduct({
                      id: '',
                      title: '',
                      price: '',
                      originalPrice: '',
                      imageUrl: '',
                      affiliateUrl: '',
                      storeId: '',
                      category: '',
                      description: ''
                    });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nova Categoria */}
      {showNewCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nova Categoria</h3>
            
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="form-label">Nome da Categoria</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="input-base"
                  required
                  placeholder="Ex: Eletrônicos"
                />
              </div>
              
              <div>
                <label className="form-label">Descrição (opcional)</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  className="input-base resize-none"
                  rows="3"
                  placeholder="Descreva brevemente esta categoria"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategoryModal(false);
                    setNewCategory({ name: '', description: '' });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Criar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <FooterML />
    </div>
  );
};

export default AdminDashboard;