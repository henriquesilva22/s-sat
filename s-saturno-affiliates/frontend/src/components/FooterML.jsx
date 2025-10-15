import React, { useState } from 'react'
import { 
  Facebook, 
  Instagram, 
  Twitter,
  Mail,
  Phone,
  Shield,
  BarChart3
} from 'lucide-react'

const FooterML = () => {
  const currentYear = new Date().getFullYear();
  const [clickCount, setClickCount] = useState(0);

  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 5) {
      window.location.href = '/admin';
    } else if (newCount >= 3) {
      console.log(`🔓 ${5 - newCount} cliques restantes para acessar área admin`);
    }
    
    // Reset após 3 segundos
    setTimeout(() => setClickCount(0), 3000);
  };

  return (
    <footer className="bg-gray-900 text-white mt-12">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">S-Saturno Affiliates</h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Sua plataforma de afiliados confiável. Encontre os melhores produtos com as melhores ofertas.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Links Úteis</h4>
            <nav className="flex flex-col space-y-2">
              <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                Início
              </a>
              <a href="/categorias" className="text-gray-400 hover:text-white transition-colors text-sm">
                Categorias
              </a>
              <a href="/ajuda" className="text-gray-400 hover:text-white transition-colors text-sm">
                Ajuda
              </a>
              <a href="/contato" className="text-gray-400 hover:text-white transition-colors text-sm">
                Contato
              </a>
            </nav>
          </div>

          {/* Contact & Admin */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contato</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={14} />
                <span>ssaturnoempresa@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={14} />
                <span>(19) 99759-1614</span>
              </div>
              <a 
                href="https://www.facebook.com/profile.php?id=61581525184925" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 text-sm transition-colors"
              >
                <Facebook size={14} />
                <span>Fale conosco pelo Facebook</span>
              </a>
            </div>


          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>© {currentYear} S-Saturno Affiliates. Todos os direitos reservados.</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Shield size={14} />
                <span>Compra Segura</span>
              </div>
              <div className="text-gray-400">
                <span 
                  onClick={handleSecretClick}
                  style={{ cursor: 'default' }}
                  title={clickCount >= 3 ? `${5 - clickCount} cliques restantes` : ''}
                >
                  Feito no Brasil
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterML