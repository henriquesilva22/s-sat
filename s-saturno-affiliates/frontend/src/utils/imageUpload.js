/**
 * Funções utilitárias para upload de imagens
 * Este arquivo mostra exemplos de como você pode implementar upload real para o servidor
 */

/**
 * Exemplo de função para upload de imagem para o servidor
 * Você pode usar esta função no prop onUpload do componente ImageUpload
 */
import api from '../services/api';

export const uploadImageToServer = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    // Usar axios instance (api) que já tem baseURL configurada
    const response = await api.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (!response.data) {
      throw new Error('Resposta inválida do servidor');
    }

    return response.data.imageUrl; // Retorna a URL da imagem no servidor
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    throw error;
  }
};

/**
 * Exemplo de função para upload usando um serviço externo (ex: Cloudinary, AWS S3)
 */
export const uploadToCloudinary = async (file) => {
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/SEU_CLOUD_NAME/image/upload';
  const UPLOAD_PRESET = 'SEU_UPLOAD_PRESET';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    console.error('Erro ao fazer upload para Cloudinary:', error);
    throw error;
  }
};

/**
 * Função para redimensionar imagem antes do upload (otimização)
 */
export const resizeImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular novas dimensões mantendo proporção
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Desenhar imagem redimensionada
      ctx.drawImage(img, 0, 0, width, height);

      // Converter para blob
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Exemplo de como usar com redimensionamento
 */
export const uploadWithResize = async (file) => {
  try {
    // Redimensionar primeiro
    const resizedFile = await resizeImage(file, 800, 600, 0.8);
    
    // Depois fazer upload
    return await uploadImageToServer(resizedFile);
  } catch (error) {
    console.error('Erro no upload com redimensionamento:', error);
    throw error;
  }
};

// Exemplo de uso no AdminDashboard:
/*
import { uploadImageToServer, uploadWithResize } from '../utils/imageUpload';

// No formulário de produto/loja:
<ImageUpload
  value={newProduct.imageUrl}
  onChange={(imageUrl) => setNewProduct({...newProduct, imageUrl: imageUrl})}
  onUpload={uploadWithResize} // Usar função personalizada de upload
  placeholder="Selecionar imagem do produto..."
  maxSize={5 * 1024 * 1024}
/>
*/