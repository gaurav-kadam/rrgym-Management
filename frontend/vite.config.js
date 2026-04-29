import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // ✅ FIXED: proxy API calls in dev so cookies work correctly
  server: {
    proxy: {
      '/api': {
        target: 'http://52.62.38.76:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    // Generate sourcemaps for production debugging (optional — remove if you want smaller builds)
    sourcemap: false,
  },
})
