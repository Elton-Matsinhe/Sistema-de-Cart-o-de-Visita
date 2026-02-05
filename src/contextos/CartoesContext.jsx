import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import funcionariosService from "../services/funcionariosService.js";

const CartoesContext = createContext();

export const useCartoes = () => {
  const context = useContext(CartoesContext);
  if (!context) {
    throw new Error("useCartoes deve ser usado dentro de CartoesProvider");
  }
  return context;
};

export const CartoesProvider = ({ children }) => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(false);
  const [erroFuncionarios, setErroFuncionarios] = useState(null);
  const [estatisticas, setEstatisticas] = useState(null);

  const carregarFuncionarios = async (filtros = {}) => {
    setLoadingFuncionarios(true);
    setErroFuncionarios(null);
    try {
      const payload = await funcionariosService.listarFuncionarios(filtros);
      // Backend retorna: { success: true, data: [...], total? }
      const lista = Array.isArray(payload?.data) ? payload.data : [];
      setFuncionarios(lista);
      return lista;
    } catch (err) {
      setErroFuncionarios(err);
      throw err;
    } finally {
      setLoadingFuncionarios(false);
    }
  };

  const adicionarFuncionario = async (dados) => {
    const payload = await funcionariosService.criarFuncionario(dados);
    const novo = payload?.data;
    if (novo) {
      setFuncionarios((prev) => [novo, ...prev]);
    } else {
      // fallback: recarrega se a resposta vier em outro formato
      await carregarFuncionarios();
    }
    return novo;
  };

  const atualizarFuncionario = async (id, dadosAtualizados) => {
    const payload = await funcionariosService.atualizarFuncionario(
      id,
      dadosAtualizados,
    );
    const atualizado = payload?.data;
    if (atualizado) {
      setFuncionarios((prev) =>
        prev.map((f) => (String(f.id) === String(id) ? atualizado : f)),
      );
    } else {
      await carregarFuncionarios();
    }
    return atualizado;
  };

  const excluirFuncionario = async (id) => {
    await funcionariosService.excluirFuncionario(id);
    setFuncionarios((prev) => prev.filter((f) => String(f.id) !== String(id)));
  };

  const obterFuncionario = (id) => {
    return funcionarios.find((func) => String(func.id) === String(id));
  };

  const obterEstatisticas = async () => {
    const payload = await funcionariosService.obterEstatisticas();
    const stats = payload?.data ?? payload;
    setEstatisticas(stats);
    return stats;
  };

  const exportarDados = async (filtros = {}) => {
    return await funcionariosService.exportarDados(filtros);
  };

  const valor = useMemo(
    () => ({
      funcionarios,
      loadingFuncionarios,
      erroFuncionarios,
      estatisticas,
      // Compatibilidade com páginas antigas
      carregando: loadingFuncionarios,
      carregarFuncionarios,
      adicionarFuncionario,
      atualizarFuncionario,
      excluirFuncionario,
      obterFuncionario,
      obterEstatisticas,
      exportarDados,
      totalFuncionarios: funcionarios.length,
    }),
    [erroFuncionarios, estatisticas, funcionarios, loadingFuncionarios],
  );

  // Carrega dados iniciais automaticamente
  useEffect(() => {
    carregarFuncionarios().catch(() => {});
    obterEstatisticas().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CartoesContext.Provider value={valor}>
      {children}
    </CartoesContext.Provider>
  );
};

