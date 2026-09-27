import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false,
  },
  optimizeDeps: {
    exclude: [],
  },
  server: {
    sourcemapIgnoreList: (sourcePath) =>
      sourcePath.includes('node_modules'),
  },
})