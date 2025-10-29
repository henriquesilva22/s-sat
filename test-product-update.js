const fetch = require('node-fetch');

async function testProductUpdate() {
  try {
    // Primeiro, fazer login para obter o token
    const loginResponse = await fetch('http://localhost:3001/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Erro no login');
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    console.log('✅ Login realizado com sucesso');

    // Agora testar update de produto (usando ID 36 que vimos na API)
    const updateData = {
      title: 'iPhone Teste Atualizado',
      price: 1500,
      description: 'Teste de atualização de produto'
    };

    console.log('🔄 Testando update de produto...');
    console.log('📝 Dados:', updateData);

    const updateResponse = await fetch('http://localhost:3001/api/admin/products/36', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    console.log('📊 Status da resposta:', updateResponse.status);
    
    const responseText = await updateResponse.text();
    console.log('📋 Resposta completa:', responseText);

    if (updateResponse.ok) {
      console.log('✅ Update realizado com sucesso!');
    } else {
      console.log('❌ Erro no update');
    }

  } catch (error) {
    console.error('💥 Erro durante o teste:', error);
  }
}

testProductUpdate();