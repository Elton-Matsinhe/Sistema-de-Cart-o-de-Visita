import React, { useState } from 'react';
import { FiHelpCircle, FiBook, FiMessageCircle, FiVideo, FiExternalLink } from 'react-icons/fi';
import { Helmet } from 'react-helmet';
import logoEmpresa from '../assets/logo.png'; // Caminho corrigido para assets

const Ajuda = () => {
  const [showDocMessage, setShowDocMessage] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  // Perguntas e respostas do FAQ
  const faqItems = [
    {
      pergunta: "Como faço para criar uma nova conta no sistema?",
      resposta: "Para criar uma nova conta, clique no botão 'Registrar' na página inicial, preencha os dados solicitados e confirme seu e-mail através do link enviado."
    },
    {
      pergunta: "Esqueci minha senha, como recuperar?",
      resposta: "Na tela de login, clique em 'Esqueci minha senha', insira seu e-mail cadastrado e siga as instruções enviadas para criar uma nova senha."
    },
    {
      pergunta: "Como atualizar minhas informações de perfil?",
      resposta: "Acesse 'Meu Perfil' no menu superior, clique em 'Editar' e salve as alterações desejadas."
    },
    {
      pergunta: "O sistema é compatível com dispositivos móveis?",
      resposta: "Sim, nosso sistema é totalmente responsivo e funciona perfeitamente em smartphones e tablets."
    },
    {
      pergunta: "Como faço para exportar relatórios?",
      resposta: "Na seção de relatórios, selecione os filtros desejados e clique no botão 'Exportar'. Você pode escolher entre PDF, Excel ou CSV."
    },
    {
      pergunta: "Qual é o horário de suporte?",
      resposta: "Nosso suporte funciona de segunda a sexta, das 8h às 18h, através do WhatsApp ou e-mail."
    },
    {
      pergunta: "Posso acessar o sistema de diferentes dispositivos?",
      resposta: "Sim, você pode acessar sua conta de qualquer dispositivo com conexão à internet."
    },
    {
      pergunta: "Como faço para cancelar minha assinatura?",
      resposta: "Acesse 'Configurações da Conta' > 'Assinatura' e clique em 'Cancelar Assinatura'. O acesso será mantido até o fim do período contratado."
    },
    {
      pergunta: "O sistema oferece backup dos meus dados?",
      resposta: "Sim, realizamos backups diários automáticos de todos os dados do sistema."
    },
    {
      pergunta: "Como entrar em contato com o suporte técnico?",
      resposta: "Você pode usar o botão 'Abrir Chat' nesta página para conversar via WhatsApp ou enviar e-mail para suporte@empresa.com."
    }
  ];

  const handleDocumentacaoClick = () => {
    setShowDocMessage(true);
    setTimeout(() => setShowDocMessage(false), 3000);
  };

  const handleSuporteClick = () => {
    const mensagemPadrao = encodeURIComponent("Olá! Preciso de ajuda com o sistema.");
    const numeroWhatsApp = "841644096";
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagemPadrao}`, '_blank');
  };

  const handleTutoriaisClick = () => {
    window.open('https://www.youtube.com/@TudosobreProgramacao-hacker/videos', '_blank');
  };

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <link rel="icon" href={logoEmpresa} />
        <title>Ajuda e Suporte | Sistema</title>
      </Helmet>

      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-[#106a37]">
            Ajuda e Suporte
          </h1>
          <p className="text-gray-600">
            Encontre respostas para suas dúvidas
          </p>
        </div>

        {/* Mensagem temporária para documentação */}
        {showDocMessage && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiBook className="text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-blue-700">
                  A documentação está em desenvolvimento e estará disponível em breve!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Documentação */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiBook className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Documentação</h3>
                <p className="text-sm text-gray-600">Guia completo do sistema</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Acesse a documentação completa para aprender a usar todas as funcionalidades.
            </p>
            <button 
              onClick={handleDocumentacaoClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium flex items-center gap-2"
            >
              Acessar Documentação
              <FiExternalLink />
            </button>
          </div>

          {/* Suporte WhatsApp */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiMessageCircle className="text-green-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Suporte</h3>
                <p className="text-sm text-gray-600">Entre em contato conosco</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Precisa de ajuda? Nossa equipe está pronta para ajudar você.
            </p>
            <button 
              onClick={handleSuporteClick}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium flex items-center gap-2"
            >
              Abrir Chat no WhatsApp
              <FiExternalLink />
            </button>
          </div>

          {/* Tutoriais YouTube */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiVideo className="text-purple-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Tutoriais</h3>
                <p className="text-sm text-gray-600">Vídeos explicativos</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Assista aos tutoriais em vídeo para aprender rapidamente.
            </p>
            <button 
              onClick={handleTutoriaisClick}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-medium flex items-center gap-2"
            >
              Ver Tutoriais no YouTube
              <FiExternalLink />
            </button>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiHelpCircle className="text-orange-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg">FAQ</h3>
                <p className="text-sm text-gray-600">Perguntas frequentes</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Encontre respostas para as perguntas mais comuns.
            </p>
            <button 
              onClick={() => setFaqOpen(faqOpen === 0 ? null : 0)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all text-sm font-medium"
            >
              {faqOpen !== null ? 'Fechar FAQ' : 'Ver FAQ'}
            </button>
          </div>
        </div>

        {/* Seção FAQ Expandida */}
        {faqOpen !== null && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Perguntas Frequentes</h3>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left flex justify-between items-center py-2 hover:text-blue-600 transition-colors"
                  >
                    <span className="font-medium text-gray-800">{item.pergunta}</span>
                    <FiHelpCircle className={`transform transition-transform ${faqOpen === index ? 'rotate-180' : ''}`} />
                  </button>
                  {faqOpen === index && (
                    <div className="mt-2 pl-2 text-gray-600 animate-fade-in">
                      <p>{item.resposta}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Ajuda;