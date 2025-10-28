// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/mci-frontend/',   // <--- set to "/REPO_NAME/"
  plugins: [react()],
})
