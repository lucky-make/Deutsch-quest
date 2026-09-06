# The honest path from here to B2

**Status quo (this build):** 24 episodes · 65 scenes · 377 knowledge items ·
65 scenes of continuous story from arrival to a passed B2 exam.

## What B2 actually requires

| Dimension | Rough B2 benchmark | This build | Gap |
|---|---|---|---|
| Word families (active) | ~3,500–4,500 | 377 items (~300 word families) | ~10× |
| Grammar patterns | all of A1–B2 systematically (Passiv, Konj. II, Nebensätze, Relativsätze, Partizipien, Konjunktiv I…) | ~20 patterns, the most important ones, woven into story | broad coverage exists, depth missing |
| Listening | hours of native-rate input | TTS dialogue lines + listen-checks | needs real media |
| Reading | long-form texts | scene dialogue + narrations only | needs passages/books |
| Speaking | interactive production | typed production + hint ladder | needs humans (or future SR) |

## What the app already does for you (the part most learners fail at)

- **Daily habit with a memory model**: FSRS schedules every item at the moment
  of forgetting, globally, across "lessons". You never review by deck.
- **Production from day one**: you *type German* (the hardest, most valuable
  skill) with a live hint ladder instead of multiple-choice comfort.
- **A visible, motivated path**: the story arc ends with Sam passing the telc
  B2 — you follow the same road.

## Realistic use of this build

1. Play one scene per day (10–20 min). The scheduler handles the rest.
2. Speak every line out loud (the 🔊 text is your model; shadow it).
3. Treat resurfacing as the point: when an old word appears in a new context,
   that's the moment it becomes *yours*.

## What the next content increments look like (engine: zero changes)

1. **Third scenes** for the 8 two-scene episodes (~+50 items).
2. **Reading beats**: a `reading` beat type + adapted texts per episode
   (engine change is small; content is the work).
3. **Level packs**: topical episodes (Arztbesuch vertieft, Behördenmarathon,
   Kleingarten, Werkstatt, Behörde schreibt zurück …) at 3 scenes each.
4. **Konjunktiv I / Gaulreportage** episodes for the B2→C1 bridge.
5. **Piper audio branch** (run `npm run audio` on an open network) so every
   line has one consistent professional voice — big listening win.

The architecture (one global item pool, FSRS per item, context-as-bonus,
hint-ladder production) is deliberately built so that steps 1–4 are pure
content authoring. The bottleneck is honestly German authoring volume, not
engine capability.
