import React, { createContext, useContext, useState, useEffect } from 'react';
import funcionariosService from '../services/funcionariosService';

const CartoesContext = createContext();

export const useCartoes = () => {
  const context = useContext(CartoesContext);
  if (!context) {
    throw new Error('useCartoes deve ser usado dentro de CartoesProvider');
  }
  return context;
};

export const CartoesProvider = ({ children }) => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // Carregar funcionários da API
  const carregarFuncionarios = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const resposta = await funcionariosService.listarFuncionarios();
      
      // Verificar se a resposta tem success e data
      if (resposta && resposta.success !== false) {
        const dados = resposta.data || resposta;
        setFuncionarios(Array.isArray(dados) ? dados : []);
      } else {
        throw new Error(resposta.error || 'Erro ao carregar funcionários');
      }
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      setErro(error.message || 'Erro ao carregar funcionários');
      setFuncionarios([]);
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  // Carregar funcionários quando o componente montar
  useEffect(() => {
    carregarFuncionarios();
  }, []);

  // Adicionar novo funcionário via API
  const adicionarFuncionario = async (dados) => {
    try {
      setErro(null);
      console.log("📤 Adicionando funcionário:", { email: dados.email, nome: dados.nomeCompleto });
      
      const resposta = await funcionariosService.criarFuncionario(dados);
      
      console.log("✅ Resposta recebida:", {
        hasResposta: !!resposta,
        success: resposta?.success,
        hasData: !!resposta?.data,
        message: resposta?.message
      });
      
      // Verificar se a resposta tem success: true ou se não tem success (assumir sucesso se status foi 2xx)
      if (resposta && (resposta.success === true || resposta.success === undefined)) {
        const novoFuncionario = resposta.data || resposta;
        console.log("✅ Funcionário adicionado com sucesso:", novoFuncionario.id || novoFuncionario._id);
        // Atualizar a lista local
        setFuncionarios(prev => [...prev, novoFuncionario]);
        return novoFuncionario;
      } else if (resposta && resposta.success === false) {
        // Se explicitamente success: false, lançar erro
        console.error("❌ Servidor retornou success: false", resposta);
        throw new Error(resposta.error || 'Erro ao criar funcionário');
      } else {
        // Se não tem success definido, assumir sucesso se tem data
        if (resposta && resposta.data) {
          console.log("✅ Funcionário adicionado (sem campo success):", resposta.data.id || resposta.data._id);
          setFuncionarios(prev => [...prev, resposta.data]);
          return resposta.data;
        }
        console.error("❌ Resposta inválida:", resposta);
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('❌ Erro ao adicionar funcionário:', error);
      setErro(error.message || 'Erro ao adicionar funcionário');
      
      // Re-lançar o erro para que o componente possa tratá-lo
      throw error;
    }
  };

  // Atualizar funcionário via API
  const atualizarFuncionario = async (id, dadosAtualizados) => {
    try {
      setErro(null);
      const resposta = await funcionariosService.atualizarFuncionario(id, dadosAtualizados);
      
      // Verificar se a resposta tem success
      if (resposta && resposta.success !== false) {
        const funcionarioAtualizado = resposta.data || resposta;
        // Normalizar IDs para comparação
        const idNormalizado = typeof id === 'string' ? parseInt(id) : id;
        // Atualizar a lista local
        setFuncionarios(prev =>
          prev.map(func => {
            const funcId = typeof func.id === 'string' ? parseInt(func.id) : func.id;
            return (funcId === idNormalizado || func.id === id || func.id === idNormalizado) 
              ? funcionarioAtualizado 
              : func;
          })
        );
        return funcionarioAtualizado;
      } else {
        throw new Error(resposta.error || 'Erro ao atualizar funcionário');
      }
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      setErro(error.message || 'Erro ao atualizar funcionário');
      
      // Se o erro tem response.data, usar a mensagem de lá
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  };

  // Excluir funcionário via API
  const excluirFuncionario = async (id) => {
    try {
      setErro(null);
      const resposta = await funcionariosService.excluirFuncionario(id);
      
      // Verificar se a resposta tem success
      if (resposta && resposta.success !== false) {
        // Normalizar ID para comparação
        const idNormalizado = typeof id === 'string' ? parseInt(id) : id;
        // Remover da lista local
        setFuncionarios(prev =>
          prev.filter(func => {
            const funcId = typeof func.id === 'string' ? parseInt(func.id) : func.id;
            return funcId !== idNormalizado && func.id !== id && func.id !== idNormalizado;
          })
        );
        return resposta;
      } else {
        throw new Error(resposta.error || 'Erro ao excluir funcionário');
      }
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      setErro(error.message || 'Erro ao excluir funcionário');
      
      // Se o erro tem response.data, usar a mensagem de lá
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  };

  const obterFuncionario = (id) => {
    const idNormalizado = typeof id === 'string' ? parseInt(id) : id;
    return funcionarios.find((func) => {
      const funcId = typeof func.id === 'string' ? parseInt(func.id) : func.id;
      return funcId === idNormalizado || func.id === id || func.id === idNormalizado;
    });
  };

  // Exportar dados
  const exportarDados = async (filtros = {}) => {
    try {
      const dados = await funcionariosService.exportarDados(filtros);
      return Array.isArray(dados) ? dados : [];
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw error;
    }
  };

  const valor = {
    funcionarios: Array.isArray(funcionarios) ? funcionarios : [],
    carregarFuncionarios,
    adicionarFuncionario,
    atualizarFuncionario,
    excluirFuncionario,
    obterFuncionario,
    exportarDados,
    totalFuncionarios: Array.isArray(funcionarios) ? funcionarios.length : 0,
    carregando,
    erro,
  };

  return (
    <CartoesContext.Provider value={valor}>
      {children}
    </CartoesContext.Provider>
  );
};

