# The honest path from here to B2

**Status quo (this build):** 54 episodes · 159 scenes · 933 knowledge items ·
159 scenes of continuous story from arrival to a passed B2 exam, two
Christmas seasons and a New Year's toast — every episode a complete 3-scene
arc, plus 47 Lektüre (reading) beats with glossary chips and translations.

## What B2 actually requires

| Dimension | Rough B2 benchmark | This build | Gap |
|---|---|---|---|
| Word families (active) | ~3,500–4,500 | 933 items (~740 word families) | ~4–5× |
| Grammar patterns | all of A1–B2 systematically (Passiv, Konj. II, Nebensätze, Relativsätze, Partizipien, Konjunktiv I…) | 34 patterns, the most important ones, woven into story (incl. Verben mit Präpositionen, Plusquamperfekt, Konjunktiv I, Nominalstil, Modalpräteritum, KII-Vergangenheit, Passiv mit Modalverb, weil/deshalb/damit/um…zu/ohne…zu, falls, obwohl-artig (zwar…aber), nicht nur…sondern auch, sich gewöhnen an) | broad coverage exists, depth missing |
| Listening | hours of native-rate input | TTS dialogue lines + listen-checks | needs real media |
| Reading | long-form texts | dialogue + narrations + 47 adapted passages (Amtsdeutsch, Leserbrief, Wetterwarnung, Theoriebogen, Protokoll, Gartenordnung, Einkaufszettel, Deutungshilfe…) | adapted texts exist; long-form books still outside |
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
3. ~~Level packs: topical episodes~~ **ongoing** — 28 topical episodes added
   (Markt, Führerschein, Stromwechsel, Tandem, Geburtstag, Lesung, Jahresfinale,
   Zoo, Museum, Frühjahrsputz, erster Schnee, Mieterversammlung, Flohmarkt,
   zweite Filiale, Kleingarten, Kino, Weihnachtsmarkt, Heiligabend, erste Party,
   Heimweh/Fernweh, Winterkonzert, Weihnachtsansprache, Jahreswechsel …);
   more arcs possible (Werkstatt vertieft, Umzug nach Plagwitz, Ostern …).
4. **Konjunktiv I / Pressebericht** episodes for the B2→C1 bridge.
5. **Piper audio branch** (run `npm run audio` on an open network) so every
   line and reading passage has one consistent professional voice.

The architecture (one global item pool, FSRS per item, context-as-bonus,
hint-ladder production) is deliberately built so that steps 1–4 are pure
content authoring. The bottleneck is honestly German authoring volume, not
engine capability.
