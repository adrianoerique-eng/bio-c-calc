
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Mapeia a variável de ambiente do Vercel para o código cliente
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});