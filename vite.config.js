import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/static-hash-index/',
  build: {
    outDir: 'dist',
  },
})
