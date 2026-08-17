import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `pnpm build:single` inlines every JS/CSS/font/image into one self-contained
// index.html that opens from file:// with no server — the recording deliverable.
const single = process.env.BUILD_SINGLE === '1'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), ...(single ? [viteSingleFile()] : [])],
  server: { port: 5185, host: '127.0.0.1' },
  build: {
    // Inline images/fonts as data URIs so the single file is truly standalone.
    assetsInlineLimit: single ? 100_000_000 : 4096,
    chunkSizeWarningLimit: 100_000,
  },
})
