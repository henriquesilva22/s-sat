import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

/**
 * Componente simplificado para upload de imagens
 */
const ImageUpload = ({ 
  value, 
  onChange, 
  placeholder = "Selecionar imagem...",
  maxSize = 5 * 1024 * 1024, // 5MB por padrão
  className = ""
}) => {
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Atualizar preview quando value muda
  useEffect(() => {
    setPreview(value || '');
  }, [value]);

  /**
   * Converte arquivo para Base64
   */
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  /**
   * Processa o arquivo selecionado
   */
  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho do arquivo
    if (file.size > maxSize) {
      alert(`Arquivo muito grande. O tamanho máximo é ${Math.round(maxSize / 1024 / 1024)}MB.`);
      return;
    }

    try {
      setUploading(true);
      
      // Converter para Base64
      const base64 = await fileToBase64(file);
      setPreview(base64);
      onChange(base64);
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      alert('Erro ao processar a imagem. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  /**
   * Handler para input de arquivo
   */
  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  /**
   * Handler para URL manual
   */
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setPreview(url);
    onChange(url);
  };

  /**
   * Limpar imagem
   */
  const handleClear = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Área de Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        {preview ? (
          <div className="relative inline-block">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-full max-h-32 rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="text-gray-500">
            <ImageIcon className="mx-auto h-12 w-12 mb-2" />
            <p className="mb-2">Clique para selecionar uma imagem</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
              disabled={uploading}
            >
              <Upload size={16} />
              {uploading ? 'Processando...' : 'Selecionar Arquivo'}
            </button>
          </div>
        )}
      </div>

      {/* Input de arquivo (oculto) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Input de URL alternativo */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Ou insira a URL da imagem:
        </label>
        <input
          type="text"
          value={value || ''}
          onChange={handleUrlChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>

      {/* Informações sobre o upload */}
      <p className="text-xs text-gray-500">
        Formatos aceitos: JPG, PNG, GIF, WebP. Tamanho máximo: {Math.round(maxSize / 1024 / 1024)}MB
      </p>
    </div>
  );
};

export default ImageUpload;