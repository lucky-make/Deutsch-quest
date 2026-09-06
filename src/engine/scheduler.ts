import type { KnowledgeItem, ReviewState, RecentContext, StoryScene } from './types'
import { daysOverdue } from './fsrs'

/**
 * The retrieval engine.
 *
 * Invariant 1 — schedule by item, never by lesson:
 *   candidates come from the GLOBAL pool of ReviewStates, not from the scene.
 * Invariant 2 — context is a ranking bonus, never a filter:
 *   every due item stays a candidate regardless of context; shared tags only
 *   move it up. There is no code path that removes a due item for being
 *   "off-topic".
 * Invariant 3 — interleaving by scoring, not shuffling:
 *   same-origin-scene, same-tag and recently-shown items are penalized inside
 *   scoreCandidate(); selection is a sequential argmax, so each pick is scored
 *   against the previous pick (sameSceneAsLastPenalty). No shuffle() anywhere;
 *   the order is fully deterministic (ties break by item id).
 * Invariant 4 — memory strength never gates prompting:
 *   nothing in this module reads `stability` to decide WHETHER or HOW EASY a
 *   prompt is. Due-ness decides candidacy; the hint ladder handles difficulty
 *   live, per failure. `difficulty`/`lapses` only bias which items come back,
 *   never the form of the question.
 */

export interface Weights {
  overdue: number
  weakness: number
  context: number
  ownScene: number
  variety: number
  recentItem: number
  currentSession: number
  recentScene: number
  sameSceneAsLast: number
  sameTagAsLast: number
}

export const DEFAULT_WEIGHTS: Weights = {
  overdue: 1.0,
  weakness: 0.8,
  context: 0.9,
  ownScene: 0.1,
  variety: 0.5,
  recentItem: 1.2,
  currentSession: 2.5,
  recentScene: 0.8,
  sameSceneAsLast: 0.9,
  sameTagAsLast: 0.35,
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

export interface RankContext {
  now: Date
  scene: StoryScene
  recent: RecentContext
  /** items already queued earlier in this open session */
  sessionItemIds?: string[]
  /** the previously picked item — enables the sameSceneAsLast penalty */
  lastPicked?: KnowledgeItem
  weights?: Partial<Weights>
}

export interface ScoredCandidate {
  item: KnowledgeItem
  state: ReviewState | undefined
  score: number
}

export function sharedTags(a: string[], b: string[]): number {
  const set = new Set(b)
  let n = 0
  for (const t of a) if (set.has(t)) n++
  return n
}

/** every due item in the global pool — no context filtering (invariant 2) */
export function dueCandidates(
  items: KnowledgeItem[],
  reviews: Map<string, ReviewState>,
  now: Date,
): { item: KnowledgeItem; state: ReviewState }[] {
  const out: { item: KnowledgeItem; state: ReviewState }[] = []
  for (const item of items) {
    const state = reviews.get(item.id)
    if (state && new Date(state.dueDate).getTime() <= now.getTime()) out.push({ item, state })
  }
  return out
}

export function scoreCandidate(
  item: KnowledgeItem,
  state: ReviewState | undefined,
  ctx: RankContext,
): number {
  const w = { ...DEFAULT_WEIGHTS, ...(ctx.weights ?? {}) }
  const { now, scene, recent, lastPicked } = ctx

  // overdue amount: 0 for not-overdue, ramps to full at two weeks
  const overdue = state ? clamp01(daysOverdue(state, now) / 14) : 0

  // weakness: high difficulty + lapse history rises to the top — but only
  // for SELECTION PRIORITY, never for prompt difficulty (invariant 4)
  let weakness = 0
  if (state) weakness = clamp01((state.difficulty - 1) / 8) * 0.65 + clamp01(state.lapses / 5) * 0.35

  // context bonus ONLY — shared tags with the scene (invariant 2)
  const shared = sharedTags(item.tags, scene.contextTags)
  const context = clamp01(shared / 3)
  const ownScene = item.introducedInScene === scene.id ? 1 : 0

  // variety: prefer items whose tags and origin scene differ from recent play
  const tagFresh = sharedTags(item.tags, recent.tags) === 0 ? 1 : 0
  const sceneFresh = recent.sceneIds.includes(item.introducedInScene) ? 0 : 1
  const variety = tagFresh * 0.6 + sceneFresh * 0.4

  // penalties
  const inSession = (ctx.sessionItemIds ?? []).includes(item.id) ? 1 : 0
  const shownLastSession = recent.itemIds.includes(item.id) ? 1 : 0
  const originIsRecent = recent.sceneIds.slice(0, 2).includes(item.introducedInScene) ? 1 : 0
  // sequential interleaving penalties (invariant 3): conditioned on last pick
  const sameSceneAsLast = lastPicked && item.introducedInScene === lastPicked.introducedInScene ? 1 : 0
  const sameTagAsLast = lastPicked && sharedTags(item.tags, lastPicked.tags) > 0 ? 1 : 0

  const penalties =
    inSession * w.currentSession +
    shownLastSession * w.recentItem +
    originIsRecent * w.recentScene +
    sameSceneAsLast * w.sameSceneAsLast +
    sameTagAsLast * w.sameTagAsLast

  return (
    overdue * w.overdue +
    weakness * w.weakness +
    context * w.context +
    ownScene * w.ownScene +
    variety * w.variety -
    penalties
  )
}

export interface SessionPlan {
  /** scene's own new items, in beat order — always introduced first */
  newIds: string[]
  /** global due items, ranked best-first; interleaving emerges from the score */
  dueIds: string[]
}

/**
 * buildSession(scene, now): the public entry point from the spec.
 *   candidates = ReviewState.where(dueDate <= now) + scene.introducedItems
 * Selection is a sequential argmax over scoreCandidate (each pick conditioned
 * on the previous one), top `maxDue` kept.
 */
export function buildSession(
  scene: StoryScene,
  opts: {
    items: KnowledgeItem[]
    reviews: Map<string, ReviewState>
    now: Date
    recent: RecentContext
    maxDue?: number
    weights?: Partial<Weights>
  },
): SessionPlan {
  const { items, reviews, now, recent, maxDue = 6, weights } = opts
  const base = { now, scene, recent, weights }

  const candidates = dueCandidates(items, reviews, now)
  const sessionItemIds: string[] = []
  const picked: KnowledgeItem[] = []

  while (picked.length < maxDue && candidates.length) {
    const remaining = candidates.filter((c) => !sessionItemIds.includes(c.item.id))
    if (!remaining.length) break
    const ctx: RankContext = { ...base, sessionItemIds, lastPicked: picked[picked.length - 1] }
    let best = remaining[0]
    let bestScore = -Infinity
    for (const c of remaining) {
      const s = scoreCandidate(c.item, c.state, ctx)
      if (s > bestScore || (s === bestScore && c.item.id.localeCompare(best.item.id) < 0)) {
        best = c
        bestScore = s
      }
    }
    picked.push(best.item)
    sessionItemIds.push(best.item.id)
  }

  return { newIds: [...scene.introducedItems], dueIds: picked.map((p) => p.id) }
}

/**
 * Belt-and-braces helper: given a ranked list, greedily swap so no two items
 * from the same origin scene sit adjacent when an alternative exists.
 * (buildSession already prevents this via sameSceneAsLast; this pass is used
 * for other ordered lists and by tests to document the invariant.)
 */
export function enforceSpacing(ids: string[], items: Map<string, KnowledgeItem>): string[] {
  const out: string[] = []
  const pool = [...ids]
  while (pool.length) {
    let pickIdx = 0
    if (out.length) {
      const lastOrigin = items.get(out[out.length - 1])?.introducedInScene
      const altIdx = pool.findIndex((id) => items.get(id)?.introducedInScene !== lastOrigin)
      if (altIdx > 0) pickIdx = altIdx
    }
    out.push(pool.splice(pickIdx, 1)[0])
  }
  return out
}
