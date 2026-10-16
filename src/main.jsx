import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import VoiceWidget from './VoiceWidget'
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

// Voice widget mounts client-side only (outside the prerendered/hydrated tree)
const voiceEl = document.createElement('div')
voiceEl.id = 'mars-voice'
document.body.appendChild(voiceEl)
createRoot(voiceEl).render(<VoiceWidget />)
