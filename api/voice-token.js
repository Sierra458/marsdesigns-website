// Mints a short-lived xAI realtime client secret. The API key never leaves the server.
import { VOICE_INSTRUCTIONS } from './_voice-instructions.js'

export const AGENT_ID = 'agent_TisDKh7TdGX9SqZc' // Matt's saved Grok Voice Agent (reference)
const TOKEN_SECONDS = 60 // client secret lifetime; the socket stays up after it is used
const CALL_SECONDS = 600 // ~10 min cap per call
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
// Per serverless instance only. A second instance has its own map, so this is not a durable limit.
const hits = new Map()

const PRODUCTION_ORIGINS = new Set(['https://marsdesigns.io', 'https://www.marsdesigns.io'])
const PREVIEW_HOST = /^marsdesigns-website-[a-z0-9-]+-sierra458s-projects\.vercel\.app$/

export function callerAllowed(originHeader, refererHeader) {
  const candidate = typeof originHeader === 'string' && originHeader ? originHeader : refererHeader
  if (!candidate || typeof candidate !== 'string') return false
  let url
  try { url = new URL(candidate) } catch { return false }
  if (url.protocol !== 'https:') return false
  if (PRODUCTION_ORIGINS.has(url.origin)) return true
  const host = url.hostname
  return host === 'marsdesigns-website.vercel.app' || PREVIEW_HOST.test(host)
}

function limited(ip) {
  const now = Date.now()
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  arr.push(now)
  hits.set(ip, arr)
  if (hits.size > 5000) hits.clear()
  return arr.length > MAX_PER_WINDOW
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }
  if (!callerAllowed(req.headers.origin, req.headers.referer)) {
    return res.status(403).json({ error: 'forbidden' })
  }
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  if (limited(ip)) return res.status(429).json({ error: 'rate_limited' })
  if (!process.env.XAI_API_KEY) return res.status(500).json({ error: 'not_configured' })
  try {
    // xAI's ephemeral-token docs: this body does not accept "session" or "expires_after.anchor".
    // Instructions and tools are applied after connect with session.update. A holder of the token can still change them.
    const r = await fetch('https://api.x.ai/v1/realtime/client_secrets', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.XAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ expires_after: { seconds: TOKEN_SECONDS } }),
    })
    if (!r.ok) return res.status(502).json({ error: 'upstream', status: r.status })
    const data = await r.json()
    return res.status(200).json({
      token: data.value,
      expires_at: data.expires_at,
      max_seconds: CALL_SECONDS,
      session: {
        voice: 'ara',
        instructions: VOICE_INSTRUCTIONS,
        turn_detection: { type: 'server_vad' },
        audio: {
          input: { format: { type: 'audio/pcm', rate: 24000 } },
          output: { format: { type: 'audio/pcm', rate: 24000 } },
        },
        // https://docs.x.ai/developers/model-capabilities/audio/speech-to-speech
        // Custom function tools are declared on session.update and handled in the client.
        tools: [
          {
            type: 'function',
            name: 'end_call',
            description: 'Hang up after you have said a brief farewell. Call this once the visitor says goodbye or clearly signals they are done, and only after that farewell.',
            parameters: {
              type: 'object',
              properties: {},
            },
          },
        ],
      },
    })
  } catch {
    return res.status(502).json({ error: 'upstream' })
  }
}
