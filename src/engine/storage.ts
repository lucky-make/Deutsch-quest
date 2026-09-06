import type { Progress, RecentContext, ReviewState, Settings } from './types'
import { DEFAULT_SETTINGS, EMPTY_PROGRESS, EMPTY_RECENT } from './types'

export interface LearnerState {
  reviews: Record<string, ReviewState>
  progress: Progress
  settings: Settings
  recent: RecentContext
}

export const EMPTY_LEARNER_STATE: LearnerState = {
  reviews: {},
  progress: EMPTY_PROGRESS,
  settings: DEFAULT_SETTINGS,
  recent: EMPTY_RECENT,
}

export interface Persistence {
  load(): Promise<Partial<LearnerState>>
  save(state: LearnerState): Promise<void>
}

/** in-memory adapter — used by tests and as a last-resort fallback */
export class MemoryPersistence implements Persistence {
  private store: Partial<LearnerState> = {}
  async load() {
    return this.store
  }
  async save(state: LearnerState) {
    this.store = {
      reviews: { ...state.reviews },
      progress: { ...state.progress },
      settings: { ...state.settings },
      recent: { ...state.recent },
    }
  }
}

/** real adapter — IndexedDB, one key-value store, local-only (no server, ever) */
export class IndexedDBPersistence implements Persistence {
  private db: IDBDatabase | null = null

  private open(): Promise<IDBDatabase> {
    if (this.db) return Promise.resolve(this.db)
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('deutschpath', 1)
      req.onupgradeneeded = () => {
        const db = req.result
        if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv')
      }
      req.onsuccess = () => {
        this.db = req.result
        resolve(req.result)
      }
      req.onerror = () => reject(req.error)
    })
  }

  async load(): Promise<Partial<LearnerState>> {
    try {
      const db = await this.open()
      return await new Promise((resolve, reject) => {
        const tx = db.transaction('kv', 'readonly')
        const store = tx.objectStore('kv')
        const keys = ['reviews', 'progress', 'settings', 'recent']
        const result: Partial<LearnerState> = {}
        let pending = keys.length
        for (const k of keys) {
          const req = store.get(k)
          req.onsuccess = () => {
            if (req.result !== undefined) (result as Record<string, unknown>)[k] = req.result
            if (--pending === 0) resolve(result)
          }
          req.onerror = () => reject(req.error)
        }
      })
    } catch {
      return {}
    }
  }

  async save(state: LearnerState): Promise<void> {
    try {
      const db = await this.open()
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction('kv', 'readwrite')
        const store = tx.objectStore('kv')
        store.put(state.reviews, 'reviews')
        store.put(state.progress, 'progress')
        store.put(state.settings, 'settings')
        store.put(state.recent, 'recent')
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      })
    } catch {
      // storage unavailable (private mode etc.) — the game still plays, just doesn't persist
    }
  }
}

export function mergeState(base: Partial<LearnerState>): LearnerState {
  return {
    reviews: base.reviews ?? {},
    progress: base.progress ?? EMPTY_PROGRESS,
    settings: { ...DEFAULT_SETTINGS, ...(base.settings ?? {}) },
    recent: base.recent ?? EMPTY_RECENT,
  }
}
