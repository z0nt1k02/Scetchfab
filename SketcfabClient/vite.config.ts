import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Auth service — rewrite /auth/* → /api/* on localhost:5185
      '/auth': {
        target: 'http://localhost:5185',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, '/api'),
      },
      // Models service
      '/api': {
        target: 'http://localhost:5105',
        changeOrigin: true,
      },
    },
  },
});
