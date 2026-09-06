import { describe, expect, it } from 'vitest'
import { registry } from '../src/engine/content'
import { buildSession } from '../src/engine/scheduler'
import { NAMED_CHAINS, resurfacingChains } from '../src/engine/trails'
import type { ReviewState } from '../src/engine/types'

/**
 * The named, checkable resurfacing chain — spec requirement:
 * an item introduced early is provably retrievable much later in a scene
 * with a different context tag, and NOT because the scene requires it.
 */
describe('named resurfacing chain: „Ich hätte gern …“', () => {
  const item = registry.itemById.get('ich-haette-gern')!
  const origin = registry.sceneById.get('a1e2s2')!
  const target = registry.sceneById.get('b2e4s2')!

  it('is introduced at the bakery in A1', () => {
    expect(item).toBeDefined()
    expect(origin.episodeId).toBe('a1e2')
    expect(origin.contextTags).toContain('shopping')
  })

  it('appears much later in B2 with different context tags — no requiredItems dependency', () => {
    const originIdx = registry.scenesInOrder.findIndex((s) => s.id === origin.id)
    const targetIdx = registry.scenesInOrder.findIndex((s) => s.id === target.id)
    expect(targetIdx - originIdx).toBeGreaterThan(20) // "much later"
    expect(target.contextTags).not.toEqual(origin.contextTags)
    expect(target.contextTags).toContain('request')
    expect(target.requiredItems).not.toContain('ich-haette-gern') // retrieval happens via scheduling, not scripting
  })

  it('is retrievable in that scene purely because it is due + context bonus', () => {
    const now = new Date()
    const reviews = new Map<string, ReviewState>()
    reviews.set('ich-haette-gern', {
      itemId: 'ich-haette-gern',
      stability: 20,
      difficulty: 4.5,
      dueDate: new Date(now.getTime() - 3 * 86_400_000).toISOString(),
      reviewCount: 6,
      lapses: 1,
    })
    // a decoy with the same overdue profile but no shared tags
    reviews.set('der-koffer', {
      itemId: 'der-koffer',
      stability: 20,
      difficulty: 4.5,
      dueDate: new Date(now.getTime() - 3 * 86_400_000).toISOString(),
      reviewCount: 6,
      lapses: 1,
    })
    const plan = buildSession(target, { items: registry.items, reviews, now, recent: { itemIds: [], tags: [], sceneIds: [] }, maxDue: 2 })
    expect(plan.dueIds[0]).toBe('ich-haette-gern') // shared 'request'+'food' tags rank it first
    expect(plan.dueIds).toContain('der-koffer') // the decoy is NOT excluded (invariant 2), only down-ranked
  })

  it('is listed by the trail finder as a named chain', () => {
    const chains = resurfacingChains(registry)
    const hit = chains.find((c) => c.itemId === 'ich-haette-gern' && c.toSceneIds.includes('b2e4s2'))
    expect(hit).toBeDefined()
    expect(hit!.named).toBe(true)
    expect(hit!.sharedTags.length).toBeGreaterThan(0)
    expect(NAMED_CHAINS.some((n) => n.itemId === 'ich-haette-gern')).toBe(true)
  })
})

describe('second chain: „der Schlüssel“', () => {
  it('surfaces at the flat handover in B1 via scheduling, not via requiredItems', () => {
    const item = registry.itemById.get('der-schluessel')!
    const target = registry.sceneById.get('b1e4s2')!
    expect(item.introducedInScene).toBe('a1e1s3')
    expect(target.requiredItems).not.toContain('der-schluessel')
    const shared = item.tags.filter((t) => target.contextTags.includes(t))
    expect(shared).toContain('home')

    const now = new Date()
    const reviews = new Map<string, ReviewState>([
      ['der-schluessel', {
        itemId: 'der-schluessel',
        stability: 15,
        difficulty: 5,
        dueDate: new Date(now.getTime() - 2 * 86_400_000).toISOString(),
        reviewCount: 5,
        lapses: 0,
      }],
    ])
    const plan = buildSession(target, { items: registry.items, reviews, now, recent: { itemIds: [], tags: [], sceneIds: [] }, maxDue: 3 })
    expect(plan.dueIds[0]).toBe('der-schluessel')
  })
})

describe('live trail evidence exists across the content', () => {
  it('finds many resurfacing chains spanning levels', () => {
    const chains = resurfacingChains(registry)
    expect(chains.length).toBeGreaterThan(20)
    const crossLevel = chains.filter((c) => {
      const from = c.fromSceneId.slice(0, 2)
      const to = (c.toSceneIds[0] ?? '').slice(0, 2)
      return from !== to
    })
    expect(crossLevel.length).toBeGreaterThan(5)
  })
})
