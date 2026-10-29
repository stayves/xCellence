import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  const isVercel = Boolean(process.env.VERCEL)
  const base = isVercel ? '/' : '/xCellence/'
  const outDir = isVercel ? 'dist' : '../docs'

  return {
    base,
    plugins: [
      react(),
      {
        // Preload the Latin subsets of the two brand fonts so the hero headline does not wait on CSS discovery.
        name: 'preload-brand-fonts',
        enforce: 'post' as const,
        transformIndexHtml: {
          order: 'post' as const,
          handler(html: string, ctx: { bundle?: Record<string, unknown> }) {
            const names = Object.keys(ctx.bundle ?? {}).filter((n) => /(unbounded|onest)-latin-wght-normal-.*\.woff2$/.test(n));
            const tags = names.map((n) => ({
              tag: 'link',
              attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: '', href: `${base}${n}` },
              injectTo: 'head' as const,
            }));
            return { html, tags };
          },
        },
      },
    ],
    build: {
      outDir,
      emptyOutDir: true,
    },
  }
})