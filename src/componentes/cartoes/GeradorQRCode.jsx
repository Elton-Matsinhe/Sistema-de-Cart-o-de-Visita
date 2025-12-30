// src/componentes/cartoes/GeradorQRCode.jsx
import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FiDownload, FiCopy, FiCheck, FiUser, FiMail, FiPhone, FiBriefcase, FiMapPin, FiGlobe, FiMessageCircle, FiSmartphone, FiShare2 } from 'react-icons/fi';
import { gerarVCard, gerarVCardURI, downloadVCard, gerarMeCard } from '../../utils/geradorVCard';

const GeradorQRCode = ({ funcionario }) => {
  const [copiado, setCopiado] = useState(false);
  const [qrTipo, setQrTipo] = useState('vcard'); // vcard ou mecard
  const svgRef = useRef(null);

  if (!funcionario) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-xl shadow-lg">
        <p className="text-gray-500">Nenhum funcionário selecionado</p>
      </div>
    );
  }

  // Escolher qual tipo de QR Code gerar
  const getQRValue = () => {
    if (qrTipo === 'mecard') {
      return gerarMeCard(funcionario);
    }
    return gerarVCard(funcionario);
  };

  const qrValue = getQRValue();
  const vcardTexto = gerarVCard(funcionario);

  const handleDownloadQRCode = () => {
    const svgElement = svgRef.current?.querySelector('svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      canvas.width = 280;
      canvas.height = 280;
      
      img.onload = () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `qrcode-${funcionario.nomeCompleto.replace(/\s/g, '-')}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }, 'image/png');
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  const handleCopiarVCard = async () => {
    try {
      await navigator.clipboard.writeText(vcardTexto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
      // Fallback para navegadores antigos
      const textArea = document.createElement('textarea');
      textArea.value = vcardTexto;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const handleDownloadVCard = () => {
    downloadVCard(funcionario);
  };

  const handleCompartilhar = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Contato - ${funcionario.nomeCompleto}`,
          text: `Adicione ${funcionario.nomeCompleto} aos seus contatos`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      handleCopiarVCard();
      alert('vCard copiado para área de transferência!');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 lg:p-8 animate-scale-in">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold gradient-text mb-2">
          QR Code do Cartão
        </h3>
        <p className="text-gray-600">
          Escaneie para adicionar {funcionario.nomeCompleto} aos contatos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Code e Ações */}
        <div className="space-y-6">
          {/* QR Code */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200" ref={svgRef}>
                <QRCodeSVG
                  value={qrValue}
                  size={240}
                  level="H"
                  includeMargin={true}
                  fgColor="#106a37"
                  bgColor="#ffffff"
                />
              </div>
            </div>

            {/* Seletor de Tipo de QR Code */}
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={() => setQrTipo('vcard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  qrTipo === 'vcard'
                    ? 'bg-[#106a37] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                vCard (Universal)
              </button>
              <button
                onClick={() => setQrTipo('mecard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  qrTipo === 'mecard'
                    ? 'bg-[#106a37] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                MECARD (Android)
              </button>
            </div>

            {/* Informações do QR Code */}
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">
                <strong>Tipo:</strong> {qrTipo === 'vcard' ? 'vCard 3.0' : 'MECARD'}
              </p>
              <p>
                {qrTipo === 'vcard' 
                  ? 'Compatível com iPhone, Android e outros' 
                  : 'Otimizado para dispositivos Android'}
              </p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadQRCode}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#106a37] text-white rounded-lg hover:bg-[#0d5a2c] transition-all shadow hover:shadow-lg font-medium"
            >
              <FiDownload />
              Baixar QR
            </button>
            
            <button
              onClick={handleDownloadVCard}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#106a37] text-[#106a37] rounded-lg hover:bg-[#106a37]/10 transition-all font-medium"
            >
              <FiDownload />
              Baixar vCard
            </button>
            
            <button
              onClick={handleCopiarVCard}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              {copiado ? <FiCheck className="text-green-500" /> : <FiCopy />}
              {copiado ? 'Copiado!' : 'Copiar'}
            </button>
            
            <button
              onClick={handleCompartilhar}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              <FiShare2 />
              Compartilhar
            </button>
          </div>
        </div>

        {/* Informações do Funcionário */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
          <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <FiUser className="text-[#106a37]" />
            Informações do Contato
          </h4>

          <div className="space-y-3">
            {/* Nome */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-[#106a37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiUser className="text-[#106a37]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-medium text-gray-800">{funcionario.nomeCompleto}</p>
              </div>
            </div>

            {/* Empresa */}
            {funcionario.empresa && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-[#106a37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiBriefcase className="text-[#106a37]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Empresa</p>
                  <p className="font-medium text-gray-800">{funcionario.empresa}</p>
                </div>
              </div>
            )}

            {/* Cargo */}
            {funcionario.cargo && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-[#106a37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiBriefcase className="text-[#106a37]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cargo</p>
                  <p className="font-medium text-gray-800">{funcionario.cargo}</p>
                </div>
              </div>
            )}

            {/* Email */}
            {funcionario.email && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-[#106a37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-[#106a37]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-800">{funcionario.email}</p>
                </div>
              </div>
            )}

            {/* Telefone */}
            {funcionario.telefone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-[#106a37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiPhone className="text-[#106a37]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium text-gray-800">{funcionario.telefone}</p>
                </div>
              </div>
            )}

            {/* Localização */}
            {(funcionario.localizacao || funcionario.cidade) && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-[#106a37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-[#106a37]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Localização</p>
                  <p className="font-medium text-gray-800">
                    {[funcionario.localizacao, funcionario.cidade].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
        <h4 className="font-bold text-lg text-blue-800 mb-3 flex items-center gap-2">
          <FiSmartphone className="text-blue-600" />
          Como usar o QR Code
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-white rounded-lg border border-blue-100">
            <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
            <p className="font-medium text-gray-800">Escaneie o código</p>
            <p className="text-sm text-gray-600 mt-1">
              Use a câmera do seu celular para escanear
            </p>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-blue-100">
            <div className="text-2xl font-bold text-blue-600 mb-2">2</div>
            <p className="font-medium text-gray-800">Toque na notificação</p>
            <p className="text-sm text-gray-600 mt-1">
              Clique no link que aparecer na tela
            </p>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-blue-100">
            <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
            <p className="font-medium text-gray-800">Salve o contato</p>
            <p className="text-sm text-gray-600 mt-1">
              Adicione às suas listas de contatos
            </p>
          </div>
        </div>

        {/* Solução de problemas */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium mb-2">Problemas com leitura?</p>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Use a câmera nativa do celular (não apps de terceiros)</li>
            <li>• Baixe o vCard e importe manualmente se necessário</li>
            <li>• Tente mudar para "MECARD" no seletor acima para Android</li>
            <li>• Certifique-se de que há boa iluminação e foco</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Exportação padrão correta
export default GeradorQRCode;