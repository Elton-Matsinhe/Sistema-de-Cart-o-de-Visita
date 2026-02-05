import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiPlus,
  FiTrendingUp,
  FiActivity,
  FiImage,
  FiPhone,
  FiCalendar,
  FiRefreshCw,
} from "react-icons/fi";
import { useCartoes } from "../contextos/CartoesContext";

const Dashboard = () => {
  const {
    funcionarios,
    estatisticas,
    carregando,
    // Verifique se essas funções existem no seu contexto
    // Se não existirem, vamos fazer uma implementação alternativa
  } = useCartoes();

  const [estatisticasLocais, setEstatisticasLocais] = useState({
    totalFuncionarios: 0,
    funcionariosComFoto: 0,
    funcionariosComTelefone: 0,
    funcionariosRecentes: 0,
    percentualComFoto: 0,
    percentualComTelefone: 0,
  });

  const [atualizando, setAtualizando] = useState(false);

  // Função para carregar dados manualmente (se não estiver disponível no contexto)
  const carregarDados = async () => {
    setAtualizando(true);
    try {
      // Se o contexto tiver uma função para recarregar, use-a
      // Caso contrário, apenas aguarde um momento para simular
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setAtualizando(false);
    }
  };

  // Calcular estatísticas com base nos funcionários disponíveis
  useEffect(() => {
    const calcularEstatisticas = () => {
      const total = Array.isArray(funcionarios) ? funcionarios.length : 0;

      if (total === 0) {
        setEstatisticasLocais({
          totalFuncionarios: 0,
          funcionariosComFoto: 0,
          funcionariosComTelefone: 0,
          funcionariosRecentes: 0,
          percentualComFoto: 0,
          percentualComTelefone: 0,
        });
        return;
      }

      // Se temos estatísticas da API, use-as
      if (estatisticas && typeof estatisticas === "object") {
        setEstatisticasLocais({
          totalFuncionarios: estatisticas.totalFuncionarios || total,
          funcionariosComFoto: estatisticas.funcionariosComFoto || 0,
          funcionariosComTelefone: estatisticas.funcionariosComTelefone || 0,
          funcionariosRecentes: estatisticas.funcionariosRecentes || 0,
          percentualComFoto: estatisticas.percentualComFoto || 0,
          percentualComTelefone: estatisticas.percentualComTelefone || 0,
        });
      } else {
        // Calcular estatísticas localmente
        const funcionariosArray = Array.isArray(funcionarios)
          ? funcionarios
          : [];

        const comFoto = funcionariosArray.filter(
          (f) => f && f.fotoPerfil && f.fotoPerfil.trim() !== "",
        ).length;

        const comTelefone = funcionariosArray.filter(
          (f) => f && f.telefone && f.telefone.trim() !== "",
        ).length;

        // Calcular funcionários recentes (últimos 7 dias)
        const seteDiasAtras = new Date();
        seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

        const recentes = funcionariosArray.filter((f) => {
          if (!f) return false;
          const dataCriacao = new Date(
            f.createdAt || f.dataCriacao || Date.now(),
          );
          return dataCriacao >= seteDiasAtras;
        }).length;

        setEstatisticasLocais({
          totalFuncionarios: total,
          funcionariosComFoto: comFoto,
          funcionariosComTelefone: comTelefone,
          funcionariosRecentes: recentes,
          percentualComFoto:
            total > 0 ? Math.round((comFoto / total) * 100) : 0,
          percentualComTelefone:
            total > 0 ? Math.round((comTelefone / total) * 100) : 0,
        });
      }
    };

    calcularEstatisticas();
  }, [funcionarios, estatisticas]);

  // Ordenar funcionários recentes
  const funcionariosRecentes = React.useMemo(() => {
    if (!Array.isArray(funcionarios) || funcionarios.length === 0) {
      return [];
    }

    return [...funcionarios]
      .sort((a, b) => {
        const dateA = new Date(a?.createdAt || a?.dataCriacao || 0);
        const dateB = new Date(b?.createdAt || b?.dataCriacao || 0);
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [funcionarios]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabeçalho com botão de atualizar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-[#106a37]">Dashboard</h1>
          <p className="text-gray-600">
            Visão geral do sistema de cartões de visita digital
          </p>
        </div>

        <button
          onClick={carregarDados}
          disabled={atualizando || carregando}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl font-medium border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiRefreshCw className={atualizando ? "animate-spin" : ""} />
          {atualizando ? "Atualizando..." : "Atualizar Dados"}
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de Funcionários */}
        <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">
                Total de Funcionários
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {estatisticasLocais.totalFuncionarios}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#106a37]/10 rounded-lg flex items-center justify-center">
              <FiUsers className="text-[#106a37] text-2xl" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {estatisticasLocais.totalFuncionarios === 1
                ? "1 funcionário cadastrado"
                : `${estatisticasLocais.totalFuncionarios} funcionários cadastrados`}
            </p>
          </div>
        </div>

        {/* Com Foto */}
        <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Com Foto</p>
              <p className="text-3xl font-bold text-gray-800">
                {estatisticasLocais.funcionariosComFoto}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {estatisticasLocais.totalFuncionarios > 0
                  ? `${estatisticasLocais.percentualComFoto}% do total`
                  : "0% do total"}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiImage className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Com Telefone */}
        <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Com Telefone</p>
              <p className="text-3xl font-bold text-gray-800">
                {estatisticasLocais.funcionariosComTelefone}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {estatisticasLocais.totalFuncionarios > 0
                  ? `${estatisticasLocais.percentualComTelefone}% do total`
                  : "0% do total"}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiPhone className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Recentes (7 dias) */}
        <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Recentes (7 dias)</p>
              <p className="text-3xl font-bold text-gray-800">
                {estatisticasLocais.funcionariosRecentes}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                <FiCalendar className="inline mr-1" />
                Última semana
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="text-orange-600 text-2xl" />
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
      {carregando ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Funcionários Recentes
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      ) : funcionariosRecentes.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Funcionários Recentes
            </h2>
            <Link
              to="/funcionarios"
              className="text-sm text-[#106a37] hover:text-[#0d5a2c] font-medium"
            >
              Ver todos →
            </Link>
          </div>
          <div className="space-y-4">
            {funcionariosRecentes.map((funcionario, index) => (
              <div
                key={funcionario?.id || funcionario?._id || index}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all group"
              >
                {funcionario?.fotoPerfil ? (
                  <img
                    src={funcionario.fotoPerfil}
                    alt={funcionario.nomeCompleto || "Funcionário"}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white group-hover:border-[#106a37]/20 transition-all"
                    onError={(e) => {
                      e.target.style.display = "none";
                      if (e.target.nextElementSibling) {
                        e.target.nextElementSibling.style.display = "flex";
                      }
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#106a37] to-[#0d5a2c] flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
                    {(funcionario?.nomeCompleto || "?").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">
                    {funcionario?.nomeCompleto || "Sem nome"}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {funcionario?.cargo ||
                      funcionario?.empresa ||
                      "Sem informações"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {funcionario?.createdAt || funcionario?.dataCriacao
                      ? `Adicionado em ${new Date(funcionario.createdAt || funcionario.dataCriacao).toLocaleDateString("pt-BR")}`
                      : "Data não disponível"}
                  </p>
                </div>
                <Link
                  to={`/funcionarios?verQR=${funcionario?.id || funcionario?._id || ""}`}
                  className="px-4 py-2 bg-[#106a37] text-white rounded-lg hover:bg-[#0d5a2c] transition-all text-sm font-medium whitespace-nowrap"
                >
                  Ver QR Code
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Funcionários Recentes
          </h2>
          <div className="text-center py-8">
            <FiUsers className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nenhum funcionário cadastrado ainda</p>
            <Link
              to="/criar"
              className="inline-block mt-4 px-6 py-2 bg-[#106a37] text-white rounded-lg hover:bg-[#0d5a2c] transition-all font-medium"
            >
              Criar Primeiro Funcionário
            </Link>
          </div>
        </div>
      )}

      {/* Informações */}
      <div className="bg-gradient-to-r from-[#106a37] to-[#0d5a2c] rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Como Funciona?</h2>
        <p className="mb-4 opacity-90">
          Crie cartões de visita digitais para seus funcionários. Cada cartão
          possui um QR Code único que, quando escaneado, adiciona
          automaticamente todas as informações de contato ao smartphone.
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm opacity-90">
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
