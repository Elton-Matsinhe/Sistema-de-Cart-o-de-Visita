import axios from "axios";

const api = axios.create({
  // Em dev, prefira usar proxy do Vite (baseURL "/api").
  // Em produção, defina VITE_API_URL (ex: "https://seu-dominio.com/api").
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
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
    } else if (error.response?.status === 500) {
      console.error("Erro interno do servidor");
    } else if (!error.response) {
      console.error("Servidor não responde - verifique a conexão");
    }

    return Promise.reject(error);
  },
);

export default api;
