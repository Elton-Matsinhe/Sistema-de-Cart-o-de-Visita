import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiPlus, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { useCartoes } from '../contextos/CartoesContext';

const Dashboard = () => {
  const { totalFuncionarios, funcionarios } = useCartoes();

  const funcionariosRecentes = funcionarios
    .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Título */}
      <div>
        <h1 className="text-4xl font-bold mb-2 text-[#106a37]">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Visão geral do sistema de cartões de visita digital
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total de Funcionários</p>
              <p className="text-3xl font-bold text-gray-800">{totalFuncionarios}</p>
            </div>
            <div className="w-12 h-12 bg-[#106a37]/10 rounded-lg flex items-center justify-center">
              <FiUsers className="text-[#106a37] text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Cartões Gerados</p>
              <p className="text-3xl font-bold text-gray-800">{totalFuncionarios}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiActivity className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Crescimento</p>
              <p className="text-3xl font-bold text-gray-800">+{totalFuncionarios}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Atividade</p>
              <p className="text-3xl font-bold text-gray-800">100%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiActivity className="text-orange-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/criar"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#106a37] to-[#0d5a2c] text-white rounded-lg hover:from-[#0d5a2c] hover:to-[#0a4a23] transition-all shadow-lg hover:shadow-xl font-medium"
          >
            <FiPlus />
            Criar Novo Cartão
          </Link>
          <Link
            to="/funcionarios"
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
          >
            <FiUsers />
            Ver Todos os Funcionários
          </Link>
        </div>
      </div>

      {/* Funcionários Recentes */}
      {funcionariosRecentes.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Funcionários Recentes</h2>
          <div className="space-y-4">
            {funcionariosRecentes.map((funcionario) => (
              <div
                key={funcionario.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
              >
                {funcionario.fotoPerfil ? (
                  <img
                    src={funcionario.fotoPerfil}
                    alt={funcionario.nomeCompleto}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#106a37] to-[#0d5a2c] flex items-center justify-center text-white font-bold">
                    {funcionario.nomeCompleto.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{funcionario.nomeCompleto}</p>
                  <p className="text-sm text-gray-600">
                    {funcionario.cargo || funcionario.empresa || 'Sem informações'}
                  </p>
                </div>
                <Link
                  to={`/funcionarios?verQR=${funcionario.id}`}
                  className="px-4 py-2 bg-[#106a37] text-white rounded-lg hover:bg-[#0d5a2c] transition-all text-sm font-medium"
                >
                  Ver QR Code
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Informações */}
      <div className="bg-gradient-to-r from-[#106a37] to-[#0d5a2c] rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Como Funciona?</h2>
        <p className="mb-4">
          Crie cartões de visita digitais para seus funcionários. Cada cartão possui um QR Code único que, 
          quando escaneado, adiciona automaticamente todas as informações de contato ao smartphone.
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Cadastre os dados do funcionário no formulário</li>
          <li>Gere o QR Code personalizado</li>
          <li>Compartilhe o QR Code (impresso ou digital)</li>
          <li>Quando escaneado, o contato é adicionado automaticamente</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;