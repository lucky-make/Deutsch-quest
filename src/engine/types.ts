// DeutschPath — core data types.
// The JSON content files mirror these interfaces exactly.

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2'
export type ItemType = 'word' | 'chunk' | 'sentence' | 'grammar_pattern'

export interface KnowledgeItem {
  id: string
  type: ItemType
  german: string
  meaning: string
  /** id of a hand-authored SVG icon (see ui/icons.ts) or scene background */
  image?: string
  /** always populated: "tts" marker (speechSynthesis branch) or "audio/<file>.mp3" (Piper branch) */
  audio: string
  /** word -> chunk -> sentence chain */
  parentId?: string
  introducedInScene: string
  tags: string[]
  cefrLevel: CefrLevel
  /** additional accepted answers for lenient grading */
  alt?: string[]
  /** for grammar_pattern: the gapped part of `german` ("___") that the learner must supply */
  cloze?: string
  /** gender / plural / usage note shown on meet cards */
  note?: string
  /** what the 🔊 button should say when the german text itself contains a blank */
  speak?: string
}

export interface ReviewState {
  itemId: string
  stability: number
  difficulty: number
  dueDate: string // ISO
  reviewCount: number
  lapses: number
}

export type CheckMode = 'new' | 'recall' | 'mixed' | 'listen'

export type SceneBeat =
  | { type: 'narration'; text: string }
  | { type: 'line'; speaker: string; text: string; translation?: string }
  | { type: 'meet'; itemIds: string[] }
  | { type: 'check'; count: number; mode: CheckMode }
  | { type: 'choice'; prompt?: string; options: { label: string; line?: string; translation?: string }[] }
  /** a longer German passage the player reads in-scene (letter, ad, article …) */
  | { type: 'reading'; title: string; text: string; translation?: string; itemIds?: string[] }

export interface StoryScene {
  id: string
  episodeId: string
  title: string
  titleEn: string
  /** short place label shown above the scene art */
  place: string
  /** id of a hand-authored SVG background (ui/backgrounds.ts) */
  bg?: string
  /** nudges ranking — never filters (invariant 2) */
  contextTags: string[]
  /** items this scene's dialogue depends on (must be introduced in an earlier scene) */
  requiredItems: string[]
  introducedItems: string[]
  beats: SceneBeat[]
}

export interface CastMember {
  id: string
  name: string
  role: string
}

export interface Episode {
  id: string
  arcId: CefrLevel
  cefrLevel: CefrLevel
  title: string
  titleEn: string
  blurb: string
  order: number
  sceneIds: string[]
}

/** One content file per episode: src/content/episodes/<id>.json */
export interface EpisodeFile {
  episode: Episode
  cast?: CastMember[]
  items: KnowledgeItem[]
  scenes: StoryScene[]
}

export interface RetrievalLogEntry {
  itemId: string
  sceneId: string
  at: string // ISO
  rating: number // 1..4 (ts-fsrs Rating)
  hintsUsed: number
}

export interface Progress {
  completedSceneIds: string[]
  currentSceneId: string | null
  sceneLog: { sceneId: string; at: string }[]
  retrievalLog: RetrievalLogEntry[]
}

/** what the variety/recent penalties look back at */
export interface RecentContext {
  itemIds: string[]
  tags: string[]
  sceneIds: string[]
}

export interface Settings {
  showTranslations: boolean
  ttsRate: number
  reduceMotion: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  showTranslations: false,
  ttsRate: 0.95,
  reduceMotion: false,
}

export const EMPTY_PROGRESS: Progress = {
  completedSceneIds: [],
  currentSceneId: null,
  sceneLog: [],
  retrievalLog: [],
}

export const EMPTY_RECENT: RecentContext = { itemIds: [], tags: [], sceneIds: [] }
