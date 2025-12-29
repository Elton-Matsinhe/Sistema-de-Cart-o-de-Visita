import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FiDownload, FiCopy, FiCheck } from 'react-icons/fi';
import { gerarVCard, gerarURLVCard } from '../../utils/geradorVCard';

const GeradorQRCode = ({ funcionario }) => {
  const [copiado, setCopiado] = useState(false);
  const svgRef = useRef(null);

  if (!funcionario) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-xl shadow-lg">
        <p className="text-gray-500">Nenhum funcionário selecionado</p>
      </div>
    );
  }

  const vcardData = gerarURLVCard(funcionario);
  const vcardTexto = gerarVCard(funcionario);

  const handleDownload = () => {
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
        });
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
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 animate-scale-in">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold gradient-text mb-2">
          QR Code do Cartão
        </h3>
        <p className="text-gray-600">
          Escaneie para adicionar {funcionario.nomeCompleto} aos contatos
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        <div className="p-6 bg-white rounded-xl shadow-lg border-4 border-blue-500 animate-float">
          <div ref={svgRef}>
            <QRCodeSVG
              value={vcardData}
              size={280}
              level="H"
              includeMargin={true}
              fgColor="#1e40af"
              bgColor="#ffffff"
            />
          </div>
        </div>
      </div>

      {/* Informações do Funcionário */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          {funcionario.fotoPerfil && (
            <img
              src={funcionario.fotoPerfil}
              alt={funcionario.nomeCompleto}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <div>
            <h4 className="font-bold text-lg text-gray-800">
              {funcionario.nomeCompleto}
            </h4>
            {funcionario.cargo && (
              <p className="text-gray-600">{funcionario.cargo}</p>
            )}
            {funcionario.empresa && (
              <p className="text-gray-500 text-sm">{funcionario.empresa}</p>
            )}
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-medium"
        >
          <FiDownload />
          Baixar QR Code
        </button>
        <button
          onClick={handleCopiarVCard}
          className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl font-medium"
        >
          {copiado ? <FiCheck /> : <FiCopy />}
          {copiado ? 'Copiado!' : 'Copiar vCard'}
        </button>
      </div>

      {/* Instruções */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Como usar:</strong> Escaneie o QR Code com a câmera do seu smartphone. 
          O sistema abrirá automaticamente a opção de adicionar o contato com todos os dados preenchidos.
        </p>
      </div>
    </div>
  );
};

export default GeradorQRCode;

