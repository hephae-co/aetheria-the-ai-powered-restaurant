import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, '.'),
    },
  },
  server: {
    proxy: {
      '/vertex-ai-proxy': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
      },
      '/image-proxy': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
