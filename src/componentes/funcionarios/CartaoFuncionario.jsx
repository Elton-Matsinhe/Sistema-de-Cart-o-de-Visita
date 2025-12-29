import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiMapPin, FiTrash2, FiEdit, FiEye } from 'react-icons/fi';
import { useCartoes } from '../../contextos/CartoesContext';

const CartaoFuncionario = ({ funcionario, onEditar, onVerQRCode }) => {
  const { excluirFuncionario } = useCartoes();
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const handleExcluir = () => {
    if (mostrarConfirmacao) {
      excluirFuncionario(funcionario.id);
      setMostrarConfirmacao(false);
    } else {
      setMostrarConfirmacao(true);
      setTimeout(() => setMostrarConfirmacao(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 card-hover animate-fade-in">
      <div className="flex items-start gap-4">
        {/* Foto */}
        <div className="flex-shrink-0">
          {funcionario.fotoPerfil ? (
            <img
              src={funcionario.fotoPerfil}
              alt={funcionario.nomeCompleto}
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-md"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md ${funcionario.fotoPerfil ? 'hidden' : 'flex'}`}
          >
            {funcionario.nomeCompleto.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Informações */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">
            {funcionario.nomeCompleto}
          </h3>
          {funcionario.cargo && (
            <p className="text-gray-600 mb-2 flex items-center gap-1">
              <FiBriefcase className="text-sm" />
              {funcionario.cargo}
            </p>
          )}
          {funcionario.empresa && (
            <p className="text-gray-500 text-sm mb-3">{funcionario.empresa}</p>
          )}

          <div className="space-y-1 text-sm text-gray-600">
            {funcionario.email && (
              <p className="flex items-center gap-2 truncate">
                <FiMail className="text-blue-500" />
                <span className="truncate">{funcionario.email}</span>
              </p>
            )}
            {funcionario.telefone && (
              <p className="flex items-center gap-2">
                <FiPhone className="text-green-500" />
                {funcionario.telefone}
              </p>
            )}
            {(funcionario.cidade || funcionario.localizacao) && (
              <p className="flex items-center gap-2 truncate">
                <FiMapPin className="text-red-500" />
                {[funcionario.cidade, funcionario.localizacao].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => onVerQRCode(funcionario)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
        >
          <FiEye />
          Ver QR Code
        </button>
        <button
          onClick={() => onEditar(funcionario)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
        >
          <FiEdit />
        </button>
        <button
          onClick={handleExcluir}
          className={`px-4 py-2 rounded-lg transition-all ${
            mostrarConfirmacao
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

export default CartaoFuncionario;

