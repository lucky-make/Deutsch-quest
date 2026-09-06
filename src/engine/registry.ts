import type { Episode, EpisodeFile, KnowledgeItem, StoryScene, CefrLevel } from './types'

export interface ContentRegistry {
  episodes: Episode[]
  scenes: StoryScene[]
  items: KnowledgeItem[]
  itemById: Map<string, KnowledgeItem>
  sceneById: Map<string, StoryScene>
  episodeById: Map<string, Episode>
  /** scenes in canonical story order (level → episode order → position in episode) */
  scenesInOrder: StoryScene[]
  /** scenes grouped by episode id, in story order */
  scenesByEpisode: Map<string, StoryScene[]>
  cast: Map<string, { name: string; role: string }>
  /** validation problems found while building (non-fatal; surfaced by tests & dev console) */
  issues: string[]
}

const LEVEL_ORDER: Record<CefrLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4 }

/**
 * Pure builder so tests can feed fixture files; the app singleton uses the
 * Vite glob of every episode JSON — dropping a new episode file into
 * src/content/episodes/ requires ZERO engine changes.
 */
export function buildRegistry(files: Record<string, EpisodeFile>): ContentRegistry {
  const issues: string[] = []
  const episodes: Episode[] = []
  const scenes: StoryScene[] = []
  const items: KnowledgeItem[] = []
  const cast = new Map<string, { name: string; role: string }>()

  for (const [path, file] of Object.entries(files)) {
    if (!file?.episode || !Array.isArray(file.scenes) || !Array.isArray(file.items)) {
      issues.push(`${path}: missing episode/scenes/items arrays`)
      continue
    }
    episodes.push(file.episode)
    scenes.push(...file.scenes)
    items.push(...file.items)
    for (const c of file.cast ?? []) cast.set(c.id, { name: c.name, role: c.role })
  }

  const itemById = new Map<string, KnowledgeItem>()
  for (const it of items) {
    const prev = itemById.get(it.id)
    if (prev) issues.push(`duplicate item id: ${it.id} (${prev.german} / ${it.german})`)
    else itemById.set(it.id, it)
  }
  // identical German strings under two ids make scheduling confusing — flag them
  const byGerman = new Map<string, string>()
  for (const it of items) {
    const owner = byGerman.get(it.german)
    if (owner && owner !== it.id) issues.push(`duplicate german "${it.german}" in ${owner} and ${it.id}`)
    else byGerman.set(it.german, it.id)
  }

  const episodeById = new Map<string, Episode>()
  for (const ep of episodes) {
    if (episodeById.has(ep.id)) issues.push(`duplicate episode id: ${ep.id}`)
    episodeById.set(ep.id, ep)
  }

  const sceneById = new Map<string, StoryScene>()
  for (const sc of scenes) {
    if (sceneById.has(sc.id)) issues.push(`duplicate scene id: ${sc.id}`)
    sceneById.set(sc.id, sc)
  }

  // cross-references
  for (const sc of scenes) {
    const ep = episodeById.get(sc.episodeId)
    if (!ep) issues.push(`scene ${sc.id}: unknown episodeId ${sc.episodeId}`)
    else if (!ep.sceneIds.includes(sc.id)) issues.push(`scene ${sc.id} missing from episode ${ep.id}.sceneIds`)
    for (const id of sc.introducedItems) {
      const it = itemById.get(id)
      if (!it) issues.push(`scene ${sc.id}: introducedItems references unknown item ${id}`)
      else if (it.introducedInScene !== sc.id)
        issues.push(`scene ${sc.id}: item ${id} says introducedInScene=${it.introducedInScene}`)
    }
    for (const id of sc.requiredItems) {
      const it = itemById.get(id)
      if (!it) issues.push(`scene ${sc.id}: requiredItems references unknown item ${id}`)
      else {
        const introEp = it.introducedInScene
        const introScene = sceneById.get(introEp)
        if (!introScene) issues.push(`scene ${sc.id}: required item ${id} introduced in unknown scene ${introEp}`)
      }
    }
    const met = sc.beats.filter((b) => b.type === 'meet').flatMap((b) => (b as { itemIds: string[] }).itemIds)
    for (const id of met)
      if (!sc.introducedItems.includes(id)) issues.push(`scene ${sc.id}: beat meets ${id} but it is not in introducedItems`)
    for (const id of sc.introducedItems) if (!met.includes(id)) issues.push(`scene ${sc.id}: ${id} in introducedItems but never met in a beat`)
  }

  // items introduced before required (story order sanity)
  const ordered = [...scenes].sort((a, b) => sceneRank(a) - sceneRank(b))
  function sceneRank(sc: StoryScene): number {
    const ep = episodeById.get(sc.episodeId)
    const lvl = ep ? LEVEL_ORDER[ep.cefrLevel] : 99
    const ord = ep ? ep.order : 99
    const idx = ep ? ep.sceneIds.indexOf(sc.id) : 99
    return ((lvl * 100 + ord) * 100 + (idx < 0 ? 99 : idx))
  }

  const firstIntroIndex = new Map<string, number>()
  ordered.forEach((sc, i) => {
    for (const id of sc.introducedItems) if (!firstIntroIndex.has(id)) firstIntroIndex.set(id, i)
  })
  for (const sc of ordered) {
    const i = ordered.indexOf(sc)
    for (const id of sc.requiredItems) {
      const intro = firstIntroIndex.get(id)
      if (intro === undefined) issues.push(`scene ${sc.id}: requires ${id} which is never introduced`)
      else if (intro >= i) issues.push(`scene ${sc.id}: requires ${id} introduced at/after this scene (chain order)`)
    }
  }

  for (const it of items) {
    if (!itemById.has(it.id)) continue
    if (!it.audio) issues.push(`item ${it.id}: empty audio field`)
    if (!it.introducedInScene || !sceneById.has(it.introducedInScene))
      issues.push(`item ${it.id}: introducedInScene ${it.introducedInScene} unknown`)
    if (!it.tags?.length) issues.push(`item ${it.id}: no tags`)
  }

  episodes.sort((a, b) => LEVEL_ORDER[a.cefrLevel] - LEVEL_ORDER[b.cefrLevel] || a.order - b.order)
  for (const ep of episodes) {
    for (const sid of ep.sceneIds) if (!sceneById.has(sid)) issues.push(`episode ${ep.id}: sceneIds references unknown scene ${sid}`)
  }

  const scenesInOrder = episodes.flatMap((ep) => ep.sceneIds.map((id) => sceneById.get(id)!).filter(Boolean))
  const scenesByEpisode = new Map<string, StoryScene[]>()
  for (const ep of episodes) scenesByEpisode.set(ep.id, ep.sceneIds.map((id) => sceneById.get(id)!).filter(Boolean))

  return { episodes, scenes, items, itemById, sceneById, episodeById, scenesInOrder, scenesByEpisode, cast, issues }
}
