import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

// Production responses get these from vercel.json. Dev and preview read the
// same rule so every local route sends the identical headers.
function headersForAllRoutes() {
  const vercel = JSON.parse(fs.readFileSync(path.join(rootDir, 'vercel.json'), 'utf8'))
  const rule = vercel.headers?.find((entry) => entry.source === '/(.*)')
  if (!rule?.headers?.length) {
    throw new Error('vercel.json is missing security headers for /(.*)')
  }
  return Object.fromEntries(rule.headers.map(({ key, value }) => [key, value]))
}

const securityHeaders = headersForAllRoutes()

const STATIC_PAGE_PATHS = new Set(['/privacy', '/privacy-policy', '/refund'])

function staticPageRoutes() {
  return {
    name: 'static-page-routes',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url?.split('?')[0]
        if (STATIC_PAGE_PATHS.has(url)) {
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
        if (url === '/refund') req.url = '/refund/index.html'
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), staticPageRoutes()],
  appType: 'mpa',
  server: { headers: securityHeaders },
  preview: { headers: securityHeaders },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
