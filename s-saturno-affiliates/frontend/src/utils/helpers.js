import { clsx } from 'clsx'

/**
 * Utility function for combining class names
 * @param {...any} inputs - Class names to combine
 * @returns {string} Combined class names
 */
export function cn(...inputs) {
  return clsx(inputs)
}

/**
 * Formatar preço em reais brasileiros
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number') {
    price = parseFloat(price) || 0;
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

/**
 * Formatar data em português brasileiro
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString('pt-BR', defaultOptions);
};

/**
 * Formatar data de forma relativa (ex: "há 2 horas")
 */
export const formatRelativeDate = (date) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now - targetDate) / 1000);
  
  if (diffInSeconds < 60) {
    return 'agora mesmo';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `há ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
  }
  
  return formatDate(date, { day: 'numeric', month: 'short', year: 'numeric' });
};

/**
 * Truncar texto com reticências
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Slugify texto (converter para URL amigável)
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Substituir espaços e caracteres especiais por hífen
    .replace(/^-+|-+$/g, ''); // Remover hífens do início e fim
};

/**
 * Validar URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Extrair domínio de uma URL
 */
export const extractDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return '';
  }
};

/**
 * Debounce - atrasar execução de função
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Gerar ID único simples
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Verificar se é dispositivo móvel
 */
export const isMobile = () => {
  return window.innerWidth <= 768;
};

/**
 * Scroll suave para elemento
 */
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Copiar texto para clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback para navegadores mais antigos
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

/**
 * Validar email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Formatar número com separadores de milhares
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('pt-BR').format(number);
};

/**
 * Calcular percentual de desconto
 */
export const calculateDiscount = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) {
    return 0;
  }
  
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
};

/**
 * Gerar cores aleatórias para avatars/placeholders
 */
export const generateRandomColor = () => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Throttle - limitar frequência de execução de função
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Obter iniciais de um nome
 */
export const getInitials = (name) => {
  if (!name) return '??';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

/**
 * Converter tags string para array
 */
export const stringToTags = (tagsString) => {
  if (!tagsString) return [];
  
  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
};

/**
 * Converter array de tags para string
 */
export const tagsToString = (tagsArray) => {
  if (!Array.isArray(tagsArray)) return '';
  
  return tagsArray.join(', ');
};