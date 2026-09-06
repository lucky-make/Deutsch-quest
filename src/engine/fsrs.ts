import { fsrs, generatorParameters, createEmptyCard, Rating, State, type Card, type Grade } from 'ts-fsrs'
import type { ReviewState } from './types'

/**
 * One memory record per (learner, item) — invariant 5.
 * ts-fsrs owns the scheduling math; this module maps between its Card
 * and our persisted ReviewState (stability, difficulty, due, counts).
 */
const params = generatorParameters({
  request_retention: 0.9,
  enable_fuzz: false, // deterministic scheduling — required for testable invariants
  enable_short_term: false, // narrative sessions are day-scale, not minute-scale
})
const engine = fsrs(params)

function toCard(state: ReviewState): Card {
  return {
    due: new Date(state.dueDate),
    stability: state.stability,
    difficulty: state.difficulty,
    elapsed_days: 0,
    scheduled_days: 0,
    learning_steps: 0,
    reps: state.reviewCount,
    lapses: state.lapses,
    state: state.reviewCount > 0 ? State.Review : State.New,
    last_review: undefined,
  }
}

function fromCard(itemId: string, card: Card): ReviewState {
  return {
    itemId,
    stability: card.stability,
    difficulty: card.difficulty,
    dueDate: card.due.toISOString(),
    reviewCount: card.reps,
    lapses: card.lapses,
  }
}

export const RATINGS = { strong: Rating.Good, moderate: Rating.Hard, weak: Rating.Again, fail: Rating.Again } as const
export type LadderRating = keyof typeof RATINGS

export function newReviewState(itemId: string, now: Date): ReviewState {
  return fromCard(itemId, createEmptyCard(now))
}

export function applyReview(prev: ReviewState | undefined, itemId: string, now: Date, grade: Grade): ReviewState {
  const card = prev ? toCard(prev) : createEmptyCard(now)
  const { card: next } = engine.next(card, now, grade)
  return fromCard(itemId, next)
}

/** is the item's memory due for retrieval at `now`? */
export function isDue(state: ReviewState, now: Date): boolean {
  return new Date(state.dueDate).getTime() <= now.getTime()
}

export function daysOverdue(state: ReviewState, now: Date): number {
  return Math.max(0, (now.getTime() - new Date(state.dueDate).getTime()) / 86_400_000)
}

export { Rating, State }
export type { Card, Grade }
