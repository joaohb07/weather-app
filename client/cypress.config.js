import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false,
    viewportWidth: 1280,
    viewportHeight: 800
  },
  component: {
    supportFile: false,
    devServer: {
      framework: 'react',
      bundler: 'vite'
    }
  }
})