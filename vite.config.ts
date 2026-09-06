import { defineConfig } from 'vite'

// Relative base => deployable under any GitHub Pages subdirectory.
export default defineConfig({
  base: './',
  build: { outDir: 'dist', assetsInlineLimit: 0 },
  server: { host: true, allowedHosts: true },
  preview: { host: true, allowedHosts: true },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
})
