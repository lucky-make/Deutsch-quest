import { buildRegistry } from '../src/engine/registry'
import type { EpisodeFile } from '../src/engine/types'
const files = import.meta.glob('../src/content/episodes/*.json', { eager: true, import: 'default' }) as Record<string, EpisodeFile>
const reg = buildRegistry(files)
console.log(reg.issues.join('\n') || 'no issues')
console.log('episodes:', reg.episodes.length, 'scenes:', reg.scenes.length, 'items:', reg.items.length)
console.log('per-scene counts:', reg.scenes.map((s) => `${s.id}:${s.introducedItems.length}`).join(' '))
