import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource/bitter/400.css'
import '@fontsource/bitter/400-italic.css'
import '@fontsource/bitter/600.css'
import '@fontsource/bitter/700.css'
import '@fontsource/outfit/300.css'
import '@fontsource/outfit/400.css'
import '@fontsource/outfit/500.css'
import '@fontsource/outfit/600.css'
import '@fontsource/outfit/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/600.css'
import './index.css'
import App from './App.jsx'

if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', window.location.hash.slice(1))
}

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

const root = document.getElementById('root')

if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
