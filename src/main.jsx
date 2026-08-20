import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const el = document.getElementById('root')
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

if (el.hasChildNodes()) {
  hydrateRoot(el, app)
} else {
  createRoot(el).render(app)
}
