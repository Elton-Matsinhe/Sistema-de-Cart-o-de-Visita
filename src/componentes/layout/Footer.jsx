import React from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="text-lg font-bold mb-4">Sistema de Cartão Digital</h3>
            <p className="text-gray-400 text-sm">
              Solução completa para gerenciamento de cartões de visita digitais 
              com QR Code. Simplificando o compartilhamento de contatos.
            </p>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <FiMail className="w-4 h-4" />
                info@imperialinsurance-mz.com
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="w-4 h-4" />
                (+258) 841644096
              </li>
              <li className="flex items-center gap-2">
                <FiMapPin className="w-4 h-4" />
                Av. Kenneth Kaunda, N°806 (Sede) Maputo - Moçambique
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Documentação
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Suporte
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha de direitos autorais - agora lado a lado */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            {/* Primeira parte */}
            <div>
              <p>© {new Date().getFullYear()} Sistema de Cartão Digital. Todos os direitos reservados.</p>
            </div>
            
            {/* Separador visível apenas em mobile */}
            <div className="sm:hidden w-8 h-px bg-gray-700"></div>
            
            {/* Segunda parte */}
            <div>
              <p>© Desenvolvido pelo Departamento de IT.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;