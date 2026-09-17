import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/portofolio/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  assetsInclude: ['**/*.glb'],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three') || id.includes('@react-three') || id.includes('meshline')) {
            return 'vendor-three';
          }
          if (id.includes('gsap') || id.includes('framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('lucide-react') || id.includes('lenis')) {
            return 'vendor-ui';
          }
        },
      },
    },
    chunkSizeWarningLimit: 2500,
  },
})
