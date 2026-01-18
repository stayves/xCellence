import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  const isVercel = Boolean(process.env.VERCEL)
  const base = isVercel ? '/' : '/xCellence/'
  const outDir = isVercel ? 'dist' : '../docs'

  return {
    base,
    plugins: [react()],
    build: {
      outDir,
      emptyOutDir: true,
    },
  }
})