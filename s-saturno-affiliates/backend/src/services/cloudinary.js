const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload de imagem para Cloudinary
 * @param {string} imageBase64 - Imagem em base64
 * @param {string} folder - Pasta no Cloudinary
 * @param {string} publicId - ID público da imagem
 * @returns {Promise<string>} URL da imagem
 */
async function uploadToCloudinary(imageBase64, folder = 'products', publicId = null) {
  try {
    console.log('☁️ [CLOUDINARY] Iniciando upload...');
    
    const uploadOptions = {
      folder: `s-saturno/${folder}`,
      resource_type: 'image',
      format: 'webp', // Converter para WebP para otimização
      quality: 'auto:good',
      fetch_format: 'auto',
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
      uploadOptions.overwrite = true;
    }

    const result = await cloudinary.uploader.upload(imageBase64, uploadOptions);
    
    console.log('✅ [CLOUDINARY] Upload concluído:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error('❌ [CLOUDINARY] Erro no upload:', error);
    throw new Error('Falha no upload da imagem');
  }
}

/**
 * Deletar imagem do Cloudinary
 * @param {string} imageUrl - URL da imagem
 * @returns {Promise<boolean>} Sucesso
 */
async function deleteFromCloudinary(imageUrl) {
  try {
    // Extrair public_id da URL
    const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
    
    const result = await cloudinary.uploader.destroy(`s-saturno/${publicId}`);
    console.log('🗑️ [CLOUDINARY] Imagem deletada:', publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('❌ [CLOUDINARY] Erro ao deletar:', error);
    return false;
  }
}

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  cloudinary
};