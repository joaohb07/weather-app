import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Vite build and development server configuration.
 * @see https://vite.dev/config/
 */
export default defineConfig({
  // Use relative asset paths so the compiled bundle works seamlessly regardless of mount path
  base: './',

  // Enable React Fast Refresh / JSX transform and Tailwind CSS v4 Vite integration
  plugins: [react(), tailwindcss()],

  server: {
    // Proxy `/weather` API requests during local development (`npm run dev`) to the
    // Express backend on port 3000, avoiding cross-origin (CORS) issues
    proxy: {
      '/weather': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})