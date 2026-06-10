import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@experience': resolve(__dirname, 'src/components/Experience'),
      '@utils': resolve(__dirname, 'src/Utils'),
      '@hero': resolve(__dirname, 'src/hero'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  }
})
