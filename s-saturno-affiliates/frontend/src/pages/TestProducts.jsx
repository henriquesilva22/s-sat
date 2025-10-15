import React, { useState, useEffect } from 'react';

const TestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 [TEST] Buscando produtos...');
        
        const response = await fetch('http://localhost:3001/api/products');
        console.log('📊 [TEST] Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📋 [TEST] Dados:', data);
        
        if (data.success && data.data) {
          setProducts(data.data);
          console.log('✅ [TEST] Produtos definidos:', data.data.length);
        } else {
          throw new Error('Dados inválidos');
        }
      } catch (err) {
        console.error('❌ [TEST] Erro:', err);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log('🏁 [TEST] Loading finalizado');
      }
    };

    fetchProducts();
  }, []);

  console.log('🎯 [TEST] Renderização:', { loading, error, productsCount: products.length });

  if (loading) {
    return <div className="p-8 text-center">Carregando produtos de teste...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <h2>Erro: {error}</h2>
        <button onClick={() => window.location.reload()}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste de Produtos ({products.length})</h1>
      {products.length === 0 ? (
        <p>Nenhum produto encontrado</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded">
              <h3 className="font-bold">{product.title}</h3>
              <p>Preço: R$ {product.price}</p>
              <p>Loja: {product.store?.name || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestProducts;