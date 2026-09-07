# The honest path from here to B2

**Status quo (this build):** 38 episodes · 111 scenes · 656 knowledge items ·
111 scenes of continuous story from arrival to a passed B2 exam and beyond —
every episode a complete 3-scene arc, plus 23 Lektüre (reading) beats with
glossary chips and translations.

## What B2 actually requires

| Dimension | Rough B2 benchmark | This build | Gap |
|---|---|---|---|
| Word families (active) | ~3,500–4,500 | 656 items (~520 word families) | ~6–7× |
| Grammar patterns | all of A1–B2 systematically (Passiv, Konj. II, Nebensätze, Relativsätze, Partizipien, Konjunktiv I…) | 34 patterns, the most important ones, woven into story (incl. Verben mit Präpositionen, Plusquamperfekt, Konjunktiv I, Nominalstil, Modalpräteritum, KII-Vergangenheit, Partizipien als Adjektive) | broad coverage exists, depth missing |
| Listening | hours of native-rate input | TTS dialogue lines + listen-checks | needs real media |
| Reading | long-form texts | dialogue + narrations + 23 adapted passages (Amtsdeutsch, Leserbrief, Wetterbericht, Theoriebogen, Rechnung…) | adapted texts exist; long-form books still outside |
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

1. ~~Third scenes for the 8 two-scene episodes~~ **done** — every episode is
   now 3 scenes; every A-episode ends its day, every B-episode ends its arc.
2. ~~Reading beats~~ **done** — `reading` beat type shipped; 15 passages across
   A1–B2 (Angebote, Amtsbriefe, Police-Mail, Leserbrief, Verlaufsbericht …).
3. ~~Level packs: topical episodes~~ **in progress** — 12 topical episodes
   added (Markt, Führerschein, Stromwechsel, Tandem, Geburtstag, Lesung,
   Jahresfinale …); more arcs possible (Kleingarten, Werkstatt vertieft,
   Behörde schreibt zurück …).
4. **Konjunktiv I / Pressebericht** episodes for the B2→C1 bridge.
5. **Piper audio branch** (run `npm run audio` on an open network) so every
   line and reading passage has one consistent professional voice.

The architecture (one global item pool, FSRS per item, context-as-bonus,
hint-ladder production) is deliberately built so that steps 1–4 are pure
content authoring. The bottleneck is honestly German authoring volume, not
engine capability.
