import type { KnowledgeItem, ReviewState, RecentContext, StoryScene, CheckMode } from './types'
import { buildSession, type SessionPlan } from './scheduler'
import { applyReview, RATINGS, isDue, type Grade, type LadderRating } from './fsrs'
import { answerKey, germanMatches, mcqOptions, skeleton, tiles } from './grader'

/**
 * Live hint ladder — invariant 4 & 6:
 * the scene's natural difficulty is attempted first (production from meaning).
 * Failure steps DOWN the ladder (skeleton → reconstruction), never a scene
 * reset; the scene continues whatever happens. Memory strength (stability) is
 * never consulted to pre-shrink the prompt.
 */
export const MAX_HINT_LEVEL = 2

export type ExerciseKind = 'type' | 'cloze' | 'listen' | 'word-mcq'

export interface CheckOutcome {
  itemId: string
  rating: Grade
  ladderRating: LadderRating
  hintsUsed: number
  succeeded: boolean
}

export interface ExerciseView {
  kind: ExerciseKind
  item: KnowledgeItem
  /** shown text with ___ for cloze, or the meaning prompt for production */
  promptGerman?: string
  options?: string[] // for word-mcq
  /** what's already visible as help at the current rung */
  hint?: string
  tiles?: string[]
}

export interface SessionHooks {
  getReview(itemId: string): ReviewState | undefined
  /** persist the new state + append to retrieval log */
  recordOutcome(outcome: CheckOutcome, newState: ReviewState, now: Date): void
}

export class Exercise {
  readonly kind: ExerciseKind
  readonly item: KnowledgeItem
  hintLevel = 0 // 0 = natural difficulty, 1 = hint, 2 = reconstruction
  finished = false
  /** last wrong attempt text — for feedback display */
  lastAttempt: string | null = null
  private options: string[] | undefined

  constructor(
    item: KnowledgeItem,
    kind: ExerciseKind,
    pool: KnowledgeItem[],
  ) {
    this.item = item
    this.kind = kind
    if (kind === 'type' && item.type === 'word') {
      // single words: reconstruction rung is an MCQ, not tiles of one word
      this.options = mcqOptions(item, pool)
    }
  }

  view(): ExerciseView {
    const v: ExerciseView = { kind: this.kind, item: this.item }
    if (this.kind === 'cloze') v.promptGerman = this.item.german
    if (this.kind === 'type' || this.kind === 'listen') v.promptGerman = undefined
    if (this.options) v.options = this.options
    if (this.hintLevel >= 1 && this.kind !== 'word-mcq') v.hint = skeleton(answerKey(this.item))
    if (this.hintLevel >= 2) {
      if (this.kind === 'type' && this.item.type === 'word') v.kind = 'word-mcq'
      else v.tiles = tiles(this.item)
    }
    return v
  }

  /** @returns whether the attempt was correct */
  submit(attempt: string): boolean {
    if (this.finished) return false
    this.lastAttempt = attempt
    return germanMatches(answerKey(this.item), attempt, this.item.alt)
  }

  /** wrong attempt → step down; returns false when the ladder is exhausted */
  stepDown(): boolean {
    if (this.hintLevel >= MAX_HINT_LEVEL) return false
    this.hintLevel++
    return true
  }

  outcome(): CheckOutcome {
    this.finished = true
    const ladderRating: LadderRating = this.hintLevel === 0 ? 'strong' : this.hintLevel === 1 ? 'moderate' : 'weak'
    return {
      itemId: this.item.id,
      rating: RATINGS[ladderRating],
      ladderRating,
      hintsUsed: this.hintLevel,
      succeeded: true,
    }
  }

  failOutcome(): CheckOutcome {
    this.finished = true
    return { itemId: this.item.id, rating: RATINGS.fail, ladderRating: 'fail', hintsUsed: MAX_HINT_LEVEL + 1, succeeded: false }
  }
}

export interface SceneSessionPlan extends SessionPlan {}

/**
 * One scene's retrieval session. New items are introduced (meet) and checked;
 * the due queue comes from the GLOBAL pool via buildSession.
 */
export class SceneSession {
  readonly scene: StoryScene
  readonly plan: SessionPlan
  private newQueue: string[]
  private dueQueue: string[]
  private pool: KnowledgeItem[]
  private graded = 0

  constructor(
    scene: StoryScene,
    private opts: {
      items: KnowledgeItem[]
      reviews: Map<string, ReviewState>
      now: Date
      recent: RecentContext
      hooks: SessionHooks
    },
  ) {
    this.scene = scene
    this.pool = opts.items
    this.plan = buildSession(scene, opts)
    this.newQueue = [...this.plan.newIds]
    this.dueQueue = [...this.plan.dueIds]
  }

  get checksGraded(): number {
    return this.graded
  }

  hasNew(): boolean {
    return this.newQueue.length > 0
  }

  hasDue(): boolean {
    return this.dueQueue.length > 0
  }

  peekDue(): KnowledgeItem | undefined {
    return this.pool.find((i) => i.id === this.dueQueue[0])
  }

  /** pop the next new item id (meet beats consume these before checks) */
  takeNew(n = 1): string[] {
    return this.newQueue.splice(0, n)
  }

  takeDue(n = 1): string[] {
    return this.dueQueue.splice(0, n)
  }

  makeExercise(mode: CheckMode): Exercise | null {
    let id: string | undefined
    if (mode === 'new' || mode === 'mixed') {
      if (this.newQueue.length) id = this.newQueue.shift()!
    }
    if (!id) id = this.dueQueue.shift()
    if (!id) return null
    const item = this.pool.find((i) => i.id === id)
    if (!item) return null
    const kind: ExerciseKind =
      mode === 'listen' && item.type !== 'grammar_pattern'
        ? 'listen'
        : item.type === 'grammar_pattern'
          ? 'cloze'
          : 'type'
    const ex = new Exercise(item, kind, this.pool)
    return ex
  }

  /**
   * gradeResponse(item, attempt) from the spec: map the live hint ladder to a
   * single FSRS rating, update the one ReviewState, continue the scene either
   * way (invariant 6). Failed items re-enter the due queue for this session.
   */
  grade(ex: Exercise, outcome: CheckOutcome, now: Date): ReviewState {
    this.graded++
    const prev = this.opts.hooks.getReview(ex.item.id)
    const next = applyReview(prev, ex.item.id, now, outcome.rating)
    this.opts.hooks.recordOutcome(outcome, next, now)
    if (!outcome.succeeded) this.dueQueue.push(ex.item.id) // same-session relearn, never a dead end
    return next
  }

  /** session summary for the scene-complete screen */
  summary(): { met: number; dueAvailable: number } {
    return { met: this.plan.newIds.length, dueAvailable: this.plan.dueIds.length }
  }
}

export { isDue }
