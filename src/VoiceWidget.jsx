import React, { useEffect, useRef, useState } from 'react'

const RATE = 24000
const ORANGE = '#E8491C'
const GREETING_LINE = "Hi, I'm Ara from Mars Designs. How can I help you?"

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

function stopTracks(stream) {
  try { stream && stream.getTracks().forEach((t) => t.stop()) } catch {}
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
    r.current = {}
    try { s.ws && s.ws.close() } catch {}
    stopTracks(s.stream)
    try { s.ctx && s.ctx.close() } catch {}
    clearTimeout(s.timer)
    clearTimeout(s.greetTimer)
    clearTimeout(s.hangupTimer)
    clearTimeout(s.endFallback)
    setStatus(msg ? 'error' : 'idle')
    setErr(msg || '')
  }
  useEffect(() => () => stop(), [])

  const start = async () => {
    setErr('')
    setStatus('connecting')
    // Create the audio graph inside the click so playback is allowed before the awaits.
    const ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: RATE })
    ctx.resume().catch(() => {})
    const s = (r.current = { ctx, playAt: 0, sources: new Set(), greeted: false })
    const tokenPromise = fetch('/api/voice-token', { method: 'POST' })
    const micPromise = navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })

    const connectMic = () => {
      if (r.current !== s || s.proc || !s.greeted || !s.stream || !s.ws || s.ws.readyState !== 1) return
      const src = ctx.createMediaStreamSource(s.stream)
      const proc = ctx.createScriptProcessor(4096, 1, 1)
      s.proc = proc
      proc.onaudioprocess = (e) => {
        if (r.current !== s || !s.greeted || s.ws.readyState !== 1) return
        const f = e.inputBuffer.getChannelData(0)
        const out = new Int16Array(f.length)
        for (let i = 0; i < f.length; i++) out[i] = Math.max(-1, Math.min(1, f[i])) * 0x7fff
        s.ws.send(JSON.stringify({ type: 'input_audio_buffer.append', audio: b64FromInt16(out) }))
      }
      // ScriptProcessor only runs while connected. A silent gain keeps the mic off the speakers.
      const mute = ctx.createGain()
      mute.gain.value = 0
      src.connect(proc)
      proc.connect(mute)
      mute.connect(ctx.destination)
      setStatus((cur) => (cur === 'speaking' ? cur : 'listening'))
    }

    const sendGreeting = () => {
      if (r.current !== s || s.greeted || !s.ws || s.ws.readyState !== 1) return
      s.greeted = true
      clearTimeout(s.greetTimer)
      s.ws.send(JSON.stringify({
        type: 'response.create',
        response: { instructions: `Say exactly this and then stop: ${GREETING_LINE}` },
      }))
      connectMic()
    }

    const finishEndCall = () => {
      if (r.current !== s || s.ended) return
      s.ended = true
      clearTimeout(s.hangupTimer)
      clearTimeout(s.endFallback)
      const ws = s.ws
      if (ws && ws.readyState === 1 && s.endCallId) {
        try {
          ws.send(JSON.stringify({
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id: s.endCallId,
              output: JSON.stringify({ status: 'ended' }),
            },
          }))
        } catch {}
      }
      stop()
    }

    const scheduleEnd = () => {
      if (r.current !== s || s.ended || s.hangupTimer || !s.endCallId || !s.responseDone) return
      const remainingMs = Math.max(0, (s.playAt - ctx.currentTime) * 1000)
      const sinceDone = Date.now() - (s.responseDoneAt || Date.now())
      // Wait out the farewell already queued. If nothing is left to play, wait until ~1.5s after response.done.
      const waitMs = remainingMs > 80 ? remainingMs + 120 : Math.max(0, 1500 - sinceDone)
      s.hangupTimer = setTimeout(finishEndCall, waitMs)
    }

    micPromise.then(
      (stream) => {
        if (r.current !== s) { stopTracks(stream); return }
        s.stream = stream
        connectMic()
      },
      (e) => {
        if (r.current !== s) return
        stop(e && e.name === 'NotAllowedError' ? 'Microphone access is needed for voice chat.' : (e && e.message) || 'Something went wrong.')
      },
    )

    try {
      const tr = await tokenPromise
      if (r.current !== s) return
      if (tr.status === 429) throw new Error('Too many calls right now. Please try again in a few minutes.')
      if (!tr.ok) throw new Error('Voice assistant is unavailable right now.')
      const { token, session, max_seconds } = await tr.json()
      if (r.current !== s) return
      // Open the socket as soon as the token arrives. Do not wait on the mic prompt.
      const ws = new WebSocket('wss://api.x.ai/v1/realtime?model=grok-voice-latest', [`xai-client-secret.${token}`])
      s.ws = ws
      s.timer = setTimeout(() => { if (r.current === s) stop() }, (max_seconds || 600) * 1000)

      ws.onopen = () => {
        if (r.current !== s) { ws.close(); return }
        ws.send(JSON.stringify({ type: 'session.update', session }))
        // Safety net only. The greeting itself waits for session.updated so Ara's voice is already set.
        s.greetTimer = setTimeout(() => sendGreeting(), 8000)
      }
      ws.onmessage = (ev) => {
        if (r.current !== s) return
        let m
        try { m = JSON.parse(ev.data) } catch { return }
        if (m.type === 'session.updated') {
          sendGreeting()
        } else if (m.type === 'response.output_audio.delta' && m.delta) {
          s.cutPlayback = false
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
            if (r.current !== s || s.sources.size || s.cutPlayback) return
            if (s.endCallId && s.responseDone) finishEndCall()
            else if (!s.endCallId) setStatus('listening')
          }
          setStatus('speaking')
        } else if (m.type === 'response.created') {
          s.responseDone = false
        } else if (m.type === 'response.done') {
          s.responseDone = true
          s.responseDoneAt = Date.now()
          clearTimeout(s.endFallback)
          scheduleEnd()
        } else if (m.type === 'response.function_call_arguments.done' && m.name === 'end_call' && !s.endCallId) {
          // Docs: this event carries name, call_id, and arguments. Reply later with
          // conversation.item.create function_call_output. Do not response.create; that would keep her talking.
          s.endCallId = m.call_id
          if (!s.responseDone) {
            s.endFallback = setTimeout(() => {
              if (r.current !== s || s.ended) return
              s.responseDone = true
              s.responseDoneAt = Date.now()
              scheduleEnd()
            }, 1500)
          }
          scheduleEnd()
        } else if (m.type === 'input_audio_buffer.speech_started') {
          // Stopping a buffer fires onended. Don't treat that as the farewell finishing.
          s.cutPlayback = true
          s.sources.forEach((n) => { try { n.stop() } catch {} })
          s.sources.clear()
          s.playAt = 0
          setStatus('listening')
        } else if (m.type === 'error') {
          console.warn('voice error', m.error && m.error.message)
        }
      }
      ws.onerror = () => { if (r.current === s) stop('Connection problem. Please try again.') }
      ws.onclose = () => { if (r.current.ws === ws) stop() }
    } catch (e) {
      if (r.current !== s) return
      stop((e && e.message) || 'Something went wrong.')
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
