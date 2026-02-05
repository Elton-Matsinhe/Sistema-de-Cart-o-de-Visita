import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 5173,
    proxy: {
      // Permite que o frontend chame "/api/..." sem CORS em dev,
      // encaminhando para o backend em localhost:5000
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
})
