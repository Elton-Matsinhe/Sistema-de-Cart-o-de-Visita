import api from "./api.js";

class FuncionariosService {
  async listarFuncionarios(filtros = {}) {
    try {
      const response = await api.get("/funcionarios", { params: filtros });
      return response.data;
    } catch (error) {
      console.error("Erro ao listar funcionários:", error);
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
      return response.data;
    } catch (error) {
      console.error("Erro ao criar funcionário:", error);
      throw error;
    }
  }

  async atualizarFuncionario(id, dados) {
    try {
      const response = await api.put(`/funcionarios/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar funcionário ${id}:`, error);
      throw error;
    }
  }

  async excluirFuncionario(id) {
    try {
      const response = await api.delete(`/funcionarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir funcionário ${id}:`, error);
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
