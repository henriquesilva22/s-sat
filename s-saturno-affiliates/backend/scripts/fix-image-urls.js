const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixImageUrls() {
  try {
    console.log('🔄 Corrigindo URLs de imagens...');
    
    // Buscar produtos com URLs relativas
    const products = await prisma.product.findMany({
      where: {
        imageUrl: {
          startsWith: '/uploads/'
        }
      }
    });

    console.log(`📋 Encontrados ${products.length} produtos com URLs relativas`);

    const baseUrl = 'https://s-sat.onrender.com';

    for (const product of products) {
      const newImageUrl = `${baseUrl}${product.imageUrl}`;
      
      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl: newImageUrl }
      });

      console.log(`✅ Produto ${product.id} atualizado: ${product.imageUrl} → ${newImageUrl}`);
    }

    console.log('🎉 Todas as URLs foram corrigidas!');
  } catch (error) {
    console.error('❌ Erro ao corrigir URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixImageUrls();