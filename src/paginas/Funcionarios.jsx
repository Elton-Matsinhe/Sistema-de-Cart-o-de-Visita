import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEdit2,
  FiEye,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiCalendar,
} from "react-icons/fi";
import { useCartoes } from "../contextos/CartoesContext";
import FormularioVCard from "../componentes/cartoes/FormularioVCard";
import GeradorQRCode from "../componentes/cartoes/GeradorQRCode";

const Funcionarios = () => {
  const {
    funcionarios,
    carregarFuncionarios,
    excluirFuncionario,
    exportarDados: exportarDadosAPI,
  } = useCartoes();
  const [searchParams, setSearchParams] = useSearchParams();
  const [busca, setBusca] = useState("");
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [funcionarioEditando, setFuncionarioEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("nome");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [campoBusca, setCampoBusca] = useState("todos");

  // Carregar funcionários quando o componente montar
  useEffect(() => {
    carregarFuncionarios();
  }, []);

  useEffect(() => {
    const verQR = searchParams.get("verQR");
    if (verQR && Array.isArray(funcionarios)) {
      const funcionario = funcionarios.find((f) => f.id === verQR || f.id === parseInt(verQR));
      if (funcionario) {
        setFuncionarioSelecionado(funcionario);
      }
    }
  }, [searchParams, funcionarios]);

  // Função de filtragem aprimorada
  const funcionariosFiltrados = (Array.isArray(funcionarios) ? funcionarios : [])
    .filter((func) => {
      if (!busca) return true;

      const termoBusca = busca.toLowerCase();

      switch (campoBusca) {
        case "nome":
          return func.nomeCompleto?.toLowerCase().includes(termoBusca) || false;
        case "email":
          return func.email?.toLowerCase().includes(termoBusca) || false;
        case "telefone":
          return func.telefone?.includes(busca) || false;
        case "empresa":
          return func.empresa?.toLowerCase().includes(termoBusca) || false;
        case "cargo":
          return func.cargo?.toLowerCase().includes(termoBusca) || false;
        case "todos":
        default:
          return (
            func.nomeCompleto?.toLowerCase().includes(termoBusca) ||
            func.empresa?.toLowerCase().includes(termoBusca) ||
            func.email?.toLowerCase().includes(termoBusca) ||
            func.cargo?.toLowerCase().includes(termoBusca) ||
            func.telefone?.includes(busca) ||
            false
          );
      }
    })
    .filter((func) => {
      if (filtroAtivo === "todos") return true;
      if (filtroAtivo === "comEmpresa") return func.empresa;
      if (filtroAtivo === "semEmpresa") return !func.empresa;
      if (filtroAtivo === "comFoto") return func.fotoPerfil;
      if (filtroAtivo === "semFoto") return !func.fotoPerfil;
      if (filtroAtivo === "comTelefone") return func.telefone;
      if (filtroAtivo === "semTelefone") return !func.telefone;
      return true;
    })
    .sort((a, b) => {
      if (ordenacao === "nome") {
        return (a.nomeCompleto || "").localeCompare(b.nomeCompleto || "");
      }
      if (ordenacao === "dataRecente") {
        return (
          new Date(b.createdAt || b.dataCriacao) -
          new Date(a.createdAt || a.dataCriacao)
        );
      }
      if (ordenacao === "dataAntiga") {
        return (
          new Date(a.createdAt || a.dataCriacao) -
          new Date(b.createdAt || b.dataCriacao)
        );
      }
      if (ordenacao === "empresa") {
        return (a.empresa || "").localeCompare(b.empresa || "");
      }
      return 0;
    });

  // Paginação
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const funcionariosPaginados = funcionariosFiltrados.slice(
    indexPrimeiroItem,
    indexUltimoItem,
  );
  const totalPaginas = Math.ceil(funcionariosFiltrados.length / itensPorPagina);

  const handleEditar = (funcionario) => {
    setFuncionarioEditando(funcionario);
    setMostrarFormulario(true);
    setFuncionarioSelecionado(null);
  };

  const handleVerQRCode = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setMostrarFormulario(false);
    setFuncionarioEditando(null);
  };

  const handleExcluir = async (funcionario) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir ${funcionario.nomeCompleto || 'este funcionário'}?`,
      )
    ) {
      try {
        const id = funcionario.id || funcionario._id;
        if (!id) {
          throw new Error("ID do funcionário não encontrado");
        }
        await excluirFuncionario(id);
        await carregarFuncionarios();
        alert("Funcionário excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir funcionário:", error);
        alert(
          `Erro ao excluir funcionário: ${error.message || "Erro desconhecido"}`,
        );
      }
    }
  };

  const handleSalvar = async () => {
    try {
      setMostrarFormulario(false);
      setFuncionarioEditando(null);
      await carregarFuncionarios(); // Recarregar lista após salvar
    } catch (error) {
      console.error("Erro ao recarregar funcionários:", error);
    }
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setFuncionarioEditando(null);
  };

  const mudarPagina = (numeroPagina) => {
    setPaginaAtual(numeroPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const limparFiltros = () => {
    setBusca("");
    setFiltroAtivo("todos");
    setOrdenacao("nome");
    setCampoBusca("todos");
    setPaginaAtual(1);
  };

  const exportarDados = async () => {
    try {
      const dadosExportados = await exportarDadosAPI({
        busca: busca || undefined,
        filtro: filtroAtivo !== "todos" ? filtroAtivo : undefined,
        ordenacao,
      });

      const dadosCSV = dadosExportados.map((func) => ({
        Nome: func.nomeCompleto || "",
        Email: func.email || "",
        Telefone: func.telefone || "",
        Empresa: func.empresa || "",
        Cargo: func.cargo || "",
        Data: new Date(func.createdAt || func.dataCriacao).toLocaleDateString(
          "pt-BR",
        ),
      }));

      const csv = [
        Object.keys(dadosCSV[0] || {}).join(","),
        ...dadosCSV.map((row) => Object.values(row).join(",")),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `funcionarios_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Erro ao exportar dados: ${error.message || "Erro desconhecido"}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-[#106a37]">
            Funcionários
          </h1>
          <p className="text-gray-600">
            Gerencie os cartões de visita dos seus funcionários
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportarDados}
            className="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl font-medium border border-gray-200"
          >
            <FiDownload />
            Exportar
          </button>
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl font-medium border border-gray-200"
          >
            <FiFilter />
            Filtros
          </button>
          <Link
            to="/criar"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#106a37] to-[#0d5a2c] text-white rounded-lg hover:from-[#0d5a2c] hover:to-[#0a4a23] transition-all shadow-lg hover:shadow-xl font-medium"
          >
            <FiPlus />
            Novo Funcionário
          </Link>
        </div>
      </div>

      {/* Filtros Avançados */}
      {mostrarFiltros && (
        <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-down">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FiFilter className="text-[#106a37]" />
              Filtros Avançados
            </h3>
            <div className="flex gap-2">
              <button
                onClick={limparFiltros}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium text-sm"
              >
                Limpar Todos
              </button>
              <button
                onClick={() => setMostrarFiltros(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FiSearch />
                Buscar em
              </label>
              <select
                value={campoBusca}
                onChange={(e) => {
                  setCampoBusca(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106a37] focus:border-transparent"
              >
                <option value="todos">Todos os campos</option>
                <option value="nome">Nome</option>
                <option value="email">Email</option>
                <option value="telefone">Telefone</option>
                <option value="empresa">Empresa</option>
                <option value="cargo">Cargo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FiFilter />
                Filtrar por
              </label>
              <select
                value={filtroAtivo}
                onChange={(e) => {
                  setFiltroAtivo(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106a37] focus:border-transparent"
              >
                <option value="todos">Todos os funcionários</option>
                <option value="comEmpresa">Com empresa</option>
                <option value="semEmpresa">Sem empresa</option>
                <option value="comFoto">Com foto</option>
                <option value="semFoto">Sem foto</option>
                <option value="comTelefone">Com telefone</option>
                <option value="semTelefone">Sem telefone</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FiBriefcase />
                Ordenar por
              </label>
              <select
                value={ordenacao}
                onChange={(e) => {
                  setOrdenacao(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106a37] focus:border-transparent"
              >
                <option value="nome">Nome (A-Z)</option>
                <option value="dataRecente">Mais recentes</option>
                <option value="dataAntiga">Mais antigos</option>
                <option value="empresa">Empresa (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Busca e Estatísticas */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Buscar ${campoBusca === "todos" ? "em todos os campos" : campoBusca === "nome" ? "por nome" : campoBusca === "email" ? "por email" : campoBusca === "telefone" ? "por telefone" : campoBusca === "empresa" ? "por empresa" : "por cargo"}...`}
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPaginaAtual(1);
            }}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
          />
        </div>

        {/* Estatísticas da busca */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              <span className="font-semibold">
                {funcionariosFiltrados.length}
              </span>{" "}
              funcionário(s)
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">
              Página <span className="font-semibold">{paginaAtual}</span> de{" "}
              <span className="font-semibold">{totalPaginas}</span>
            </span>
          </div>

          <div className="flex-1"></div>

          <div className="flex flex-wrap gap-2">
            {busca && (
              <span className="bg-[#106a37]/10 text-[#106a37] px-3 py-1 rounded-full text-sm flex items-center gap-1">
                Busca: "{busca}"
                <button
                  onClick={() => setBusca("")}
                  className="ml-1 hover:text-[#0d5a2c]"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
            {filtroAtivo !== "todos" && (
              <span className="bg-[#106a37]/10 text-[#106a37] px-3 py-1 rounded-full text-sm flex items-center gap-1">
                {filtroAtivo === "comEmpresa"
                  ? "Com empresa"
                  : filtroAtivo === "semEmpresa"
                    ? "Sem empresa"
                    : filtroAtivo === "comFoto"
                      ? "Com foto"
                      : filtroAtivo === "semFoto"
                        ? "Sem foto"
                        : filtroAtivo === "comTelefone"
                          ? "Com telefone"
                          : "Sem telefone"}
                <button
                  onClick={() => setFiltroAtivo("todos")}
                  className="ml-1 hover:text-[#0d5a2c]"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      {mostrarFormulario ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {funcionarioEditando ? "Editar Funcionário" : "Novo Funcionário"}
          </h2>
          <FormularioVCard
            funcionarioExistente={funcionarioEditando}
            onSalvar={handleSalvar}
            onCancelar={handleCancelar}
          />
        </div>
      ) : funcionarioSelecionado ? (
        <GeradorQRCode funcionario={funcionarioSelecionado} />
      ) : (
        <>
          {/* Tabela Aprimorada */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 w-1/4">
                      <div className="flex items-center gap-2">
                        <FiUser />
                        Funcionário
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 w-1/6">
                      <div className="flex items-center gap-2">
                        <FiBriefcase />
                        Empresa
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 w-1/6">
                      <div className="flex items-center gap-2">
                        <FiBriefcase />
                        Cargo
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 w-1/6">
                      <div className="flex items-center gap-2">
                        <FiPhone />
                        Contato
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 w-1/8">
                      <div className="flex items-center gap-2">
                        <FiCalendar />
                        Data
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 w-1/8">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {funcionariosPaginados.length > 0 ? (
                    funcionariosPaginados.map((funcionario, index) => (
                      <tr
                        key={funcionario.id || funcionario._id}
                        className="hover:bg-gray-50 transition-all duration-200 animate-fade-in-row"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {funcionario.fotoPerfil ? (
                              <img
                                src={funcionario.fotoPerfil}
                                alt={funcionario.nomeCompleto}
                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextElementSibling.style.display =
                                    "flex";
                                }}
                              />
                            ) : null}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#106a37] to-[#0d5a2c] flex items-center justify-center text-white font-bold shadow-sm">
                              {funcionario.nomeCompleto
                                ?.charAt(0)
                                .toUpperCase() || "?"}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {funcionario.nomeCompleto || "Sem nome"}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <FiMail size={12} />
                                {funcionario.email || "Não informado"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div
                            className={`px-3 py-1.5 rounded-full text-sm font-medium ${funcionario.empresa ? "bg-[#106a37]/10 text-[#106a37]" : "bg-gray-100 text-gray-600"}`}
                          >
                            {funcionario.empresa || "Não definida"}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-gray-700 font-medium">
                            {funcionario.cargo || "Não definido"}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <FiPhone className="text-gray-400" size={14} />
                            <p className="text-gray-700 font-medium">
                              {funcionario.telefone || "Não informado"}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <p className="text-sm text-gray-700 font-medium">
                              {new Date(
                                funcionario.createdAt ||
                                  funcionario.dataCriacao,
                              ).toLocaleDateString("pt-BR")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(
                                funcionario.createdAt ||
                                  funcionario.dataCriacao,
                              ).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditar(funcionario)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105"
                              title="Editar"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleVerQRCode(funcionario)}
                              className="p-2 text-[#106a37] hover:bg-[#106a37]/10 rounded-lg transition-all duration-200 hover:scale-105"
                              title="Ver QR Code"
                            >
                              <FiEye size={18} />
                            </button>
                            <button
                              onClick={() => handleExcluir(funcionario)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
                              title="Excluir"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-12 px-6 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <FiUser className="text-4xl mb-3 text-gray-300" />
                          <p className="text-lg font-medium">
                            Nenhum funcionário encontrado
                          </p>
                          <p className="text-sm mt-1">
                            {busca || filtroAtivo !== "todos"
                              ? "Tente ajustar os filtros de busca"
                              : "Adicione seu primeiro funcionário"}
                          </p>
                          {!busca && filtroAtivo === "todos" && (
                            <Link
                              to="/criar"
                              className="mt-4 px-4 py-2 bg-[#106a37] text-white rounded-lg hover:bg-[#0d5a2c] transition-all text-sm font-medium"
                            >
                              Criar Primeiro Funcionário
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {funcionariosFiltrados.length > itensPorPagina && (
              <div className="border-t border-gray-100 px-6 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Mostrando{" "}
                    <span className="font-semibold">
                      {indexPrimeiroItem + 1}
                    </span>{" "}
                    a{" "}
                    <span className="font-semibold">
                      {Math.min(indexUltimoItem, funcionariosFiltrados.length)}
                    </span>{" "}
                    de{" "}
                    <span className="font-semibold">
                      {funcionariosFiltrados.length}
                    </span>{" "}
                    funcionários
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => mudarPagina(paginaAtual - 1)}
                      disabled={paginaAtual === 1}
                      className={`p-2 rounded-lg ${paginaAtual === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100 hover:text-[#106a37]"}`}
                    >
                      <FiChevronLeft size={20} />
                    </button>

                    {Array.from(
                      { length: Math.min(5, totalPaginas) },
                      (_, i) => {
                        let paginaNumero;
                        if (totalPaginas <= 5) {
                          paginaNumero = i + 1;
                        } else if (paginaAtual <= 3) {
                          paginaNumero = i + 1;
                        } else if (paginaAtual >= totalPaginas - 2) {
                          paginaNumero = totalPaginas - 4 + i;
                        } else {
                          paginaNumero = paginaAtual - 2 + i;
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => mudarPagina(paginaNumero)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                              paginaNumero === paginaAtual
                                ? "bg-[#106a37] text-white shadow-md"
                                : "text-gray-700 hover:bg-gray-100 hover:text-[#106a37]"
                            }`}
                          >
                            {paginaNumero}
                          </button>
                        );
                      },
                    )}

                    <button
                      onClick={() => mudarPagina(paginaAtual + 1)}
                      disabled={paginaAtual === totalPaginas}
                      className={`p-2 rounded-lg ${paginaAtual === totalPaginas ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100 hover:text-[#106a37]"}`}
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Funcionarios;
