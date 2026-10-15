import React, { useEffect, useRef, useState } from 'react'

const RATE = 24000
const ORANGE = '#E8491C'

function b64FromInt16(int16) {
  const bytes = new Uint8Array(int16.buffer)
  let s = ''
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000))
  return btoa(s)
}
function int16FromB64(b64) {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new Int16Array(bytes.buffer)
}

const Wave = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M3 10v4M7 6v12M11 3v18M15 7v10M19 10v4" />
  </svg>
)

export default function VoiceWidget() {
  const [status, setStatus] = useState('idle') // idle|connecting|listening|speaking|error
  const [err, setErr] = useState('')
  const r = useRef({})

  const stop = (msg) => {
    const s = r.current
    try { s.ws && s.ws.close() } catch {}
    try { s.stream && s.stream.getTracks().forEach((t) => t.stop()) } catch {}
    try { s.ctx && s.ctx.close() } catch {}
    clearTimeout(s.timer)
    r.current = {}
    setStatus(msg ? 'error' : 'idle')
    setErr(msg || '')
  }
  useEffect(() => () => stop(), [])

  const start = async () => {
    setErr('')
    setStatus('connecting')
    try {
      const tr = await fetch('/api/voice-token', { method: 'POST' })
      if (tr.status === 429) throw new Error('Too many calls right now. Please try again in a few minutes.')
      if (!tr.ok) throw new Error('Voice assistant is unavailable right now.')
      const { token, session, max_seconds } = await tr.json()
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
      const ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: RATE })
      const ws = new WebSocket('wss://api.x.ai/v1/realtime?model=grok-voice-latest', [`xai-client-secret.${token}`])
      const s = (r.current = { ws, stream, ctx, playAt: 0, sources: new Set() })
      s.timer = setTimeout(() => stop(), (max_seconds || 600) * 1000)

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'session.update', session }))
        const src = ctx.createMediaStreamSource(stream)
        const proc = ctx.createScriptProcessor(4096, 1, 1)
        proc.onaudioprocess = (e) => {
          if (ws.readyState !== 1) return
          const f = e.inputBuffer.getChannelData(0)
          const out = new Int16Array(f.length)
          for (let i = 0; i < f.length; i++) out[i] = Math.max(-1, Math.min(1, f[i])) * 0x7fff
          ws.send(JSON.stringify({ type: 'input_audio_buffer.append', audio: b64FromInt16(out) }))
        }
        src.connect(proc)
        proc.connect(ctx.destination)
        setStatus('listening')
      }
      ws.onmessage = (ev) => {
        let m
        try { m = JSON.parse(ev.data) } catch { return }
        if (m.type === 'response.output_audio.delta' && m.delta) {
          const pcm = int16FromB64(m.delta)
          const buf = ctx.createBuffer(1, pcm.length, RATE)
          const ch = buf.getChannelData(0)
          for (let i = 0; i < pcm.length; i++) ch[i] = pcm[i] / 0x8000
          const node = ctx.createBufferSource()
          node.buffer = buf
          node.connect(ctx.destination)
          const t = Math.max(ctx.currentTime, s.playAt)
          node.start(t)
          s.playAt = t + buf.duration
          s.sources.add(node)
          node.onended = () => {
            s.sources.delete(node)
            if (!s.sources.size) setStatus('listening')
          }
          setStatus('speaking')
        } else if (m.type === 'input_audio_buffer.speech_started') {
          s.sources.forEach((n) => { try { n.stop() } catch {} }) // barge-in
          s.sources.clear()
          s.playAt = 0
          setStatus('listening')
        } else if (m.type === 'error') {
          console.warn('voice error', m.error && m.error.message)
        }
      }
      ws.onerror = () => stop('Connection problem. Please try again.')
      ws.onclose = () => { if (r.current.ws === ws) stop() }
    } catch (e) {
      stop(e && e.name === 'NotAllowedError' ? 'Microphone access is needed for voice chat.' : (e && e.message) || 'Something went wrong.')
    }
  }

  const active = status === 'connecting' || status === 'listening' || status === 'speaking'
  const label = { connecting: 'Connecting…', listening: 'Listening…', speaking: 'Speaking…' }[status]

  return (
    <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, fontFamily: 'inherit' }}>
      {(active || err) && (
        <div role="status" aria-live="polite" style={{ background: '#111', color: '#fff', borderRadius: 12, padding: '10px 14px', maxWidth: 260, fontSize: 14, boxShadow: '0 6px 24px rgba(0,0,0,.35)' }}>
          <div style={{ fontWeight: 600 }}>{err || label}</div>
          <div style={{ opacity: 0.7, fontSize: 12, marginTop: 4 }}>You're talking to an AI assistant. Calls end after 10 minutes.</div>
          {active && (
            <button onClick={() => stop()} style={{ marginTop: 8, background: '#fff', color: '#111', border: 0, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontWeight: 600 }}>
              End call
            </button>
          )}
        </div>
      )}
      <button
        onClick={active ? () => stop() : start}
        aria-label={active ? 'End voice chat' : 'Talk to our AI voice assistant'}
        title={active ? 'End voice chat' : 'Talk to our AI assistant'}
        style={{ width: 60, height: 60, borderRadius: '50%', border: 0, background: ORANGE, color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center', boxShadow: active ? `0 0 0 6px ${ORANGE}55, 0 6px 20px rgba(0,0,0,.35)` : '0 6px 20px rgba(0,0,0,.35)' }}
      >
        <Wave />
      </button>
    </div>
  )
}
