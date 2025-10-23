import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/xCellence/', // 👈 important for GitHub Pages
  build: {
    outDir: 'dist' // (optional) the folder Vite will build into
  }
})
