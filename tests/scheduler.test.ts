import { describe, expect, it } from 'vitest'
import { buildSession, DEFAULT_WEIGHTS, dueCandidates, scoreCandidate } from '../src/engine/scheduler'
import type { KnowledgeItem, ReviewState, StoryScene } from '../src/engine/types'

// ——— fixture helpers ————————————————————————————————————————

function item(id: string, opts: Partial<KnowledgeItem> = {}): KnowledgeItem {
  return {
    id,
    type: 'word',
    german: id,
    meaning: id,
    audio: 'tts',
    introducedInScene: opts.introducedInScene ?? 'sA',
    tags: opts.tags ?? [],
    cefrLevel: 'A1',
    ...opts,
  } as KnowledgeItem
}

function state(itemId: string, daysOver: number, difficulty = 5, lapses = 0): ReviewState {
  return {
    itemId,
    stability: 10,
    difficulty,
    dueDate: new Date(Date.now() - daysOver * 86_400_000).toISOString(),
    reviewCount: 3,
    lapses,
  }
}

function scene(id: string, contextTags: string[], introduced: string[] = []): StoryScene {
  return {
    id,
    episodeId: 'e',
    title: id,
    titleEn: id,
    place: '',
    contextTags,
    requiredItems: [],
    introducedItems: introduced,
    beats: [],
  }
}

// ——— invariant tests ————————————————————————————————————————

describe('invariant 2: a due item from an unrelated context is never excluded, only down-ranked', () => {
  it('keeps a due cafe item eligible in a clinic scene', () => {
    const now = new Date()
    const cafeItem = item('der-kaffee', { tags: ['cafe', 'food'], introducedInScene: 'sA' })
    const clinicItem = item('das-rezept', { tags: ['health'], introducedInScene: 'sC' })
    const clinicScene = scene('sX', ['health', 'doctor'])
    const reviews = new Map([
      ['der-kaffee', state('der-kaffee', 5)],
      ['das-rezept', state('das-rezept', 5)],
    ])
    const items = [cafeItem, clinicItem]

    // both are candidates
    const cands = dueCandidates(items, reviews, now)
    expect(cands.map((c) => c.item.id).sort()).toEqual(['das-rezept', 'der-kaffee'])

    // both stay in the session plan, context only orders them
    const plan = buildSession(clinicScene, { items, reviews, now, recent: { itemIds: [], tags: [], sceneIds: [] }, maxDue: 2 })
    expect(plan.dueIds).toContain('der-kaffee')
    expect(plan.dueIds).toContain('das-rezept')
    expect(plan.dueIds[0]).toBe('das-rezept') // context bonus ranks the on-topic one first

    // the score difference is exactly the context bonus (bonus only — never exclusion)
    const ctx = { now, scene: clinicScene, recent: { itemIds: [], tags: [], sceneIds: [] } }
    const sCafe = scoreCandidate(cafeItem, reviews.get('der-kaffee'), ctx)
    const sClinic = scoreCandidate(clinicItem, reviews.get('das-rezept'), ctx)
    expect(sCafe).toBeGreaterThan(-100) // never excluded — still a positive/valid candidate score
    expect(sClinic - sCafe).toBeCloseTo(DEFAULT_WEIGHTS.context * (1 / 3), 5) // 1 shared tag → 1/3 context bonus; variety equal for both
  })

  it('a due item with ZERO shared tags is still selectable when it is the only due one', () => {
    const now = new Date()
    const lonely = item('der-koffer', { tags: ['arrival'] })
    const plan = buildSession(scene('sQ', ['health']), {
      items: [lonely],
      reviews: new Map([['der-koffer', state('der-koffer', 1)]]),
      now,
      recent: { itemIds: [], tags: [], sceneIds: [] },
      maxDue: 5,
    })
    expect(plan.dueIds).toEqual(['der-koffer'])
  })
})

describe('invariant 3: interleaving is enforced by scoring, not by shuffling', () => {
  const items = [
    item('a1', { introducedInScene: 'sA', tags: ['cafe'] }),
    item('a2', { introducedInScene: 'sA', tags: ['cafe', 'food'] }),
    item('a3', { introducedInScene: 'sA', tags: ['cafe'] }),
    item('b1', { introducedInScene: 'sB', tags: ['health'] }),
    item('b2', { introducedInScene: 'sB', tags: ['health'] }),
    item('c1', { introducedInScene: 'sC', tags: ['work'] }),
  ]

  it('no two items from the same origin scene are adjacent when alternatives exist', () => {
    const now = new Date()
    const reviews = new Map(items.map((it, i) => [it.id, state(it.id, i)]))
    const plan = buildSession(scene('sQ', []), {
      items,
      reviews,
      now,
      recent: { itemIds: [], tags: [], sceneIds: [] },
      maxDue: 6,
    })
    const origin = plan.dueIds.map((id) => items.find((i) => i.id === id)!.introducedInScene)
    for (let i = 1; i < origin.length; i++) {
      if (origin[i] === origin[i - 1]) {
        // adjacency allowed ONLY if no alternative existed at that point
        const rest = origin.slice(i + 1)
        expect(rest).toHaveLength(0)
      }
    }
  })

  it('is deterministic — no shuffle() involved', () => {
    const now = new Date()
    const reviews = new Map(items.map((it, i) => [it.id, state(it.id, i)]))
    const opts = { items, reviews, now, recent: { itemIds: [], tags: [], sceneIds: [] }, maxDue: 6 }
    const p1 = buildSession(scene('sQ', []), opts)
    const p2 = buildSession(scene('sQ', []), opts)
    expect(p1.dueIds).toEqual(p2.dueIds)
  })
})

describe('invariant 1: schedule by item, never by lesson', () => {
  it('the scene pulls due items from the ENTIRE pool, not its own episode', () => {
    const now = new Date()
    const farAway = item('die-abrechnung', { tags: ['law'], introducedInScene: 'b2e3s1' })
    const own = item('lokal', { tags: ['cafe'], introducedInScene: 'sHere' })
    const reviews = new Map([
      ['die-abrechnung', state('die-abrechnung', 30, 8, 3)],
      ['lokal', state('lokal', 1)],
    ])
    const plan = buildSession(scene('sHere', ['cafe'], ['lokal']), {
      items: [farAway, own],
      reviews,
      now,
      recent: { itemIds: [], tags: [], sceneIds: [] },
      maxDue: 2,
    })
    // the weak, very overdue, far-away item outranks the mildly due own one
    expect(plan.dueIds[0]).toBe('die-abrechnung')
  })
})

describe('invariant 4: memory strength never gates prompting', () => {
  it('stability is not used anywhere in scoreCandidate', () => {
    const now = new Date()
    const it0 = item('x')
    const stable = state('x', 0, 5, 0); stable.stability = 300
    const weak = state('x', 0, 5, 0); weak.stability = 0.1
    const ctx = { now, scene: scene('s', []), recent: { itemIds: [], tags: [], sceneIds: [] } }
    expect(scoreCandidate(it0, stable, ctx)).toBe(scoreCandidate(it0, weak, ctx))
  })
})
