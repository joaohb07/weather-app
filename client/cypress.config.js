import { defineConfig } from 'cypress'

/**
 * Cypress configuration supporting both End-to-End (E2E) and isolated Component Testing.
 */
export default defineConfig({
  e2e: {
    // Target the local Vite development server for E2E test runs
    baseUrl: 'http://127.0.0.1:5173',
    // Disable default boilerplate support file since custom commands are not required
    supportFile: false,
    // Standard desktop viewport dimensions ensuring map and floating UI overlays render cleanly
    viewportWidth: 1280,
    viewportHeight: 800
  },

  component: {
    supportFile: false,
    // Mount isolated React components using the project's native Vite bundler
    devServer: {
      framework: 'react',
      bundler: 'vite'
    }
  }
})