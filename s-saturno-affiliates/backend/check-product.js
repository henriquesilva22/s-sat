// Script para verificar produto no banco
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProduct() {
  try {
    console.log('🔍 Verificando produto ID 11...');
    
    const product = await prisma.product.findUnique({
      where: { id: 11 },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (product) {
      console.log('📋 Produto encontrado:');
      console.log('- ID:', product.id);
      console.log('- Título:', product.title);
      console.log('- Tamanho imageUrl:', product.imageUrl?.length || 0, 'caracteres');
      console.log('- Prefixo imageUrl:', product.imageUrl?.substring(0, 100));
      console.log('- Criado em:', product.createdAt);
      console.log('- Atualizado em:', product.updatedAt);
      
      // Verificar se é base64
      const isBase64 = product.imageUrl?.startsWith('data:image/');
      console.log('- É imagem base64:', isBase64);
      
    } else {
      console.log('❌ Produto não encontrado');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProduct();