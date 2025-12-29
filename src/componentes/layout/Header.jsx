import React, { useState, useEffect } from 'react';
import { 
  FiBell, 
  FiSearch, 
  FiUser, 
  FiSettings, 
  FiLogOut, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiX, 
  FiMail, 
  FiCalendar, 
  FiMenu, 
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiEdit2,
  FiTrash2
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ onToggleMenu, isMenuOpen }) => {
  const [horaAtual, setHoraAtual] = useState('');
  const [busca, setBusca] = useState('');
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Gerar saudação baseada no horário (fuso de Maputo, UTC+2)
  const getSaudacao = () => {
    const agora = new Date();
    // Ajustar para fuso horário de Maputo (UTC+2)
    const horaMaputo = new Date(agora.getTime() + (2 * 60 * 60 * 1000));
    const hora = horaMaputo.getUTCHours();
    
    if (hora >= 5 && hora < 12) return 'Bom dia';
    if (hora >= 12 && hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Formatar hora atual
  const formatarHora = () => {
    const agora = new Date();
    // Ajustar para fuso horário de Maputo (UTC+2)
    const horaMaputo = new Date(agora.getTime() + (2 * 60 * 60 * 1000));
    
    return horaMaputo.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'UTC'
    });
  };

  // Atualizar hora e saudação
  useEffect(() => {
    const atualizarHora = () => {
      const horaFormatada = formatarHora();
      setHoraAtual(horaFormatada);
    };

    // Atualizar imediatamente
    atualizarHora();
    
    // Atualizar a cada minuto
    const interval = setInterval(atualizarHora, 60000);

    // Carregar notificações fictícias
    const carregarNotificacoes = () => {
      const notifs = [
        {
          id: 1,
          tipo: 'sucesso',
          titulo: 'Cartão criado com sucesso',
          mensagem: 'O cartão de visita digital foi gerado',
          tempo: 'Há 5 minutos',
          lida: false,
          icon: FiCheckCircle
        },
        {
          id: 2,
          tipo: 'alerta',
          titulo: 'Novo funcionário adicionado',
          mensagem: 'Edna Mavie foi adicionada ao sistema',
          tempo: 'Há 2 horas',
          lida: false,
          icon: FiCheckCircle
        },
        {
          id: 3,
          tipo: 'info',
          titulo: 'Sistema atualizado',
          mensagem: 'Nova versão 1.0.0 disponível',
          tempo: 'Ontem',
          lida: true,
          icon: FiAlertCircle
        },
        {
          id: 4,
          tipo: 'info',
          titulo: 'Backup realizado',
          mensagem: 'Backup automático concluído com sucesso',
          tempo: '2 dias atrás',
          lida: true,
          icon: FiCalendar
        },
        {
          id: 5,
          tipo: 'sucesso',
          titulo: 'QR Code gerado',
          mensagem: 'QR Code de Elton Matsinhe gerado',
          tempo: 'Há 3 dias',
          lida: true,
          icon: FiDownload
        }
      ];
      setNotificacoes(notifs);
    };

    carregarNotificacoes();

    return () => clearInterval(interval);
  }, []);

  // Fechar menus quando clicar fora
  useEffect(() => {
    const fecharMenus = (e) => {
      if (!e.target.closest('.notificacoes-menu') && !e.target.closest('.notificacoes-btn')) {
        setMostrarNotificacoes(false);
      }
      if (!e.target.closest('.usuario-menu') && !e.target.closest('.usuario-btn')) {
        setMostrarMenuUsuario(false);
      }
    };

    document.addEventListener('click', fecharMenus);
    return () => document.removeEventListener('click', fecharMenus);
  }, []);

  // Função de busca dinâmica
  const handleBusca = (e) => {
    const valor = e.target.value;
    setBusca(valor);
    
    // Se estiver na página de funcionários, navega com query string
    if (valor && location.pathname === '/funcionarios') {
      navigate(`/funcionarios?busca=${encodeURIComponent(valor)}`);
    }
  };

  // Executar busca com Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && busca.trim()) {
      navigate(`/funcionarios?busca=${encodeURIComponent(busca)}`);
    }
  };

  // Limpar busca
  const limparBusca = () => {
    setBusca('');
    if (location.pathname === '/funcionarios') {
      navigate('/funcionarios');
    }
  };

  // Marcar notificação como lida
  const marcarComoLida = (id) => {
    setNotificacoes(notificacoes.map(notif => 
      notif.id === id ? { ...notif, lida: true } : notif
    ));
  };

  // Marcar todas como lidas
  const marcarTodasComoLidas = () => {
    setNotificacoes(notificacoes.map(notif => ({ ...notif, lida: true })));
  };

  // Excluir notificação
  const excluirNotificacao = (id) => {
    setNotificacoes(notificacoes.filter(notif => notif.id !== id));
  };

  // Excluir todas as notificações
  const excluirTodasNotificacoes = () => {
    if (window.confirm('Tem certeza que deseja excluir todas as notificações?')) {
      setNotificacoes([]);
      setMostrarNotificacoes(false);
    }
  };

  // Contar notificações não lidas
  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  // Logout
  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair do sistema?')) {
      console.log('Logout realizado');
      navigate('/login');
    }
  };

  // Toggle menu lateral
  const toggleMenu = () => {
    if (onToggleMenu) {
      onToggleMenu();
    }
  };

  // Função para determinar a cor baseada no tipo
  const getCorPorTipo = (tipo) => {
    switch(tipo) {
      case 'sucesso':
        return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-500' };
      case 'alerta':
        return { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-500' };
      case 'info':
        return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-500' };
    }
  };

  // Formatar tempo de notificação
  const formatarTempoNotificacao = (tempoTexto) => {
    return tempoTexto;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Botão de Menu e Saudação */}
        <div className="flex items-center gap-4">
          {/* Botão para abrir/fechar menu lateral (mobile) */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isMenuOpen ? "Fechar Menu" : "Abrir Menu"}
            aria-label={isMenuOpen ? "Fechar Menu" : "Abrir Menu"}
          >
            {isMenuOpen ? (
              <FiX className="w-5 h-5 text-gray-600" />
            ) : (
              <FiMenu className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Botão para ocultar/mostrar menu em desktop */}
          <button
            onClick={toggleMenu}
            className="hidden lg:flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isMenuOpen ? "Ocultar Menu" : "Mostrar Menu"}
            aria-label={isMenuOpen ? "Ocultar Menu" : "Mostrar Menu"}
          >
            {isMenuOpen ? (
              <FiChevronLeft className="w-5 h-5 text-gray-600" />
            ) : (
              <FiChevronRight className="w-5 h-5 text-gray-600" />
            )}
            <span className="text-sm text-gray-600 hidden xl:inline">
              {isMenuOpen ? 'Ocultar Menu' : 'Mostrar Menu'}
            </span>
          </button>

          {/* Saudação e Hora */}
          <div className="text-left">
            <p className="text-lg font-semibold text-gray-800">
              {getSaudacao()}, <span className="text-[#106a37]">Admin</span>
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span className="text-[#106a37] font-medium">{horaAtual}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Fuso Horário de Maputo</span>
            </p>
          </div>
        </div>

        {/* Busca Dinâmica */}
        <div className="flex-1 max-w-md hidden md:block mx-4 lg:mx-8">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={busca}
              onChange={handleBusca}
              onKeyPress={handleKeyPress}
              placeholder="Buscar funcionários, cartões, empresas..."
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
              aria-label="Campo de busca"
            />
            {busca && (
              <button
                onClick={limparBusca}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Limpar busca"
                aria-label="Limpar busca"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Ações do Header */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Busca Mobile */}
          <div className="md:hidden">
            <button 
              onClick={() => navigate('/funcionarios')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Buscar"
              aria-label="Buscar"
            >
              <FiSearch className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Notificações Funcionais */}
          <div className="relative">
            <button 
              onClick={() => setMostrarNotificacoes(!mostrarNotificacoes)}
              className="notificacoes-btn relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Notificações"
              aria-label="Notificações"
            >
              <FiBell className="w-5 h-5 text-gray-600" />
              {notificacoesNaoLidas > 0 && (
                <>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificacoesNaoLidas}
                  </span>
                </>
              )}
            </button>

            {/* Dropdown de Notificações */}
            {mostrarNotificacoes && (
              <div className="notificacoes-menu absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 text-lg">Notificações</h3>
                    <div className="flex items-center gap-2">
                      {notificacoesNaoLidas > 0 && (
                        <button
                          onClick={marcarTodasComoLidas}
                          className="text-sm text-[#106a37] hover:text-[#0d5a2c] font-medium px-2 py-1 hover:bg-[#106a37]/5 rounded transition-colors"
                        >
                          Marcar todas
                        </button>
                      )}
                      {notificacoes.length > 0 && (
                        <button
                          onClick={excluirTodasNotificacoes}
                          className="text-sm text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
                        >
                          Limpar
                        </button>
                      )}
                      <button
                        onClick={() => setMostrarNotificacoes(false)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Fechar notificações"
                        aria-label="Fechar notificações"
                      >
                        <FiX className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {notificacoes.length} notificaçõe(s) • {notificacoesNaoLidas} não lida(s)
                  </p>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notificacoes.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {notificacoes.map((notif) => {
                        const Icon = notif.icon;
                        const cor = getCorPorTipo(notif.tipo);
                        
                        return (
                          <div
                            key={notif.id}
                            className={`px-4 py-3 hover:bg-gray-50 transition-colors border-l-2 ${notif.lida ? 'border-transparent opacity-75' : cor.border}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${cor.bg} ${cor.text} flex-shrink-0`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                  <p className="font-medium text-gray-800 truncate">{notif.titulo}</p>
                                  <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {formatarTempoNotificacao(notif.tempo)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notif.mensagem}</p>
                                <div className="flex gap-2 mt-2">
                                  {!notif.lida && (
                                    <button
                                      onClick={() => marcarComoLida(notif.id)}
                                      className="text-xs text-[#106a37] hover:text-[#0d5a2c] font-medium px-2 py-1 hover:bg-[#106a37]/5 rounded transition-colors"
                                    >
                                      Marcar lida
                                    </button>
                                  )}
                                  <button
                                    onClick={() => excluirNotificacao(notif.id)}
                                    className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
                                  >
                                    Excluir
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <FiBell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">Nenhuma notificação</p>
                      <p className="text-sm text-gray-400 mt-1">As notificações aparecerão aqui</p>
                    </div>
                  )}
                </div>

                {notificacoes.length > 0 && (
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <button
                      onClick={() => {
                        navigate('/notificacoes');
                        setMostrarNotificacoes(false);
                      }}
                      className="w-full text-center text-sm text-[#106a37] hover:text-[#0d5a2c] font-medium py-2 hover:bg-[#106a37]/5 rounded-lg transition-colors"
                    >
                      Ver histórico completo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Perfil */}
          <div className="relative">
            <div 
              onClick={() => setMostrarMenuUsuario(!mostrarMenuUsuario)}
              className="usuario-btn flex items-center gap-3 cursor-pointer"
              aria-label="Menu do usuário"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">Departamento de IT</p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">info@imperialinsurance-mz.com</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#106a37] to-[#0d5a2c] flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-lg transition-shadow shadow-md hover:shadow-xl">
                <FiUser className="w-5 h-5" />
              </div>
            </div>

            {/* Dropdown do Usuário */}
            {mostrarMenuUsuario && (
              <div className="usuario-menu absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">Departamento de IT</p>
                    <p className="text-sm text-gray-500 truncate">info@imperialinsurance-mz.com</p>
                  </div>
                  <button
                    onClick={() => setMostrarMenuUsuario(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    title="Fechar menu"
                    aria-label="Fechar menu"
                  >
                    <FiX className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('/perfil');
                      setMostrarMenuUsuario(false);
                    }}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#106a37]/10 flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-[#106a37]" />
                    </div>
                    <div>
                      <p className="font-medium">Meu Perfil</p>
                      <p className="text-xs text-gray-500">Editar informações</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/configuracoes');
                      setMostrarMenuUsuario(false);
                    }}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#106a37]/10 flex items-center justify-center">
                      <FiSettings className="w-4 h-4 text-[#106a37]" />
                    </div>
                    <div>
                      <p className="font-medium">Configurações</p>
                      <p className="text-xs text-gray-500">Ajustes do sistema</p>
                    </div>
                  </button>
                </div>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <div className="px-1">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <FiLogOut className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Sair</p>
                      <p className="text-xs text-red-500">Encerrar sessão</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Busca Mobile (Full Width quando ativa) */}
      {busca && (
        <div className="md:hidden px-4 pb-4 animate-slide-down">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={busca}
              onChange={handleBusca}
              onKeyPress={handleKeyPress}
              placeholder="Digite para buscar..."
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
            />
            <button
              onClick={limparBusca}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Limpar busca"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;