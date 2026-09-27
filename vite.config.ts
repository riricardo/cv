import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const appVersion = process.env.VITE_APP_VERSION ?? new Date().toISOString()
process.env.VITE_APP_VERSION = appVersion

export default defineConfig({
  base: '/cv/',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/cv-api': {
        target: 'http://localhost:5255',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cv-api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'app-version',
          generateBundle() {
            this.emitFile({
              fileName: 'app-version.json',
              source: `${JSON.stringify({ version: appVersion })}\n`,
              type: 'asset',
            })
          },
        },
      ],
    },
  },
})
