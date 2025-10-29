// Teste de atualização de produto via API admin
const fetch = require('node-fetch');

async function testProductUpdate() {
  try {
    // 1. Primeiro fazer login para obter token admin
    console.log('🔑 Fazendo login admin...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.error('❌ Erro no login:', await loginResponse.text());
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login admin bem-sucedido, token obtido');

    // 2. Obter lista de produtos
    console.log('📦 Obtendo lista de produtos...');
    const productsResponse = await fetch('http://localhost:3001/api/admin/products', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!productsResponse.ok) {
      console.error('❌ Erro ao obter produtos:', await productsResponse.text());
      return;
    }

    const productsData = await productsResponse.json();
    const products = productsData.data;
    console.log(`✅ ${products.length} produtos encontrados`);

    if (products.length === 0) {
      console.log('❌ Nenhum produto disponível para teste');
      return;
    }

    // 3. Pegar o primeiro produto para teste
    const testProduct = products[0];
    console.log('🎯 Produto para teste:', {
      id: testProduct.id,
      title: testProduct.title,
      price: testProduct.price
    });

    // 4. Tentar atualizar o produto
    const updateData = {
      title: testProduct.title + ' (Atualizado)',
      price: testProduct.price,
      originalPrice: testProduct.originalPrice,
      imageUrl: testProduct.imageUrl || '',
      affiliateUrl: testProduct.affiliateUrl || '',
      storeId: testProduct.storeId,
      description: testProduct.description || 'Descrição de teste atualizada',
      rating: testProduct.rating,
      reviewCount: testProduct.reviewCount,
      soldCount: testProduct.soldCount,
      freeShipping: testProduct.freeShipping,
      warranty: testProduct.warranty,
      categoryIds: testProduct.categories?.map(cat => cat.category.id) || []
    };

    console.log('🔄 Tentando atualizar produto...');
    console.log('Dados de atualização:', updateData);

    const updateResponse = await fetch(`http://localhost:3001/api/admin/products/${testProduct.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    console.log('📊 Status da resposta:', {
      status: updateResponse.status,
      statusText: updateResponse.statusText,
      ok: updateResponse.ok
    });

    const responseText = await updateResponse.text();
    console.log('📝 Resposta do servidor:', responseText);

    if (updateResponse.ok) {
      const result = JSON.parse(responseText);
      console.log('✅ Produto atualizado com sucesso!');
      console.log('Resultado:', result);
    } else {
      console.error('❌ Erro na atualização do produto');
      try {
        const error = JSON.parse(responseText);
        console.error('Detalhes do erro:', error);
      } catch {
        console.error('Erro não JSON:', responseText);
      }
    }

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

// Executar teste
testProductUpdate();