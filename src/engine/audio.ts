import audioManifest from '../content/audio-manifest.json'
import type { Settings } from './types'

/**
 * AudioSource — the audio abstraction required by the spec.
 *
 * 1. If a bundled Piper file exists for the text (src/content/audio-manifest.json,
 *    rendered by scripts/build-audio.py into public/audio/), play that file.
 * 2. Otherwise synthesize with the browser's SpeechSynthesis API (de-DE).
 * 3. If neither exists, callers get a visible status — the 🔊 button never
 *    silently does nothing.
 */
export type AudioEngine = 'bundled' | 'speech' | 'none'

export interface AudioStatus {
  engine: AudioEngine
  voiceName: string
}

interface Manifest {
  voice: string | null
  generatedAt: string | null
  files: Record<string, string>
}

const manifest = (audioManifest ?? { voice: null, generatedAt: null, files: {} }) as unknown as Manifest

export class AudioSource {
  private current: HTMLAudioElement | null = null
  private voices: SpeechSynthesisVoice[] = []
  private germanVoice: SpeechSynthesisVoice | null = null

  constructor(private settings: () => Pick<Settings, 'ttsRate'>) {
    if (typeof speechSynthesis !== 'undefined') {
      const load = () => {
        this.voices = speechSynthesis.getVoices()
        this.germanVoice = pickGermanVoice(this.voices)
      }
      load()
      speechSynthesis.addEventListener?.('voiceschanged', load)
    }
  }

  hasBundled(text: string): boolean {
    return Boolean(manifest.files[text])
  }

  status(): AudioStatus {
    if (Object.keys(manifest.files).length > 0) return { engine: 'bundled', voiceName: manifest.voice ?? 'Piper' }
    if (typeof speechSynthesis !== 'undefined' && this.germanVoice)
      return { engine: 'speech', voiceName: this.germanVoice.name }
    if (typeof speechSynthesis !== 'undefined' && this.voices.length > 0)
      return { engine: 'speech', voiceName: this.voices[0].name }
    if (typeof speechSynthesis !== 'undefined') return { engine: 'speech', voiceName: 'Sprachsynthese' }
    return { engine: 'none', voiceName: '' }
  }

  /** @returns 'bundled' | 'speech' | 'none' — what actually happened */
  speak(text: string, onEnd?: () => void, onError?: (msg: string) => void): AudioEngine {
    this.stop()
    const file = manifest.files[text]
    if (file) {
      const el = new Audio(`./audio/${file}`)
      this.current = el
      el.onended = () => onEnd?.()
      el.onerror = () => {
        // file missing at runtime? degrade to speech, never silence
        if (this.speakWithBrowser(text, onEnd)) return
        onError?.('Audio-Datei nicht gefunden und keine Sprachsynthese verfügbar.')
      }
      void el.play().catch(() => onError?.('Audio-Wiedergabe wurde blockiert. Tippe erneut.'))
      return 'bundled'
    }
    return this.speakWithBrowser(text, onEnd) ? 'speech' : (onError?.('Kein deutsches Sprachsynthese-Audio in diesem Browser verfügbar.'), 'none')
  }

  private speakWithBrowser(text: string, onEnd?: () => void): boolean {
    if (typeof speechSynthesis === 'undefined') return false
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'de-DE'
    if (this.germanVoice) u.voice = this.germanVoice
    u.rate = this.settings().ttsRate
    u.onend = () => onEnd?.()
    u.onerror = () => onEnd?.()
    speechSynthesis.speak(u)
    this.current = null
    return true
  }

  stop(): void {
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel()
    if (this.current) {
      this.current.pause()
      this.current = null
    }
  }
}

function pickGermanVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const german = voices.filter((v) => v.lang?.toLowerCase().startsWith('de'))
  if (!german.length) return null
  // prefer a natural-sounding local default
  const preferred = german.find((v) => /google|natural|premium|enhanced/i.test(v.name) && v.localService) ?? german.find((v) => v.localService) ?? german[0]
  return preferred
}
