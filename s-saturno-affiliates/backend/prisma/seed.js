const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Script de seed para popu    {
      title: 'Fone de Ouvido Bluetooth JBL Tune 510BT',
      description: 'Fone de ouvido sem fio com qualidade de som JBL Pure Bass, até 40 horas de bateria e controle por voz. Dobrável e confortável.',
      price: 199.90,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=250&h=250&fit=crop',
      affiliateUrl: 'https://amzn.to/3QBcDef',
      stock: 30,
      tags: 'fone,bluetooth,jbl,áudio,música',
      storeId: amazonStore.id,
      categoryIds: [categoryMap['eletronicos']]
    },o com dados de exemplo
 * Cria 2 lojas e 8 produtos diversos para demonstração
 */
async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');
  
  // Criar categorias de exemplo
  console.log('🏷️ Criando categorias...');
  
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'eletronicos' },
      update: {},
      create: {
        name: 'Eletrônicos',
        slug: 'eletronicos',
        description: 'Smartphones, notebooks, tablets e acessórios tecnológicos'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'casa-jardim' },
      update: {},
      create: {
        name: 'Casa & Jardim',
        slug: 'casa-jardim',
        description: 'Produtos para casa, decoração, móveis e jardim'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'beleza-saude' },
      update: {},
      create: {
        name: 'Beleza & Saúde',
        slug: 'beleza-saude',
        description: 'Cosméticos, produtos de cuidado pessoal e saúde'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'roupas-acessorios' },
      update: {},
      create: {
        name: 'Roupas & Acessórios',
        slug: 'roupas-acessorios',
        description: 'Vestuário masculino, feminino e acessórios de moda'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'esportes-lazer' },
      update: {},
      create: {
        name: 'Esportes & Lazer',
        slug: 'esportes-lazer',
        description: 'Produtos esportivos, fitness e atividades de lazer'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'automotivo' },
      update: {},
      create: {
        name: 'Automotivo',
        slug: 'automotivo',
        description: 'Peças, acessórios e produtos para veículos'
      }
    })
  ]);

  console.log('✅ Categorias criadas:', categories.map(c => c.name).join(', '));
  
  // Criar lojas de exemplo
  console.log('📦 Criando lojas...');
  
  const aliExpressStore = await prisma.store.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'AliExpress',
      description: 'A maior plataforma de comércio eletrônico do mundo com produtos direto da China',
      logoUrl: 'https://ae01.alicdn.com/kf/S8feb695e393942b2a841c2a2b6f047e8X/240x240.png',
      domain: 'aliexpress.com'
    }
  });

  const amazonStore = await prisma.store.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Amazon Brasil',
      description: 'A maior loja online do Brasil com entrega rápida e produtos de qualidade',
      logoUrl: 'https://m.media-amazon.com/images/G/32/gc/designs/livepreview/amazon_dkblue_noto_email_v2016_us-main._CB468775337_.png',
      domain: 'amazon.com.br'
    }
  });

  const mercadoLivreStore = await prisma.store.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Mercado Livre',
      description: 'Marketplace líder na América Latina com variedade de produtos',
      logoUrl: 'https://http2.mlstatic.com/frontend-assets/ui-navigation/5.18.9/mercadolibre/logo__small@2x.png',
      domain: 'mercadolivre.com.br'
    }
  });

  console.log('✅ Lojas criadas: AliExpress, Amazon Brasil e Mercado Livre');

  // Criar produtos de exemplo
  console.log('🛍️ Criando produtos...');

  // Mapear categorias por slug para facilitar associação
  const categoryMap = {
    'eletronicos': categories.find(c => c.slug === 'eletronicos').id,
    'casa-jardim': categories.find(c => c.slug === 'casa-jardim').id,
    'beleza-saude': categories.find(c => c.slug === 'beleza-saude').id,
    'roupas-acessorios': categories.find(c => c.slug === 'roupas-acessorios').id,
    'esportes-lazer': categories.find(c => c.slug === 'esportes-lazer').id,
    'automotivo': categories.find(c => c.slug === 'automotivo').id
  };

  const products = [
    {
      title: 'Smartphone Xiaomi Redmi Note 12 Pro 256GB',
      description: 'Smartphone com câmera profissional de 50MP, processador MediaTek Dimensity 1080 e bateria de 5000mAh. Tela AMOLED de 6.67" com taxa de atualização de 120Hz.',
      price: 899.99,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=250&h=250&fit=crop',
      affiliateUrl: 'https://s.click.aliexpress.com/e/_DkXxGHr',
      stock: 50,
      tags: 'smartphone,eletrônicos,xiaomi,tecnologia',
      storeId: aliExpressStore.id,
      categoryIds: [categoryMap['eletronicos']]
    },
    {
      title: 'Fone de Ouvido Bluetooth JBL Tune 510BT',
      description: 'Fone de ouvido sem fio com qualidade de som JBL Pure Bass, até 40 horas de bateria e controle por voz. Dobrável e confortável.',
      price: 199.90,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=250&h=250&fit=crop',
      affiliateUrl: 'https://amzn.to/3QBcDef',
      stock: 30,
      tags: 'fone,áudio,bluetooth,jbl,música',
      storeId: amazonStore.id,
      categoryIds: [categoryMap['eletronicos']]
    },
    {
      title: 'Aspirador de Pó Robô Xiaomi Mi Robot Vacuum',
      description: 'Robô aspirador inteligente com mapeamento a laser, controle via app, bateria de 5200mAh e potência de 2100Pa. Ideal para limpeza automática.',
      price: 1299.00,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=250&h=250&fit=crop',
      affiliateUrl: 'https://s.click.aliexpress.com/e/_DmXvBzn',
      stock: 15,
      tags: 'aspirador,robô,limpeza,casa,xiaomi',
      storeId: aliExpressStore.id,
      categoryIds: [categoryMap['eletronicos'], categoryMap['casa-jardim']]
    },
    {
      title: 'Cafeteira Elétrica Mondial Premium CF-32',
      description: 'Cafeteira elétrica com capacidade para 32 xícaras, sistema corta-pingos, filtro permanente e aquecimento automático. Design elegante.',
      price: 129.90,
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=250&h=250&fit=crop',
      affiliateUrl: 'https://amzn.to/3ZxYw2Q',
      stock: 25,
      tags: 'cafeteira,café,cozinha,mondial,eletrodoméstico',
      storeId: amazonStore.id,
      categoryIds: [categoryMap['casa-jardim'], categoryMap['eletronicos']]
    },
    {
      title: 'Smartwatch Amazfit GTR 4 GPS 46mm',
      description: 'Relógio inteligente com GPS integrado, monitoramento de saúde 24/7, mais de 150 modos esportivos e bateria de até 14 dias.',
      price: 699.00,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=250&h=250&fit=crop',
      affiliateUrl: 'https://s.click.aliexpress.com/e/_DD123Kl',
      stock: 20,
      tags: 'smartwatch,relógio,fitness,gps,amazfit',
      storeId: aliExpressStore.id,
      categoryIds: [categoryMap['eletronicos'], categoryMap['esportes-lazer'], categoryMap['beleza-saude']]
    },
    {
      title: 'Kit Gamer: Teclado e Mouse Redragon',
      description: 'Combo gamer com teclado mecânico RGB Kumara K552 e mouse Centrophorus M601. Switches Blue, retroiluminado e alta precisão.',
      price: 289.90,
      imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=250&h=250&fit=crop',
      affiliateUrl: 'https://amzn.to/3YpQrSt',
      stock: 40,
      tags: 'teclado,mouse,gamer,redragon,rgb',
      storeId: amazonStore.id,
      categoryIds: [categoryMap['eletronicos']]
    },
    {
      title: 'Câmera de Segurança WiFi 360° Xiaomi Mi Home',
      description: 'Câmera de segurança inteligente com rotação 360°, visão noturna, detecção de movimento e gravação em nuvem. Controle via app.',
      price: 159.99,
      imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=250&h=250&fit=crop',
      affiliateUrl: 'https://s.click.aliexpress.com/e/_DeFgHiJ',
      stock: 35,
      tags: 'câmera,segurança,wifi,xiaomi,vigilância',
      storeId: aliExpressStore.id,
      categoryIds: [categoryMap['eletronicos'], categoryMap['casa-jardim']]
    },
    {
      title: 'Air Fryer Mondial Family AF-30 3.5L',
      description: 'Fritadeira elétrica sem óleo, capacidade 3.5L, controle de temperatura até 200°C, timer 30min. Cozinha saudável para toda família.',
      price: 249.90,
      imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=250&h=250&fit=crop',
      affiliateUrl: 'https://amzn.to/3QnMxYz',
      stock: 18,
      tags: 'airfryer,fritadeira,cozinha,mondial,saúde',
      storeId: amazonStore.id,
      categoryIds: [categoryMap['casa-jardim'], categoryMap['beleza-saude']]
    },
    {
      title: 'Tênis Nike Revolution 6 Running',
      description: 'Tênis para corrida Nike Revolution 6 unissex. Solado em espuma macia, cabedal respirável e design moderno. Ideal para exercícios e uso casual.',
      price: 259.90,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=250&h=250&fit=crop',
      affiliateUrl: 'https://mercadolivre.com/mlb987654321',
      stock: 45,
      tags: 'tênis,nike,esporte,corrida,unissex',
      storeId: mercadoLivreStore.id,
      categoryIds: [categoryMap['roupas-acessorios'], categoryMap['esportes-lazer']]
    },
    {
      title: 'Perfume Importado One Million 100ml',
      description: 'Perfume masculino One Million Paco Rabanne 100ml. Fragrância marcante e sofisticada, ideal para o dia a dia e ocasiões especiais.',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=250&h=250&fit=crop',
      affiliateUrl: 'https://mercadolivre.com/mlb123456789',
      stock: 22,
      tags: 'perfume,one million,paco rabanne,masculino,importado',
      storeId: mercadoLivreStore.id,
      categoryIds: [categoryMap['beleza-saude']]
    }
  ];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const { categoryIds, ...productData } = product;
    
    // Primeiro criar o produto sem categorias
    const createdProduct = await prisma.product.upsert({
      where: { 
        id: i + 1 // Usar ID sequencial
      },
      update: productData,
      create: {
        ...productData,
        id: i + 1
      }
    });

    // Depois conectar às categorias se existirem
    if (categoryIds && categoryIds.length > 0) {
      for (const categoryId of categoryIds) {
        await prisma.productCategory.upsert({
          where: {
            productId_categoryId: {
              productId: createdProduct.id,
              categoryId: categoryId
            }
          },
          update: {},
          create: {
            productId: createdProduct.id,
            categoryId: categoryId
          }
        });
      }
    }
    
    console.log(`✅ Produto criado: ${product.title}`);
  }

  console.log('🎉 Seed concluído com sucesso!');
  console.log(`📊 Criadas ${products.length} produtos em 2 lojas`);
  console.log('🔐 Use a senha "admin123" para acessar o painel administrativo');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });