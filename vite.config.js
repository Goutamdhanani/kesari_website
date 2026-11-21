import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    allowedHosts: [
      'thekesari.com',
      '.thekesari.com',
      'www.thekesari.com',
      'concise-tan-mallard-10.hostingersite.com',
      '.hostingersite.com',
      'localhost',
      '127.0.0.1'
    ]
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react/')) {
              return 'vendor-react'
            }
            if (id.includes('motion')) {
              return 'vendor-motion'
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide'
            }
            if (id.includes('qrcode') || id.includes('canvas-confetti')) {
              return 'vendor-utils'
            }
            return 'vendor-deps'
          }
        }
      }
    }
  }
})
