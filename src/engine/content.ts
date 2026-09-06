import type { EpisodeFile } from './types'
import { buildRegistry, type ContentRegistry } from './registry'

// Zero engine changes for new content: every JSON file in episodes/ is picked up.
const files = import.meta.glob('../content/episodes/*.json', { eager: true }) as Record<string, EpisodeFile>
export const registry: ContentRegistry = buildRegistry(files)

if (registry.issues.length && import.meta.env.DEV) {
  console.warn('[deutschpath] content issues:', registry.issues)
}
