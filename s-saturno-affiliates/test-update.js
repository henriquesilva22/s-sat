// Teste para verificar erro na atualização de produtos

const testUpdate = async () => {
  try {
    // Simular dados de um produto para atualizar
    const productData = {
      title: "Produto Teste",
      price: 99.99,
      description: "Descrição de teste para o produto",
      storeId: 1,
      imageUrl: "https://example.com/image.jpg",
      affiliateUrl: "https://example.com/affiliate",
      rating: 4.5,
      reviewCount: 100,
      soldCount: 50,
      freeShipping: true,
      warranty: true,
      categoryIds: [1, 2]
    };

    const response = await fetch('http://localhost:3001/api/admin/products/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify(productData)
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', result);

  } catch (error) {
    console.error('Erro no teste:', error);
  }
};

// Se executado diretamente
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testUpdate();
} else {
  // Browser environment
  console.log('Execute testUpdate() no console do browser');
}