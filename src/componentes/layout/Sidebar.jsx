import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiPlus, 
  FiSettings, 
  FiHelpCircle,
  FiX,
  FiMenu,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import logo from '../../assets/logo.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { to: '/', icon: FiHome, label: 'Dashboard', info: 'Visão geral do sistema' },
    { to: '/funcionarios', icon: FiUsers, label: 'Funcionários', info: 'Gerenciar funcionários' },
    { to: '/criar', icon: FiPlus, label: 'Criar Cartão', info: 'Adicionar novo cartão' },
    { to: '/configuracoes', icon: FiSettings, label: 'Configurações', info: 'Ajustes do sistema' },
    { to: '/ajuda', icon: FiHelpCircle, label: 'Ajuda', info: 'Suporte e documentação' },
  ];

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isOpen ? 'w-64' : 'lg:w-20'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header do Sidebar */}
          <div className={`flex items-center ${isOpen ? 'justify-between p-6' : 'justify-center py-6'} border-b border-gray-200`}>
            {isOpen ? (
              <>
                <div className="flex items-center gap-3">
                  <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                  <div>
                    <h2 className="font-bold text-lg text-gray-800">Cartão Digital</h2>
                    <p className="text-xs text-gray-500">Sistema de Gestão</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleSidebar}
                    className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Ocultar Menu"
                  >
                    <FiChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Fechar Menu"
                  >
                    <FiX className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                <button
                  onClick={toggleSidebar}
                  className="absolute -right-3 top-7 hidden lg:flex items-center justify-center w-6 h-6 bg-white rounded-full border border-gray-300 shadow-md hover:shadow-lg transition-all"
                  title="Mostrar Menu"
                >
                  <FiChevronRight className="w-3 h-3 text-gray-600" />
                </button>
              </>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                
                // Quando menu fechado, mostrar apenas ícones
                if (!isOpen) {
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={`flex items-center justify-center p-3 rounded-lg transition-all group ${
                          isActive
                            ? 'bg-gradient-to-r from-[#106a37] to-[#0d5a2c] text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        title={item.label}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#106a37]'}`} />
                      </Link>
                    </li>
                  );
                }

                // Quando menu aberto, mostrar ícone + texto
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          toggleSidebar();
                        }
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-[#106a37] to-[#0d5a2c] text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#106a37]'}`} />
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        {/* Texto da info com cor branca apenas quando ativo */}
                        <div className={`text-xs ${
                          isActive 
                            ? 'text-white/90'  // Cor branca com 90% de opacidade quando ativo
                            : 'text-gray-500'  // Cor cinza quando não ativo
                        }`}>
                          {item.info}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer do Sidebar (apenas quando aberto) */}
          {isOpen && (
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-[#106a37]/10 to-[#0d5a2c]/10 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-800 mb-1">
                  Sistema de Cartão Digital
                </p>
                <p className="text-xs text-gray-600">
                  Versão 1.0.0
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Botão para abrir sidebar em mobile */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 lg:hidden p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          <FiMenu className="w-6 h-6 text-gray-700" />
        </button>
      )}
    </>
  );
};

export default Sidebar;