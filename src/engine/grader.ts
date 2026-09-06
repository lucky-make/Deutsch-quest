import type { KnowledgeItem } from './types'

/** what the learner is expected to produce */
export function answerKey(item: KnowledgeItem): string {
  return item.cloze ?? item.german
}

/** lowercase, strip punctuation, collapse whitespace, ß→ss */
export function normalizeGerman(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?;:"„“”‚‘'’()\[\]…–—-]/g, ' ')
    .replace(/ß/g, 'ss')
    .replace(/\s+/g, ' ')
    .trim()
}

/** strip umlaut diacritics (ä→a …) */
function withoutUmlauts(s: string): string {
  return s.replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u')
}

/** compare with umlaut tolerance both ways (fuer ≡ für, haette ≡ hätte) */
function foldUmlauts(s: string): string {
  return withoutUmlauts(s).replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u')
}

export function germanMatches(expected: string, attempt: string, alts: string[] = []): boolean {
  const tryOne = (e: string) => {
    const a = normalizeGerman(attempt)
    const b = normalizeGerman(e)
    return a === b || (foldUmlauts(a) !== '' && foldUmlauts(a) === foldUmlauts(b))
  }
  return tryOne(expected) || alts.some(tryOne)
}

/** deterministic small shuffle (so tests and UI stay stable) */
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr]
  let s = seed >>> 0 || 1
  const rand = () => {
    s ^= s << 13; s >>>= 0
    s ^= s >> 17
    s ^= s << 5; s >>>= 0
    return s / 4294967296
  }
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** "Ich hätte gern einen Kaffee" → "I. h. g. e. K." — first letters only */
export function skeleton(german: string): string {
  return german
    .split(/\s+/)
    .map((w) => (w.length <= 2 ? w : w[0] + '.'))
    .join(' ')
}

/** word tiles for the reconstruction step */
export function tiles(item: KnowledgeItem): string[] {
  const key = answerKey(item)
  return seededShuffle(key.split(/\s+/), hash(item.id))
}

/** multiple-choice German options (used as the final rung for single words) */
export function mcqOptions(item: KnowledgeItem, pool: KnowledgeItem[], count = 4): string[] {
  const correct = answerKey(item)
  const distractors = seededShuffle(
    pool.filter((p) => p.id !== item.id && p.type === item.type),
    hash(item.id + ':mcq'),
  ).map(answerKey)
  const out = [correct]
  for (const d of distractors) {
    if (out.length >= count) break
    if (!out.includes(d)) out.push(d)
  }
  // pad from any items if the type pool is small (tiny fixtures in tests)
  for (const d of seededShuffle(pool.filter((p) => p.id !== item.id), hash(item.id + ':pad')).map(answerKey)) {
    if (out.length >= count) break
    if (!out.includes(d)) out.push(d)
  }
  return seededShuffle(out, hash(item.id + ':order'))
}
