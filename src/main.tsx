import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Self-hosted fonts (font-display: swap) — no render-blocking third-party CSS
// Latin subset only; unicode-range splits cut payload for English content.
import '@fontsource/averia-serif-libre/latin-300.css'
import '@fontsource/averia-serif-libre/latin-400.css'
import '@fontsource/averia-serif-libre/latin-700.css'
import '@fontsource/poppins/latin-300.css'
import '@fontsource/poppins/latin-400.css'
import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-600.css'
import '@fontsource/caveat/latin-400.css'
import '@fontsource/caveat/latin-500.css'
import '@fontsource/caveat/latin-600.css'
import '@fontsource/caveat/latin-700.css'
import '@fontsource/patrick-hand/latin-400.css'

// Register service worker for performance optimization
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Show the app once React is ready, then fade out the boot loader
const bootLoader = document.getElementById('boot-loader')
const root = document.getElementById('root')

if (root) {
  root.style.display = 'block'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (bootLoader) {
  const fontsReady = document.fonts?.ready ?? Promise.resolve()
  const minWait = new Promise<void>(resolve => setTimeout(resolve, 800))
  const windowReady = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise<void>(resolve => window.addEventListener('load', () => resolve(), { once: true }))
  const maxWait = new Promise<void>(resolve => setTimeout(resolve, 3500))

  const hideLoader = () => {
    bootLoader.classList.add('loader-hidden')
    setTimeout(() => bootLoader.remove(), 600)
  }

  Promise.race([Promise.all([fontsReady, minWait, windowReady]), maxWait]).then(hideLoader)
}
