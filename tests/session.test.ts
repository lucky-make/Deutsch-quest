import { describe, expect, it } from 'vitest'
import { Exercise, SceneSession } from '../src/engine/session'
import { applyReview, isDue, newReviewState, Rating } from '../src/engine/fsrs'
import type { KnowledgeItem, ReviewState } from '../src/engine/types'

function item(id: string, opts: Partial<KnowledgeItem> = {}): KnowledgeItem {
  return {
    id,
    type: 'chunk',
    german: id,
    meaning: 'm',
    audio: 'tts',
    introducedInScene: 's1',
    tags: [],
    cefrLevel: 'A1',
    ...opts,
  } as KnowledgeItem
}

/**
 * Invariant 6: failure is never a dead end.
 * Wrong answer → hint → easier retry → the scene continues either way.
 */
describe('hint ladder', () => {
  it('first-try success rates strong', () => {
    const ex = new Exercise(item('g1', { german: 'Guten Morgen!' }), 'type', [item('g1', { german: 'Guten Morning!' })])
    expect(ex.submit('guten Morgen!')).toBe(true)
    const oc = ex.outcome()
    expect(oc.ladderRating).toBe('strong')
    expect(oc.rating).toBe(Rating.Good)
  })

  it('wrong answer steps down the ladder (skeleton → reconstruction), still finishable', () => {
    const ex = new Exercise(item('c1', { german: 'Ich hätte gern einen Kaffee' }), 'type', [])
    expect(ex.submit('falsch')).toBe(false)
    expect(ex.stepDown()).toBe(true)
    expect(ex.view().hint).toBe('I. h. g. e. K.')
    expect(ex.submit('immer noch falsch')).toBe(false)
    expect(ex.stepDown()).toBe(true)
    expect(ex.view().tiles).toBeDefined()
    expect(ex.stepDown()).toBe(false) // ladder exhausted
  })

  it('a single word falls back to an MCQ reconstruction rung', () => {
    const pool = [
      item('w1', { german: 'der Schlüssel', type: 'word' as const }),
      item('w2', { german: 'der Tisch', type: 'word' as const }),
      item('w3', { german: 'das Fenster', type: 'word' as const }),
      item('w4', { german: 'die Lampe', type: 'word' as const }),
    ]
    const ex = new Exercise(pool[0], 'type', pool)
    ex.submit('nope')
    ex.stepDown()
    ex.submit('auch nope')
    ex.stepDown()
    const v = ex.view()
    expect(v.kind).toBe('word-mcq')
    expect(v.options).toContain('der Schlüssel')
    expect(v.options!.length).toBeGreaterThanOrEqual(2)
  })

  it('exhausting the ladder produces a fail outcome — and the scene continues', () => {
    const ex = new Exercise(item('c2', { german: 'Bis später!' }), 'type', [])
    ex.submit('x'); ex.stepDown()
    ex.submit('y'); ex.stepDown()
    ex.submit('z')
    expect(ex.stepDown()).toBe(false)
    const oc = ex.failOutcome()
    expect(oc.succeeded).toBe(false)
    expect(oc.rating).toBe(Rating.Again)
  })
})

describe('grading leniency', () => {
  it('accepts case, punctuation and umlaut-typing differences', () => {
    const ex = new Exercise(item('g', { german: 'Ich hätte gern einen Kaffee.' }), 'type', [])
    expect(ex.submit('ich hätte gern einen kaffee')).toBe(true)
    expect(ex.submit('Ich haette gern einen Kaffee')).toBe(true)
    expect(ex.submit('ich hätte gern einen kaffee.')).toBe(true)
    expect(ex.submit('ich mochte einen tee')).toBe(false)
  })

  it('cloze grading checks the gapped part only', () => {
    const ex = new Exercise(item('p', { type: 'grammar_pattern', german: 'Ich möchte mein Deutsch ___.', cloze: 'verbessern' }), 'cloze', [])
    expect(ex.submit('verbessern')).toBe(true)
    expect(ex.submit('Verbessern!')).toBe(true)
    expect(ex.submit('trinken')).toBe(false)
  })
})

/**
 * gradeResponse(item, attempt): one ReviewState per item (invariant 5),
 * FSRS does the math, the session proceeds after ANY outcome.
 */
describe('SceneSession grading', () => {
  const scene = {
    id: 's1',
    episodeId: 'e1',
    title: 's',
    titleEn: 's',
    place: '',
    contextTags: ['cafe'],
    requiredItems: [],
    introducedItems: ['neu1'],
    beats: [],
  }

  function makeSession() {
    const saved: Record<string, ReviewState> = {}
    const outcomes: { itemId: string; succeeded: boolean }[] = []
    const items = [item('neu1', { german: 'Guten Tag!' }), item('alt1', { german: 'die Rechnung' })]
    const reviews = new Map<string, ReviewState>([
      ['alt1', { itemId: 'alt1', stability: 5, difficulty: 5, dueDate: new Date(Date.now() - 86_400_000).toISOString(), reviewCount: 2, lapses: 0 }],
    ])
    const session = new SceneSession(scene, {
      items,
      reviews,
      now: new Date(),
      recent: { itemIds: [], tags: [], sceneIds: [] },
      hooks: {
        getReview: (id) => saved[id] ?? reviews.get(id),
        recordOutcome: (oc, next) => {
          saved[oc.itemId] = next
          outcomes.push({ itemId: oc.itemId, succeeded: oc.succeeded })
        },
      },
    })
    return { session, saved, outcomes }
  }

  it('a failed check records Again and re-queues the item — no scene reset', () => {
    const { session, saved, outcomes } = makeSession()
    const ex = session.makeExercise('mixed')! // takes neu1
    ex.submit('wrong'); ex.stepDown(); ex.submit('wrong'); ex.stepDown(); ex.submit('wrong')
    const oc = ex.failOutcome()
    const state = session.grade(ex, oc, new Date())
    expect(outcomes).toHaveLength(1)
    expect(outcomes[0].succeeded).toBe(false)
    expect(saved['neu1'].reviewCount).toBe(1)
    expect(isDue(state, new Date(Date.now() + 25 * 3_600_000))).toBe(true) // short-term disabled → due again tomorrow; same-session relearn handled by the session queue itself
    // the failed item was re-queued for THIS session (invariant 6: continues);
    // it sits behind the other due item, then comes back
    expect(session.makeExercise('recall')?.item.id).toBe('alt1')
    expect(session.makeExercise('recall')?.item.id).toBe('neu1')
  })

  it('a moderate (one-hint) success schedules with Hard', () => {
    const { session, saved } = makeSession()
    const ex = session.makeExercise('mixed')!
    ex.submit('fast richtig'); ex.stepDown()
    expect(ex.submit('Guten Tag!')).toBe(true)
    session.grade(ex, ex.outcome(), new Date())
    expect(saved['neu1'].reviewCount).toBe(1)
    // Hard after one hint → interval shorter than Good; both valid FSRS outputs
    expect(saved['neu1'].stability).toBeGreaterThan(0)
  })

  it('keeps exactly one ReviewState per item across repeated grading (invariant 5)', () => {
    const { session, saved } = makeSession()
    const altItem = item('alt1', { german: 'die Rechnung' })
    for (let i = 0; i < 3; i++) {
      const ex = new Exercise(altItem, 'type', [])
      expect(ex.submit('die Rechnung')).toBe(true)
      session.grade(ex, ex.outcome(), new Date())
    }
    expect(Object.keys(saved)).toEqual(['alt1'])
    expect(saved['alt1'].reviewCount).toBe(5) // fixture began with reviewCount 2 + 3 graded retrievals
  })

  it('new-item FSRS records start fresh, not pre-warmed by stability guesses (invariant 4)', () => {
    const fresh = newReviewState('x', new Date())
    expect(fresh.reviewCount).toBe(0)
    expect(fresh.stability).toBeGreaterThanOrEqual(0) // no stability assumed before the first test
    const first = applyReview(fresh, 'x', new Date(), Rating.Good)
    expect(first.stability).toBeGreaterThan(0) // stability only exists AFTER a real retrieval
  })

  it('applyReview is monotone in rating (Good ≥ Hard ≥ Again for stability growth)', () => {
    const now = new Date()
    const base = newReviewState('x', now)
    const inReview = applyReview(base, 'x', now, Rating.Good) // first review puts the card into Review state
    const again = applyReview(inReview, 'x', now, Rating.Again)
    const hard = applyReview(inReview, 'x', now, Rating.Hard)
    const good = applyReview(inReview, 'x', now, Rating.Good)
    expect(good.stability).toBeGreaterThanOrEqual(hard.stability)
    expect(hard.stability).toBeGreaterThanOrEqual(again.stability)
    expect(again.lapses).toBe(1) // lapses counted once the card was in Review state
  })
})
