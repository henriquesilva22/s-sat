/**
 * Exemplo de como usar upload real no AdminDashboard
 * Se você quiser usar upload para o servidor em vez de Base64
 */

// No início do arquivo AdminDashboard.jsx, adicione:
// import { uploadImageToServer, uploadWithResize } from '../utils/imageUpload';

// Exemplo de uso nos formulários:

/*
// Para upload simples (sem redimensionamento):
<ImageUpload
  value={newProduct.imageUrl}
  onChange={(imageUrl) => setNewProduct({...newProduct, imageUrl: imageUrl})}
  onUpload={uploadImageToServer} // Usar função de upload real
  placeholder="Selecionar imagem do produto..."
  maxSize={5 * 1024 * 1024}
/>

// Para upload com redimensionamento automático:
<ImageUpload
  value={newProduct.imageUrl}
  onChange={(imageUrl) => setNewProduct({...newProduct, imageUrl: imageUrl})}
  onUpload={uploadWithResize} // Usar função com redimensionamento
  placeholder="Selecionar imagem do produto..."
  maxSize={5 * 1024 * 1024}
/>

// Para usar apenas Base64 (configuração atual - não precisa de servidor):
<ImageUpload
  value={newProduct.imageUrl}
  onChange={(imageUrl) => setNewProduct({...newProduct, imageUrl: imageUrl})}
  // Sem onUpload = usa Base64 automaticamente
  placeholder="Selecionar imagem do produto..."
  maxSize={5 * 1024 * 1024}
/>
*/

/**
 * CONFIGURAÇÃO ATUAL (Base64):
 * - As imagens são convertidas para Base64 e armazenadas diretamente no banco
 * - Vantagem: Funciona sem configuração adicional
 * - Desvantagem: Aumenta o tamanho do banco de dados
 * 
 * CONFIGURAÇÃO COM UPLOAD REAL:
 * - As imagens são salvas no servidor em /uploads/images/
 * - Apenas a URL é armazenada no banco de dados
 * - Vantagem: Banco menor, melhor performance
 * - Desvantagem: Precisa gerenciar arquivos no servidor
 */

export default {};