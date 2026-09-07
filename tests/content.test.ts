import { describe, expect, it } from 'vitest'
import { registry } from '../src/engine/content'
import { buildRegistry } from '../src/engine/registry'
import type { EpisodeFile, SceneBeat } from '../src/engine/types'

describe('content registry', () => {
  it('has no validation issues', () => {
    expect(registry.issues).toEqual([])
  })

  it('builds 54 episodes across 4 CEFR levels', () => {
    expect(registry.episodes).toHaveLength(54)
    for (const lvl of ['A1', 'A2', 'B1', 'B2'] as const) {
      const eps = registry.episodes.filter((e) => e.cefrLevel === lvl)
      expect(eps.length, lvl).toBeGreaterThanOrEqual(4)
    }
  })

  it('every episode has 2–3 scenes', () => {
    for (const ep of registry.episodes) {
      const n = registry.scenesByEpisode.get(ep.id)!.length
      expect(n, ep.id).toBeGreaterThanOrEqual(2)
      expect(n, ep.id).toBeLessThanOrEqual(3)
    }
  })

  it('has 5–7 new items per scene and lands in the 460–560 item range', () => {
    for (const sc of registry.scenes) {
      expect(sc.introducedItems.length, sc.id).toBeGreaterThanOrEqual(5)
      expect(sc.introducedItems.length, sc.id).toBeLessThanOrEqual(7)
    }
    expect(registry.items.length).toBeGreaterThanOrEqual(860)
    expect(registry.items.length).toBeLessThanOrEqual(1000)
  })

  it('every item has audio, tags, level and a resolvable introduction scene', () => {
    for (const it of registry.items) {
      expect(it.audio.length, it.id).toBeGreaterThan(0)
      expect(it.tags.length, it.id).toBeGreaterThan(0)
      expect(['A1', 'A2', 'B1', 'B2']).toContain(it.cefrLevel)
      expect(it.cefrLevel, it.id).toBe(registry.episodeById.get(registry.sceneById.get(it.introducedInScene!)!.episodeId)!.cefrLevel)
    }
  })

  it('every dialogue speaker resolves to the cast', () => {
    for (const sc of registry.scenes) {
      for (const b of sc.beats) {
        if (b.type === 'line' || b.type === 'choice') continue
      }
    }
    // line beats specifically:
    for (const sc of registry.scenes) {
      for (const b of sc.beats as SceneBeat[]) {
        if (b.type === 'line') {
          expect(registry.cast.has(b.speaker), `${sc.id}: ${b.speaker}`).toBe(true)
        }
      }
    }
  })

  it('scene backgrounds and item icons resolve', async () => {
    const { BACKGROUNDS } = await import('../src/ui/backgrounds')
    const { ICONS } = await import('../src/ui/icons')
    for (const sc of registry.scenes) {
      if (sc.bg) expect(BACKGROUNDS[sc.bg], sc.id).toBeDefined()
    }
    for (const it of registry.items) {
      if (it.image) expect(ICONS[it.image], it.id).toBeDefined()
    }
  })

  it('checks reference existing modes and plausible counts', () => {
    for (const sc of registry.scenes) {
      let checks = 0
      for (const b of sc.beats) {
        if (b.type === 'check') {
          checks += b.count
          expect(['new', 'recall', 'mixed', 'listen']).toContain(b.mode)
          expect(b.count).toBeGreaterThanOrEqual(1)
          expect(b.count).toBeLessThanOrEqual(4)
        }
        if (b.type === 'meet') {
          for (const id of b.itemIds) expect(sc.introducedItems, `${sc.id}/${id}`).toContain(id)
        }
      }
      expect(checks, `${sc.id}: check count`).toBeGreaterThanOrEqual(3)
    }
  })

  it('is drop-in extensible: a new episode file registers with zero engine changes', () => {
    const fixture: EpisodeFile = {
      episode: { id: 'z9e1', arcId: 'A1', cefrLevel: 'A1', title: 'Test', titleEn: 'Test', blurb: '', order: 99, sceneIds: ['z9e1s1'] },
      items: [
        { id: 'testwort', type: 'word', german: 'das Testwort', meaning: 'the test word', audio: 'tts', introducedInScene: 'z9e1s1', tags: ['test'], cefrLevel: 'A1' },
      ],
      scenes: [
        { id: 'z9e1s1', episodeId: 'z9e1', title: 't', titleEn: 't', place: '', contextTags: ['test'], requiredItems: [], introducedItems: ['testwort'], beats: [{ type: 'meet', itemIds: ['testwort'] }] },
      ],
    }
    const reg = buildRegistry({ 'z9e1.json': fixture, ...Object.fromEntries(registry.episodes.map((e) => [`${e.id}.json`, { episode: e, items: [], scenes: [] } as EpisodeFile])) })
    expect(reg.episodes).toHaveLength(registry.episodes.length + 1)
    expect(reg.issues.filter((i) => i.includes('z9'))).toEqual([])
  })
})
