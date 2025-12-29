import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import FormularioVCard from '../componentes/cartoes/FormularioVCard';
import GeradorQRCode from '../componentes/cartoes/GeradorQRCode';

const CriarCartao = () => {
  const navigate = useNavigate();
  const [funcionarioCriado, setFuncionarioCriado] = useState(null);
  const [mostrarQRCode, setMostrarQRCode] = useState(false);

  const handleSalvar = (dados) => {
    setFuncionarioCriado(dados);
    setMostrarQRCode(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-all"
        >
          <FiArrowLeft className="text-2xl" />
        </button>
        <div>
          <h1 className="text-4xl font-bold mb-2 text-[#106a37]">
            Criar Novo Cartão
          </h1>
          <p className="text-gray-600">
            Preencha os dados do funcionário para gerar o QR Code
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {mostrarQRCode && funcionarioCriado ? (
            <div className="text-center py-8">
              <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Funcionário Cadastrado!
              </h2>
              <p className="text-gray-600 mb-6">
                O QR Code foi gerado com sucesso. Você pode visualizá-lo ao lado.
              </p>
              <button
                onClick={() => {
                  setMostrarQRCode(false);
                  setFuncionarioCriado(null);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                Criar Outro Cartão
              </button>
            </div>
          ) : (
            <FormularioVCard onSalvar={handleSalvar} />
          )}
        </div>

        {/* QR Code Preview */}
        <div className="lg:sticky lg:top-24">
          {mostrarQRCode && funcionarioCriado ? (
            <GeradorQRCode funcionario={funcionarioCriado} />
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <p className="text-lg mb-2">Preview do QR Code</p>
                <p className="text-sm">
                  Preencha o formulário ao lado para gerar o QR Code
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CriarCartao;

