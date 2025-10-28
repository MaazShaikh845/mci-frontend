import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ must match your repo name on GitHub
export default defineConfig({
  base: '/mci-frontend/',
  plugins: [react()],
})
