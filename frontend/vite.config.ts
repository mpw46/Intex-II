import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://intex2-backend-ezargqcgdwbgd4hq.francecentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
