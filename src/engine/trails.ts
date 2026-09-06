import type { ContentRegistry } from './registry'
import type { RetrievalLogEntry, StoryScene } from './types'

export interface ResurfacingTrail {
  itemId: string
  german: string
  fromSceneId: string
  fromSceneTitle: string
  toSceneIds: string[]
  toSceneTitles: string[]
  sharedTags: string[]
  /** true when this is one of the named, checkable chains */
  named?: boolean
}

export const NAMED_CHAINS: { itemId: string; toSceneId: string }[] = [
  // "Ich hätte gern …" learned at the bakery in A1, natural due retrieval at the
  // neighbourhood festival in B2 — different context tags, no requiredItems link.
  { itemId: 'ich-haette-gern', toSceneId: 'b2e4s2' },
  // "der Schlüssel" from the very first meeting with Frau Brügge, due again at
  // the flat hand-over in B1.
  { itemId: 'der-schluessel', toSceneId: 'b1e4s2' },
]

function shared(a: string[], b: string[]): string[] {
  return a.filter((t) => b.includes(t))
}

/**
 * Find demonstrable resurfacing chains: items whose origin scene is far from
 * a later scene that shares context tags with the item but does NOT depend on
 * it via requiredItems — i.e. retrieval happens because of scheduling, not
 * because the scene script demands it.
 */
export function resurfacingChains(reg: ContentRegistry): ResurfacingTrail[] {
  const trails: ResurfacingTrail[] = []
  for (const item of reg.items) {
    const origin = reg.sceneById.get(item.introducedInScene)
    if (!origin) continue
    const later = reg.scenesInOrder.filter((s) => {
      if (s.id === origin.id) return false
      if (s.requiredItems.includes(item.id)) return false
      const originIdx = reg.scenesInOrder.indexOf(origin)
      const idx = reg.scenesInOrder.indexOf(s)
      return idx > originIdx + 3 // "much later", not the neighbouring scene
    })
    const hits = later.filter((s) => shared(item.tags, s.contextTags).length > 0)
    for (const target of hits) {
      trails.push({
        itemId: item.id,
        german: item.german,
        fromSceneId: origin.id,
        fromSceneTitle: `${origin.title} (${origin.episodeId})`,
        toSceneIds: [target.id],
        toSceneTitles: [`${target.title} (${target.episodeId})`],
        sharedTags: shared(item.tags, target.contextTags),
      })
    }
  }
  // attach the named flag
  for (const t of trails) {
    t.named = NAMED_CHAINS.some((c) => c.itemId === t.itemId && t.toSceneIds.includes(c.toSceneId))
  }
  // named chains first, then by tag overlap
  trails.sort((a, b) => Number(!!b.named) - Number(!!a.named) || b.sharedTags.length - a.sharedTags.length)
  return trails
}

/** live evidence from the learner's own retrieval log */
export function liveTrailHits(log: RetrievalLogEntry[], reg: ContentRegistry): { itemId: string; german: string; from: string; to: string }[] {
  const out: { itemId: string; german: string; from: string; to: string }[] = []
  const sceneOf = (id: string): StoryScene | undefined => reg.sceneById.get(id)
  for (const entry of log) {
    const item = reg.itemById.get(entry.itemId)
    const target = sceneOf(entry.sceneId)
    if (!item || !target) continue
    if (item.introducedInScene === entry.sceneId) continue // first-encounter check, not resurfacing
    const origin = sceneOf(item.introducedInScene)
    if (!origin) continue
    out.push({
      itemId: item.id,
      german: item.german,
      from: origin.title,
      to: target.title,
    })
  }
  // most recent last; cap for display
  return out.slice(-30)
}
