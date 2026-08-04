import path from "path"
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

// Inject a <link rel="preload"> for the LCP font (Averia Serif Libre 700)
// after the build, once the hashed woff2 filename is known.
function preloadCriticalFont(): Plugin {
  return {
    name: 'preload-critical-font',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist')
      const assetsDir = path.join(dist, 'assets')
      if (!existsSync(assetsDir)) return
      const cssFile = readdirSync(assetsDir).find(f => /^index-.*\.css$/.test(f))
      if (!cssFile) return
      const css = readFileSync(path.join(assetsDir, cssFile), 'utf8')
      const match = css.match(/url\((['"]?)(?:\.\.\/)?fonts\/(averia-serif-libre-latin-700-normal-[^'")]+\.woff2)\1\)/)
      if (!match) return
      const htmlPath = path.join(dist, 'index.html')
      const html = readFileSync(htmlPath, 'utf8')
      if (html.includes('rel="preload" as="font"')) return
      const link = `    <link rel="preload" as="font" type="font/woff2" href="/fonts/${match[2]}" crossorigin />`
      writeFileSync(htmlPath, html.replace('</head>', `${link}\n  </head>`))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), preloadCriticalFont()],
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
