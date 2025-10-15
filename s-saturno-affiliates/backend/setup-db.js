const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando setup do banco PostgreSQL...');
  
  try {
    // 1. Fazer push do schema (criar tabelas)
    console.log('📋 Criando tabelas...');
    
    // 2. Verificar se as categorias já existem
    const categoryCount = await prisma.category.count();
    console.log(`📊 Categorias existentes: ${categoryCount}`);
    
    if (categoryCount === 0) {
      console.log('🏷️ Criando categorias iniciais...');
      
      await prisma.category.createMany({
        data: [
          {
            name: 'Eletrônicos',
            slug: 'eletronicos',
            description: 'Smartphones, notebooks, tablets e acessórios tecnológicos'
          },
          {
            name: 'Casa & Jardim',
            slug: 'casa-jardim',
            description: 'Produtos para casa, decoração, móveis e jardim'
          },
          {
            name: 'Beleza & Saúde',
            slug: 'beleza-saude',
            description: 'Cosméticos, produtos de cuidado pessoal e saúde'
          }
        ]
      });
    }
    
    // 3. Verificar se as lojas já existem
    const storeCount = await prisma.store.count();
    console.log(`🏪 Lojas existentes: ${storeCount}`);
    
    if (storeCount === 0) {
      console.log('🏪 Criando lojas iniciais...');
      
      await prisma.store.createMany({
        data: [
          {
            name: 'Amazon Brasil',
            description: 'A maior loja online do mundo',
            logoUrl: 'https://logo.clearbit.com/amazon.com.br',
            domain: 'amazon.com.br'
          },
          {
            name: 'Mercado Livre',
            description: 'Marketplace líder na América Latina',
            logoUrl: 'https://logo.clearbit.com/mercadolivre.com.br',
            domain: 'mercadolivre.com.br'
          }
        ]
      });
    }
    
    // 4. Verificar se produtos existem
    const productCount = await prisma.product.count();
    console.log(`📱 Produtos existentes: ${productCount}`);
    
    if (productCount === 0) {
      console.log('📱 Criando produtos iniciais...');
      
      const amazon = await prisma.store.findFirst({ where: { domain: 'amazon.com.br' } });
      const mercado = await prisma.store.findFirst({ where: { domain: 'mercadolivre.com.br' } });
      const eletronicos = await prisma.category.findFirst({ where: { slug: 'eletronicos' } });
      
      if (amazon && mercado && eletronicos) {
        await prisma.product.createMany({
          data: [
            {
              title: 'iPhone 15 128GB',
              description: 'Novo iPhone 15 com USB-C, câmera de 48MP e chip A16 Bionic',
              price: 4999.00,
              imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=250&h=250&fit=crop',
              affiliateUrl: 'https://amzn.to/example1',
              stock: 15,
              tags: 'iphone,apple,smartphone',
              storeId: amazon.id
            },
            {
              title: 'Samsung Galaxy S24',
              description: 'Galaxy S24 com AI, câmera tripla e tela Dynamic AMOLED 2X',
              price: 3899.00,
              imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=250&h=250&fit=crop',
              affiliateUrl: 'https://mercado.ml/example2',
              stock: 12,
              tags: 'samsung,galaxy,android',
              storeId: mercado.id
            }
          ]
        });
        
        // Criar relacionamentos produto-categoria
        const products = await prisma.product.findMany();
        for (const product of products) {
          await prisma.productCategory.create({
            data: {
              productId: product.id,
              categoryId: eletronicos.id
            }
          });
        }
      }
    }
    
    console.log('✅ Setup do banco concluído com sucesso!');
    
    // Estatísticas finais
    const stats = {
      categories: await prisma.category.count(),
      stores: await prisma.store.count(),
      products: await prisma.product.count()
    };
    
    console.log('📊 Estatísticas do banco:', stats);
    
  } catch (error) {
    console.error('❌ Erro no setup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();