// Teste de debug para atualização de produto no frontend
// Cole este código no console do navegador quando estiver no painel admin

// Função para testar a validação do frontend
function debugProductUpdate() {
  console.log('🔍 DEBUG: Testando validação de atualização de produto');
  
  // Simular dados de produto que podem estar causando erro
  const testCases = [
    {
      name: 'Preço inválido',
      data: {
        title: 'Produto Teste',
        price: 'abc', // String em vez de número
        storeId: '1',
        description: 'Descrição teste com mais de 10 caracteres',
        affiliateUrl: 'https://example.com'
      }
    },
    {
      name: 'StoreId inválido', 
      data: {
        title: 'Produto Teste',
        price: '100',
        storeId: 'abc', // String inválida
        description: 'Descrição teste com mais de 10 caracteres',
        affiliateUrl: 'https://example.com'
      }
    },
    {
      name: 'Título muito curto',
      data: {
        title: 'AB', // Menos de 3 caracteres
        price: '100',
        storeId: '1', 
        description: 'Descrição teste com mais de 10 caracteres',
        affiliateUrl: 'https://example.com'
      }
    },
    {
      name: 'Descrição muito curta',
      data: {
        title: 'Produto Teste',
        price: '100',
        storeId: '1',
        description: 'Curta', // Menos de 10 caracteres
        affiliateUrl: 'https://example.com'
      }
    }
  ];
  
  testCases.forEach(testCase => {
    console.log(`\n📋 Testando: ${testCase.name}`);
    
    // Simular validações do frontend
    const price = parseFloat(testCase.data.price);
    const storeId = parseInt(testCase.data.storeId);
    
    console.log('Valores convertidos:', {
      price,
      storeId,
      priceIsValid: !isNaN(price) && price > 0,
      storeIdIsValid: !isNaN(storeId) && storeId > 0
    });
    
    // Verificar validações
    if (isNaN(price) || price <= 0) {
      console.log('❌ ERRO: Preço deve ser um número válido e positivo');
    }
    
    if (isNaN(storeId) || storeId <= 0) {
      console.log('❌ ERRO: Loja deve ser selecionada');
    }
    
    if (!testCase.data.title || testCase.data.title.trim().length < 3) {
      console.log('❌ ERRO: Título deve ter pelo menos 3 caracteres');
    }
    
    if (!testCase.data.description || testCase.data.description.trim().length < 10) {
      console.log('❌ ERRO: Descrição deve ter pelo menos 10 caracteres');
    }
    
    console.log('✅ Teste concluído para:', testCase.name);
  });
  
  console.log('\n🔍 Para ver os dados atuais do formulário, execute: window.editProduct');
}

// Função para verificar o estado atual do formulário
function checkCurrentFormData() {
  if (typeof window.editProduct !== 'undefined') {
    console.log('📝 Dados atuais do formulário:', window.editProduct);
  } else {
    console.log('⚠️ Variável editProduct não encontrada. Certifique-se de estar na página de admin com modal aberto.');
  }
}

console.log('🚀 Funções de debug carregadas!');
console.log('Execute debugProductUpdate() para testar validações');
console.log('Execute checkCurrentFormData() para ver dados do formulário');