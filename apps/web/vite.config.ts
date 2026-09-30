import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    // Used when VITE_USE_MOCK_API=false (`pnpm dev` from the repo root): the
    // API runs on 8787 and the browser keeps talking to one origin.
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${process.env.API_PORT ?? '8787'}`,
        changeOrigin: false,
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
});
