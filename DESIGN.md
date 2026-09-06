# DeutschQuest — design notes

Companion to `index.html` (the whole game in one file).
Source material: the owner's screenshot of the "5 laws" (retrieval 6:32, spacing 8:00,
interleaving 9:03, teach-back 10:20, chunking) + one added rule:
**what you missed must come back — in later lessons.**

## 1. Structure: one story, not a course catalog

The curriculum *is* essentials (everyday German, VHS-Lernportal style): no abstract
word lists, only what a first year in Germany actually throws at you. The 12 episodes
double as the CEFR ladder and as a plotted narrative (second person, recurring cast:
Frau Schneider, Deniz, Herr Weber, Dr. Klein, Miriam):

| Ep | Title | Level | Everyday situation |
|---|---|---|---|
| 1 | Ankunft | A1 | station, first sentences, Sie/du |
| 2 | Die Anmeldung | A1 | forms, Vorname/Nachname, TT.MM.JJJJ |
| 3 | Brot & Pfand | A1 | supermarket, ordering, kein/nicht, 13 vs 30 |
| 4 | Die Wohnung | A1 | flat hunt, separable verbs, dative prepositions |
| 5 | Fieber | A2 | doctor, symptoms, weil/dass |
| 6 | Der Job | A2 | application, interview, reflexives, um…zu/damit |
| 7 | Bahnsteig 3 | A2 | transport, delays, wo/wohin + cases |
| 8 | Briefe & Fristen | B1 | bank & authority letters, passive, Konjunktiv II, 1.234,56 € |
| 9 | Die Party | B1 | social life, relative clauses, obwohl/trotzdem |
| 10 | Notfall | B1 | lost phone, 110/112, passive alternatives |
| 11 | Meinung & Medien | B2 | arguing politely, Konjunktiv I, participial attributes |
| 12 | Bleibst du? | B2 | staying: connectors, genitive, nominal style — season finale |

Each episode opens with a scene (`intro`) and closes with a beat + hook (`outro`);
the next episode's intro shows a "Zuletzt: …" recap. Episodes unlock in order
(`S.prog.ep`), store best accuracy (`S.prog.done`), and can be replayed forever.

## 2. The review law (cross-episode spaced repetition)

- A lapse (grade ≤ 1) → box 0, due in ~45 s, **re-queued inside the same session** (max 2×).
- Every episode session reserves **4 review slots** filled from *other* episodes'
  due/lapsed cards (`reviewPool`, lapses first, then most overdue) and tags them
  `🔁 Wiederholung · Ep. n` in play — you literally see old misses return in new lessons.
- 🔁 **Wiederholung mode** on the home screen serves up to 12 due cards from anywhere.
-  **Erklär-Training** serves teach-back cards from unlocked episodes only.
- Scheduler: Leitner boxes 0–6 = now/10 min/1 d/3 d/7 d/21 d/60 d; fog = elapsed ÷ interval;
  queue priority: overdue ≫ fog ∈ [0.6, 1.0) ≫ new ≫ fresh; fog bonus ×1.5 XP at 0.6–1.3.

Grades encode effort: typed recall / Bild-Karte / Hör-Profi = 3, builder = 3 (2 with hint),
teach-back self-rating maps 3/2/0 (peek caps at 2 and halves XP), multiple choice = 2,
Fehler-Jagd = diagnosis (2) + fix (1). XP = base × combo × fog bonus.

## 3. Interleaving & "which strategy?"

Session queues are greedy-shuffled so consecutive cards differ in kind; the mini-game is
re-rolled per card and never repeats twice in a row. Fehler-Jagd is the top interleave
level: 9 error types (word order, case, negation, separable, helper verb, clause
structure, preposition, connector, reported speech) — diagnose first, then fix.

## 4. Images, sound, offline purity

- `IMG` is a library of ~40 hand-drawn inline SVGs (apple, fridge, Fahrkarte, Amt form …).
  Bild-Karte mode shows only the picture → type the German. Zero binary assets.
- Sound: WebAudio synth (correct/wrong/combo blips). Speech: the **device's own**
  German voice via `speechSynthesis` when available (still offline); hidden otherwise.
- Storage: `localStorage` with an in-memory fallback for sandboxed contexts;
  export/import progress as JSON for multi-device life.

## 5. Extending

- New episode: append to `EPS` + cards with matching `ep`. Unlock order follows `n`.
- New card kinds or mini-games: add a case in `mgOptions()` + `present()` + the click handler.
- Strict spacing variant: make `buildEpisodeQueue` refuse to pad with fresh cards when
  nothing is due ("come back when it's foggy") — one-line change.
- PWA wrapper (manifest + tiny service worker) makes the Pages link installable and
  cache-offline; the single file already is the whole app.

## 6. Playtest checklist

- [x] 12/12 episodes complete end-to-end, unlocks, replays (automated smoke run).
- [x] Lapses from a bad episode reappear as 🔁 slots in later sessions.
- [ ] Honesty pressure: if players spam "nailed it" in teach-back, drop its XP below recall.
- [ ] Balance: episode 12 is the boss (17 cards, B2) — watch lapse rates there.
