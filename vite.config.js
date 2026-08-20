import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const PRIVACY_PATHS = new Set(['/privacy', '/privacy-policy'])

function privacyRoutes() {
  return {
    name: 'privacy-routes',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url?.split('?')[0]
        if (PRIVACY_PATHS.has(url)) {
          req.url = '/index.html'
        }
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url?.split('?')[0]
        if (url === '/privacy') req.url = '/privacy/index.html'
        if (url === '/privacy-policy') req.url = '/privacy-policy/index.html'
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), privacyRoutes()],
  appType: 'mpa',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
