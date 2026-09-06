import type { KnowledgeItem, ReviewState, RecentContext, Progress } from '../engine/types'
import { IndexedDBPersistence, MemoryPersistence, mergeState, type LearnerState, type Persistence } from '../engine/storage'
import { AudioSource } from '../engine/audio'
import { registry } from '../engine/content'

/** Central app store: local-only learner state + persistence glue. */
export class App {
  state: LearnerState
  readonly persistence: Persistence
  readonly audio: AudioSource
  /** items currently queued in the open session (for current-session penalty) */
  sessionItemIds: string[] = []
  onAuthChange?: () => void

  constructor(persistence?: Persistence) {
    this.persistence = persistence ?? (typeof indexedDB !== 'undefined' ? new IndexedDBPersistence() : new MemoryPersistence())
    this.state = mergeState({})
    this.audio = new AudioSource(() => this.state.settings)
  }

  async boot(): Promise<void> {
    const loaded = await this.persistence.load()
    this.state = mergeState(loaded)
  }

  async save(): Promise<void> {
    await this.persistence.save(this.state)
  }

  replaceState(next: LearnerState): Promise<void> {
    this.state = next
    return this.save()
  }

  // ——— reviews (one FSRS record per item, invariant 5) ———
  getReview(itemId: string): ReviewState | undefined {
    return this.state.reviews[itemId]
  }

  reviewsAsMap(): Map<string, ReviewState> {
    return new Map(Object.entries(this.state.reviews))
  }

  // ——— story progress ———
  isUnlocked(sceneId: string): boolean {
    const order = registry.scenesInOrder
    const idx = order.findIndex((s) => s.id === sceneId)
    if (idx <= 0) return true
    return this.state.progress.completedSceneIds.includes(order[idx - 1].id)
  }

  currentSceneId(): string | null {
    const p = this.state.progress
    if (p.currentSceneId) return p.currentSceneId
    const next = registry.scenesInOrder.find((s) => !p.completedSceneIds.includes(s.id))
    return next?.id ?? null
  }

  completeScene(sceneId: string, shownItems: string[]): void {
    const p: Progress = this.state.progress
    if (!p.completedSceneIds.includes(sceneId)) p.completedSceneIds.push(sceneId)
    p.sceneLog.push({ sceneId, at: new Date().toISOString() })
    const idx = registry.scenesInOrder.findIndex((s) => s.id === sceneId)
    p.currentSceneId = registry.scenesInOrder[idx + 1]?.id ?? null
    // update recent context (variety penalties look at this next session)
    const itemTags = shownItems
      .map((id) => registry.itemById.get(id)?.tags ?? [])
      .flat()
    this.state.recent = {
      itemIds: uniq([...shownItems, ...this.state.recent.itemIds]).slice(0, 40),
      tags: uniq([...itemTags, ...this.state.recent.tags]).slice(0, 24),
      sceneIds: uniq([sceneId, ...this.state.recent.sceneIds]).slice(0, 3),
    }
    void this.save()
  }

  logRetrieval(itemId: string, sceneId: string, rating: number, hintsUsed: number): void {
    this.state.progress.retrievalLog.push({ itemId, sceneId, at: new Date().toISOString(), rating, hintsUsed })
    if (this.state.progress.retrievalLog.length > 200) this.state.progress.retrievalLog.splice(0, this.state.progress.retrievalLog.length - 200)
  }

  /** RecentContext for the scheduler, minus the current scene's own recency */
  recentForRanking(): RecentContext {
    return this.state.recent
  }

  knownCount(): number {
    return Object.keys(this.state.reviews).length
  }
}

function uniq<T>(a: T[]): T[] {
  return [...new Set(a)]
}

export const app = new App()

export function itemById(id: string): KnowledgeItem | undefined {
  return registry.itemById.get(id)
}
