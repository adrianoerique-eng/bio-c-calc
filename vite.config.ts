
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Injeta apenas a API_KEY necessária, protegendo outras variáveis de sistema
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});