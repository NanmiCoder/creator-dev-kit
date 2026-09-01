import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4821,
    strictPort: true,
    fs: { allow: ['..'] },
    proxy: {
      '/api': 'http://localhost:4022',
      '/ws': { target: 'ws://localhost:4022', ws: true },
    },
  },
  build: { outDir: 'dist', emptyOutDir: true },
});
