// Mints a short-lived xAI realtime client secret. The API key never leaves the server.
import { VOICE_INSTRUCTIONS } from './_voice-instructions.js'

export const AGENT_ID = 'agent_TisDKh7TdGX9SqZc' // Matt's saved Grok Voice Agent (reference)
const SESSION_SECONDS = 600 // ~10 min cap per call
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map() // best-effort per-instance rate limit

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
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  if (limited(ip)) return res.status(429).json({ error: 'rate_limited' })
  if (!process.env.XAI_API_KEY) return res.status(500).json({ error: 'not_configured' })
  try {
    const r = await fetch('https://api.x.ai/v1/realtime/client_secrets', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.XAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ expires_after: { seconds: SESSION_SECONDS } }),
    })
    if (!r.ok) return res.status(502).json({ error: 'upstream', status: r.status })
    const data = await r.json()
    return res.status(200).json({
      token: data.value,
      expires_at: data.expires_at,
      max_seconds: SESSION_SECONDS,
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
