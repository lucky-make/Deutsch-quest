import type { LearnerState } from './storage'
import { mergeState } from './storage'
import type { ReviewState } from './types'

export interface ExportPayload {
  app: 'deutschpath'
  version: 1
  exportedAt: string
  reviews: Record<string, ReviewState>
  progress: LearnerState['progress']
  settings: LearnerState['settings']
  recent: LearnerState['recent']
}

export function exportState(state: LearnerState): ExportPayload {
  return {
    app: 'deutschpath',
    version: 1,
    exportedAt: new Date().toISOString(),
    reviews: state.reviews,
    progress: state.progress,
    settings: state.settings,
    recent: state.recent,
  }
}

export function serializeExport(state: LearnerState): string {
  return JSON.stringify(exportState(state), null, 2)
}

/** throws with a readable message if the file isn't a DeutschPath export */
export function parseImport(json: string): LearnerState {
  let data: unknown
  try {
    data = JSON.parse(json)
  } catch {
    throw new Error('Das ist kein gültiges JSON.')
  }
  const d = data as Partial<ExportPayload>
  if (d.app !== 'deutschpath' || d.version !== 1) throw new Error('Diese Datei ist kein DeutschPath-Export (Version 1).')
  if (typeof d.reviews !== 'object' || d.reviews === null) throw new Error('Fehlende Lernstände (reviews).')
  const reviews: Record<string, ReviewState> = {}
  for (const [id, rs] of Object.entries(d.reviews)) {
    if (typeof rs !== 'object' || rs === null) continue
    const r = rs as ReviewState
    if (typeof r.dueDate !== 'string' || typeof r.stability !== 'number' || typeof r.difficulty !== 'number') continue
    reviews[id] = {
      itemId: id,
      stability: r.stability,
      difficulty: r.difficulty,
      dueDate: r.dueDate,
      reviewCount: r.reviewCount ?? 0,
      lapses: r.lapses ?? 0,
    }
  }
  return mergeState({
    reviews,
    progress: d.progress,
    settings: d.settings,
    recent: d.recent,
  })
}

export function downloadJson(json: string, filename: string): void {
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
