import React from 'react';
import { FiSettings, FiBell, FiLock } from 'react-icons/fi';
import { FaPalette } from 'react-icons/fa';

const Configuracoes = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-[#106a37]">
          Configurações
        </h1>
        <p className="text-gray-600">
          Gerencie as configurações do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notificações */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiBell className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Notificações</h3>
              <p className="text-sm text-gray-600">Gerencie suas notificações</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            Configure como e quando receber notificações sobre novos cartões e atualizações.
          </p>
        </div>

        {/* Segurança */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiLock className="text-green-600 text-2xl" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Segurança</h3>
              <p className="text-sm text-gray-600">Configurações de segurança</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            Gerencie senhas, autenticação e outras configurações de segurança.
          </p>
        </div>

        {/* Aparência */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaPalette className="text-purple-600 text-2xl" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Aparência</h3>
              <p className="text-sm text-gray-600">Personalize a interface</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            Ajuste temas, cores e outras preferências visuais do sistema.
          </p>
        </div>

        {/* Geral */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiSettings className="text-orange-600 text-2xl" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Geral</h3>
              <p className="text-sm text-gray-600">Configurações gerais</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            Configurações gerais do sistema e preferências do usuário.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
