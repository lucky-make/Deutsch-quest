# DeutschPath — Ein Jahr in Leipzig

An offline-first, narrative German-learning web app spanning CEFR **A1–B2**.
**The story is the course**: you arrive in Leipzig with one suitcase, and German
enters your life because the character needs it — keys, brötchen, paperwork,
jobs, arguments, friends. Previously-taught language resurfaces naturally in
later, unrelated scenes, scheduled by a global FSRS engine — not by lesson
decks. Deployable as a static site to GitHub Pages; playable with zero internet
after first load.

```
npm install
npm run dev        # local dev (http://localhost:5173)
npm test           # 35 tests: engine invariants + content validation + UI smoke
npm run build      # typecheck → vite build → service worker  → deployable ./dist
```

## The engine (the interesting part)

All scheduling lives in `src/engine/` and follows six non-negotiable invariants
(each pinned by tests in `tests/`):

1. **Schedule by item, never by lesson.** One global pool of `KnowledgeItem`s;
   every scene pulls due items from the whole pool (`scheduler.buildSession`).
2. **Context is a ranking bonus, never a filter.** A due item from an unrelated
   scene stays eligible everywhere — shared context tags only move it up.
   There is no code path that excludes a due item for being "off-topic".
3. **Interleaving is enforced by scoring, not shuffling.** Same-origin-scene and
   same-tag items are penalized *inside* `scoreCandidate` (each sequential pick
   is scored against the previous pick). No `shuffle()` anywhere; output is
   fully deterministic.
4. **Never use memory strength to predict production-readiness.** The prompt is
   always the scene's natural difficulty; failure steps down a live hint ladder
   (skeleton → word tiles / MCQ → narrated reveal). `stability` is never read
   to soften a prompt.
5. **One memory record per item.** A single FSRS `ReviewState` per (learner,
   item) via `ts-fsrs` (MIT). No parallel recognition/production databases.
6. **Failure is never a dead end.** Wrong → hint → easier retry → narrated
   reveal; the scene continues whatever happens, and the lapsed item re-enters
   the session queue.

**Named resurfacing chain (checkable, not just a capability claim):**
„Ich hätte gern …" is learned at the bakery in A1 E2 and is provably retrievable
at the neighbourhood festival in B2 E4 — a 20+-scene gap, different context
tags, and deliberately *not* in that scene's `requiredItems`. Retrieval happens
because the item is due and shares tags, not because the script demands it.
Pinned by `tests/resurfacing.test.ts`; visible in-app under *Menü → Resurfacing-Ketten*.

## Audio — how it works

`src/engine/audio.ts` is a two-branch `AudioSource`:

1. **Bundled Piper audio (preferred):** if `src/content/audio-manifest.json`
   maps a German string to a file in `public/audio/`, that file is played.
   Generate it with:
   ```
   npm run audio:setup   # venv with piper-tts (MIT) + lameenc
   npm run audio         # renders every item + dialogue line → public/audio/*.mp3
   npm run build         # the service worker precaches all audio
   ```
   Voice: `de_DE-thorsten-medium` (MIT, Thorsten Müller / rhasspy-piper).
   The script fetches from Hugging Face, with GitHub mirrors as fallbacks.
   **Zero code changes** — adding the files switches the whole app to bundled audio.
2. **Web Speech API fallback (shipped in this build):** if no manifest entries
   exist, the browser's `speechSynthesis` speaks the German text (de-DE, rate
   adjustable in Menü). The 🔊 button reports its engine in the UI — it never
   silently does nothing.

> **This repository ships with branch 2 active.** The build sandbox allowed
> pypi/npm/github-api but firewalled every host serving the model bytes
> (huggingface.co, *.githubusercontent.com CDNs). `npm run audio` documents
> each failed mirror and exits with instructions. Run it on an unrestricted
> network to get the Piper branch.

## Content

- **16 episodes** (4 per level × A1/A2/B1/B2), 2–3 scenes each, **41 scenes**
- **238 KnowledgeItems** (5–7 new per scene), all hand-authored contemporary German
- Content lives entirely in JSON under `src/content/episodes/*.json`.
  The registry (`src/engine/registry.ts`) picks up every file via glob —
  **adding episode 17 requires zero engine code changes** (pinned by test).
- Cast, scenes, beats, items and their cross-references are validated by tests
  (introductions before requirements, speakers resolve, icons/backgrounds exist).

## Visuals

One hand-authored SVG system: ~80 flat two-tone line icons (`src/ui/icons.ts`)
and 14 minimal scene backgrounds (`src/ui/backgrounds.ts`), one fixed palette,
one stroke weight. No image generator, no external assets.

## Offline & data

- All learner state is local (IndexedDB). No server, no account, no analytics,
  no runtime network calls.
- Service worker (`scripts/generate-sw.mjs`) precaches every build asset →
  playable fully offline after first load; works as a plain static site without SW.
- `manifest.webmanifest` for installability.
- Progress (FSRS states + story + settings) exports/imports as JSON in Menü.

## Deploying to GitHub Pages

```bash
npm run build        # produces ./dist with relative paths (works in a subdirectory)
```
Publish `dist/` (e.g. via GitHub Actions or `gh-pages`). The app assumes a
subdirectory like `username.github.io/deutschpath/` — all paths are relative.

## What this is not (honest scope)

This is a real foundation, not the full product: 41 scenes cover a continuous
story but only a slice of A1–B2 German. There is no speech recognition, no
spaced long-form reading, one TTS voice, and content density per CEFR level is
intentionally thin. See the final report for exact numbers.
