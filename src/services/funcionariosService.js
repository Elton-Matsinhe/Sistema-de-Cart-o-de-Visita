import api from "./api.js";

class FuncionariosService {
  async listarFuncionarios(filtros = {}) {
    try {
      const response = await api.get("/funcionarios", { params: filtros });
      // Se a resposta tem success: false, lançar erro
      if (response.data && response.data.success === false) {
        throw new Error(response.data.error || "Erro ao listar funcionários");
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao listar funcionários:", error);
      // Se já é um erro com mensagem, propagar
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  async buscarFuncionario(id) {
    try {
      const response = await api.get(`/funcionarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar funcionário ${id}:`, error);
      throw error;
    }
  }

  async criarFuncionario(dados) {
    try {
      const response = await api.post("/funcionarios", dados);
      
      console.log("✅ Resposta do servidor:", {
        status: response.status,
        success: response.data?.success,
        hasData: !!response.data?.data,
        message: response.data?.message
      });
      
      // Verificar status HTTP
      if (response.status >= 200 && response.status < 300) {
        // Se a resposta tem success: false, lançar erro
        if (response.data && response.data.success === false) {
          console.error("❌ Servidor retornou success: false", response.data);
          throw new Error(response.data.error || "Erro ao criar funcionário");
        }
        // Retornar dados de sucesso (mesmo se success não estiver definido, mas status é 2xx)
        console.log("✅ Funcionário criado com sucesso");
        return response.data;
      }
      
      // Se chegou aqui, algo está errado
      console.error("❌ Status HTTP inesperado:", response.status);
      throw new Error("Resposta inesperada do servidor");
    } catch (error) {
      console.error("❌ Erro ao criar funcionário:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Se é um erro HTTP do axios
      if (error.response) {
        // Verificar se é erro de duplicidade (400 com mensagem específica)
        if (error.response.status === 400 && error.response.data?.error) {
          throw new Error(error.response.data.error);
        }
        // Outros erros HTTP
        if (error.response.data?.error) {
          throw new Error(error.response.data.error);
        }
        if (error.response.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      // Se já é um Error com mensagem, propagar
      if (error instanceof Error && error.message) {
        throw error;
      }
      
      throw new Error(error.message || "Erro ao criar funcionário");
    }
  }

  async atualizarFuncionario(id, dados) {
    try {
      const response = await api.put(`/funcionarios/${id}`, dados);
      // Se a resposta tem success: false, lançar erro
      if (response.data && response.data.success === false) {
        throw new Error(response.data.error || "Erro ao atualizar funcionário");
      }
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar funcionário ${id}:`, error);
      // Se já é um erro com mensagem, propagar
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async excluirFuncionario(id) {
    try {
      const response = await api.delete(`/funcionarios/${id}`);
      // Se a resposta tem success: false, lançar erro
      if (response.data && response.data.success === false) {
        throw new Error(response.data.error || "Erro ao excluir funcionário");
      }
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir funcionário ${id}:`, error);
      // Se já é um erro com mensagem, propagar
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  async obterEstatisticas() {
    try {
      const response = await api.get("/funcionarios/estatisticas");
      return response.data;
    } catch (error) {
      console.error("Erro ao obter estatísticas:", error);
      throw error;
    }
  }

  async exportarDados(filtros = {}) {
    try {
      const response = await api.get("/funcionarios", {
        params: { ...filtros, limite: 1000 },
      });
      return response.data.data;
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      throw error;
    }
  }
}

export default new FuncionariosService();
