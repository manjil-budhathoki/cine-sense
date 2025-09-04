import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), 
    tailwindcss(
      {
        /* Tailwind CSS options */
      }
    )],
  server: {
    proxy: {
      // --- Rule #1: For API Calls ---
      // This rule forwards any request starting with /api to your Django server.
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },

      // --- NEW Rule #2: For Media Files ---
      // This rule forwards any request starting with /media to your Django server.
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    }
  }
  base: process.env.VITE_BASE_PATH || '/cine-sense',
})
