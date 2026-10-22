import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Permissions-Policy': 'compute-pressure=(self "https://www.youtube.com")',
    },
    proxy: {
      '/api/midtrans': {
        target: 'https://api.sandbox.midtrans.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/midtrans/, ''),
      },
    },
  },
})
