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
      // any request that starts with '/api' will be proxied
      '/api': {
        target: 'http://localhost:8000', // your Django server
        changeOrigin: true,
        // The rewrite is optional, but it's good practice if your Django URLs don't start with /api
        // In our case they do, so it's not strictly needed, but doesn't hurt.
        // rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
