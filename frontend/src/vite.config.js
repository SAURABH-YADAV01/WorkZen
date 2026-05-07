import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.railway.app']
  },

  preview: {
    host: '0.0.0.0',
    allowedHosts: ['.railway.app']
  }
})