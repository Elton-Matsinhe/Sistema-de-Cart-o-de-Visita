import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60 segundos para suportar uploads de imagens grandes
  maxContentLength: 50 * 1024 * 1024, // 50MB
  maxBodyLength: 50 * 1024 * 1024, // 50MB
});

api.interceptors.request.use(
  (config) => {
    console.log(`📤 Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Erro no request:", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ Erro na resposta:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });

    if (error.response?.status === 404) {
      console.error("Recurso não encontrado");
    } else if (error.response?.status === 413) {
      console.error("Arquivo muito grande");
      error.message = error.response?.data?.error || "A imagem é muito grande. Por favor, use uma imagem menor.";
    } else if (error.response?.status === 500) {
      console.error("Erro interno do servidor");
      error.message = error.response?.data?.error || "Erro interno do servidor";
    } else if (!error.response) {
      console.error("Servidor não responde - verifique a conexão");
    }

    return Promise.reject(error);
  },
);

export default api;
