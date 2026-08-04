import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

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
