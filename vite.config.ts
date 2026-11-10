import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isSandbox = env.VITE_MIDTRANS_IS_SANDBOX !== 'false'
  const midtransTarget = isSandbox
    ? 'https://api.sandbox.midtrans.com'
    : 'https://api.midtrans.com'

  return {
    plugins: [react()],
    server: {
      headers: {
        'Permissions-Policy': 'compute-pressure=(self "https://www.youtube.com")',
      },
      proxy: {
        '/api/midtrans': {
          target: midtransTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/midtrans/, ''),
        },
      },
    },
  }
})
