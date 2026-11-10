import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Selalu muat .env dari direktori project fe ini sendiri
  const env = {
    ...loadEnv(mode, __dirname, ''),
    ...loadEnv(mode, process.cwd(), ''),
  }

  // Hanya Sandbox jika VITE_MIDTRANS_IS_SANDBOX secara eksplisit bernilai 'true'
  const isSandbox = env.VITE_MIDTRANS_IS_SANDBOX === 'true'
  const midtransTarget = isSandbox
    ? 'https://api.sandbox.midtrans.com'
    : 'https://api.midtrans.com'

  console.log(`📡 [Vite Proxy] Midtrans Target: ${midtransTarget} (Sandbox: ${isSandbox})`)

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
