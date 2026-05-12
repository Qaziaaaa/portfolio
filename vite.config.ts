import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    cssCodeSplit: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'gsap-vendor': ['gsap'],
          'ui-components': ['lucide-react'],
          'radix-vendor': ['@radix-ui/react-slot', '@radix-ui/react-dialog'],
        },
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'asset'
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(name)) {
            return `media/[name]-[hash][extname]`
          }
          if (/(png|jpe?g|gif|svg|webp|avif)$/.test(name)) {
            return `images/[name]-[hash][extname]`
          }
          if (/(woff2?|eot|ttf|otf)$/.test(name)) {
            return `fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    proxy: {
      '/api/jina': {
        target: 'https://api.jina.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/jina/, ''),
      },
      '/api/groq': {
        target: 'https://api.groq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/groq/, ''),
      },
    },
  },
});
