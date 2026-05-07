import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'successful-gentleness-production-5a49.up.railway.app'
    ]
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: [
      'successful-gentleness-production-5a49.up.railway.app'
    ]
  }
})