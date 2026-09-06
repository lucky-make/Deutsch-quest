import { registry } from '../engine/content'
import { SceneSession, type Exercise, type CheckOutcome } from '../engine/session'
import { background } from './backgrounds'
import { h, articleChip, toast } from './dom'
import { icon } from './icons'
import type { App } from './state'
import { renderMap } from './mapview'
import type { SceneBeat } from '../engine/types'

/**
 * Scene player: renders beats one by one. Check beats consume the engine's
 * session plan (new items + globally-ranked due items). Wrong answers step
 * down the hint ladder — the scene always continues (invariant 6).
 */
export function openScene(root: HTMLElement, app: App, sceneId: string): void {
  const sceneQ = registry.sceneById.get(sceneId)
  if (!sceneQ) return toast('Szene nicht gefunden.')
  const scene = sceneQ
  const episode = registry.episodeById.get(scene.episodeId)!
  app.sessionItemIds = []

  const session = new SceneSession(scene, {
    items: registry.items,
    reviews: app.reviewsAsMap(),
    now: new Date(),
    recent: app.recentForRanking(),
    hooks: {
      getReview: (id) => app.getReview(id),
      recordOutcome: (outcome, newState) => {
        app.state.reviews[newState.itemId] = newState
        app.logRetrieval(newState.itemId, scene.id, outcome.rating, outcome.hintsUsed)
        void app.save()
      },
    },
  })

  root.replaceChildren()
  let beatIdx = 0
  const shownItems: string[] = []
  let stats = { checks: 0, firstTry: 0, revealed: 0 }

  const wrap = h('div', {})
  root.append(wrap)

  // header
  wrap.append(
    h('div', { class: 'topbar' },
      h('button', { class: 'iconbtn', onclick: () => renderMap(root, app) }, '← Karte'),
      h('div', { class: 'spacer' }),
      h('div', { class: 'chip', dataset: { level: episode.cefrLevel } }, `${episode.cefrLevel} · ${episode.title}`),
    ),
    h('div', { class: 'scenehead' },
      h('div', { class: 'art', html: background(scene.bg) }),
      h('div', { class: 'meta' },
        h('div', { class: 'ep' }, `${scene.place}`),
        h('h2', {}, scene.title),
      ),
    ),
  )
  const beatsEl = h('div', { class: 'beats' })
  wrap.append(beatsEl)

  const scrollEnd = () => requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }))

  function speakerName(id: string): string {
    return registry.cast.get(id)?.name ?? id
  }

  function renderLineBeat(beat: Extract<SceneBeat, { type: 'line' }>) {
    const el = h('div', { class: 'beat dlg' },
      h('div', { class: 'who' }, h('span', { class: 'avatar' }, speakerName(beat.speaker).slice(0, 1)), speakerName(beat.speaker)),
      h('div', { class: 'de' }, beat.text),
      beat.translation && app.state.settings.showTranslations ? h('div', { class: 'en' }, beat.translation) : null,
      h('div', { class: 'tools' },
        h('button', {
          class: 'saybtn',
          onclick: (e: Event) => {
            const btn = e.currentTarget as HTMLElement
            btn.classList.add('speaking')
            app.audio.speak(beat.text, () => btn.classList.remove('speaking'), (msg) => { btn.classList.remove('speaking'); toast(msg) })
          },
        }, '🔊 Anhören'),
        h('button', { class: 'tbtn', onclick: (e: Event) => toggleTranslation(e, beat.translation) }, app.state.settings.showTranslations ? 'Verbergen' : 'Übersetzung'),
      ),
    )
    return el
  }

  function toggleTranslation(e: Event, translation?: string) {
    const dlg = (e.currentTarget as HTMLElement).closest('.dlg, .meet, .exercise') as HTMLElement
    const existing = dlg.querySelector('.en-x')
    if (existing) { existing.remove(); return }
    if (!translation) return
    dlg.append(h('div', { class: 'en en-x' }, translation))
  }

  function renderMeetBeat(beat: Extract<SceneBeat, { type: 'meet' }>): HTMLElement {
    const items = beat.itemIds.map((id) => registry.itemById.get(id)!).filter(Boolean)
    shownItems.push(...beat.itemIds)
    const cont = h('div', { class: 'beat' })
    const show = (i: number) => {
      if (i >= items.length) {
        cont.replaceChildren(h('div', { class: 'narration' }, 'Neu im Kopf. Sie kommen wieder — versprochen.'))
        next()
        return
      }
      const item = items[i]
      const card = h('div', { class: 'meet' },
        h('div', { class: 'tag' }, i === 0 ? 'Neu' : 'auch neu'),
        h('div', { class: 'row' },
          item.image && icon(item.image) ? h('div', { class: 'iconwrap', html: icon(item.image, 30) }) : null,
          h('div', {},
            h('div', { class: 'de', html: `${articleChip(item.german)} ${escapeRest(item.german)}` }),
            h('div', { class: 'en' }, item.meaning),
          ),
        ),
        item.note ? h('div', { class: 'note' }, item.note) : null,
        h('div', { class: 'tools' },
          h('button', {
            class: 'saybtn',
            onclick: (e: Event) => {
              const btn = e.currentTarget as HTMLElement
              btn.classList.add('speaking')
              app.audio.speak(item.speak ?? item.german, () => btn.classList.remove('speaking'), (msg) => { btn.classList.remove('speaking'); toast(msg) })
            },
          }, '🔊 Anhören'),
        ),
      )
      cont.replaceChildren(card, h('div', { class: 'acts', style: 'margin-top:10px' },
        h('button', { class: 'btn secondary', onclick: () => show(i) }, 'Nochmal'),
        h('button', { class: 'btn', onclick: () => show(i + 1) }, 'Weiter →'),
      ))
      scrollEnd()
    }
    show(0)
    return cont
  }

  function escapeRest(german: string): string {
    // article chip already consumed the first word if it was der/die/das
    const first = german.split(/\s+/)[0].toLowerCase()
    if (first === 'der' || first === 'die' || first === 'das') return german.split(/\s+/).slice(1).join(' ')
    return german
  }

  function renderCheckBeat(beat: Extract<SceneBeat, { type: 'check' }>): HTMLElement | null {
    const cont = h('div', { class: 'beat' })
    let done = 0
    const nextCheck = () => {
      if (done >= beat.count) {
        cont.append(h('div', { class: 'narration' }, '—'))
        next()
        return
      }
      let mode = beat.mode
      if (mode === 'mixed') mode = session.hasNew() ? 'new' : 'recall'
      if ((mode === 'new') && !session.hasNew()) mode = 'recall'
      if ((mode === 'recall' || mode === 'listen') && !session.hasDue() && session.hasNew()) mode = 'new'
      const ex = session.makeExercise(mode)
      if (!ex) {
        cont.append(h('div', { class: 'narration' }, '—'))
        next()
        return
      }
      app.sessionItemIds.push(ex.item.id)
      done++
      cont.replaceChildren(renderExercise(ex, nextCheck))
      scrollEnd()
    }
    nextCheck()
    return cont
  }

  function renderExercise(ex: Exercise, onDone: () => void): HTMLElement {
    const view = ex.view()
    const item = ex.item
    const card = h('div', { class: 'exercise' })
    const tagText = ({ type: 'Sag es auf Deutsch', cloze: 'Vervollständige', listen: 'Was hast du gehört?' } as Record<string, string>)[view.kind] ?? 'Antworte'
    card.append(h('div', { class: 'tag' }, tagText))

    // prompt
    if (view.kind === 'cloze') {
      card.append(h('div', { class: 'prompt' }, h('div', { class: 'de' }, item.german), h('div', { class: 'meaning' }, item.meaning)))
    } else if (view.kind === 'listen') {
      card.append(h('div', { class: 'prompt' }, 'Hör zu und schreib, was du hörst.'))
      setTimeout(() => app.audio.speak(item.speak ?? item.german, undefined, (m) => toast(m)), 350)
    } else {
      card.append(
        h('div', { class: 'prompt' },
          item.image && icon(item.image) ? h('span', { html: icon(item.image, 26), style: 'vertical-align:-6px;margin-right:6px' }) : null,
          h('span', { class: 'meaning' }, item.meaning),
        ),
      )
    }

    const hintEl = h('div', {})
    const inputRow = h('div', { class: 'answerrow' })
    const input = h('input', { type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder: 'Auf Deutsch …' }) as HTMLInputElement
    const checkBtn = h('button', { class: 'btn' }, 'Antworten')
    inputRow.append(input, checkBtn)
    card.append(inputRow, hintEl)

    
    let tileRow: HTMLElement | null = null

    const finish = (outcome: CheckOutcome, ok: boolean) => {
      session.grade(ex, outcome, new Date())
      stats.checks++
      if (ok && outcome.hintsUsed === 0) stats.firstTry++
      if (!ok) stats.revealed++
      inputRow.remove()
      tileRow?.remove()
      hintEl.remove()
      const fb = h('div', { class: `feedback ${ok ? 'ok' : 'no'}` },
        ok
          ? h('div', {}, h('b', {}, ['Stark!', 'Gut, mit kleiner Hilfe.', 'Geschafft — mit Stütze.'][Math.min(outcome.hintsUsed, 2)]), ' ')
          : h('div', { class: 'narr' }, 'So sagt man es — die Szene erzählt es dir:'),
        h('div', { class: 'de' }, item.german),
        h('div', { class: 'en' }, item.meaning),
        h('div', { class: 'tools', style: 'margin-top:6px' },
          h('button', {
            class: 'saybtn',
            onclick: (e: Event) => {
              const btn = e.currentTarget as HTMLElement
              btn.classList.add('speaking')
              app.audio.speak(item.speak ?? item.german, () => btn.classList.remove('speaking'), (m) => { btn.classList.remove('speaking'); toast(m) })
            },
          }, '🔊'),
        ),
      )
      card.append(fb)
      card.append(h('div', { class: 'acts' }, h('button', { class: 'btn teal', onclick: onDone }, 'Weiter →')))
      scrollEnd()
    }

    const submit = (attempt: string) => {
      if (ex.submit(attempt)) {
        finish(ex.outcome(), true)
        return
      }
      const input2 = input
      input2?.classList.add('shake')
      setTimeout(() => input2?.classList.remove('shake'), 350)
      if (ex.stepDown()) {
        const v = ex.view()
        hintEl.replaceChildren()
        if (v.hint) hintEl.append(h('div', { class: 'hintbox' }, v.hint))
        if (v.tiles) {
          tileRow = h('div', { class: 'tiles' })
          const built: string[] = []
          for (const t of v.tiles) {
            const tile = h('button', {
              class: 'tile',
              onclick: () => {
                if (tile.classList.contains('used')) return
                tile.classList.add('used')
                built.push(t)
                input.value = built.join(' ')
              },
            }, t)
            tileRow.append(tile)
          }
          hintEl.append(tileRow)
        }
        if (v.kind === 'word-mcq') {
          const mcq = h('div', { class: 'mcq' })
          for (const opt of v.options ?? []) {
            mcq.append(h('button', {
              class: 'opt',
              onclick: (e: Event) => {
                input.value = opt
                submit(opt)
              },
            }, opt))
          }
          hintEl.append(mcq)
          inputRow.style.display = 'none'
        }
        hintEl.append(h('div', { class: 'narration', style: 'font-size:12.5px' }, ex.hintLevel === 1 ? 'Kleiner Tipp. Versuch’s nochmal.' : 'Bau den Satz zusammen.'))
      } else {
        // ladder exhausted → reveal narratively, rate as failed, scene continues
        finish(ex.failOutcome(), false)
      }
    }

    checkBtn.addEventListener('click', () => { if (input.value.trim()) submit(input.value) })
    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && input.value.trim()) submit(input.value)
    })
    setTimeout(() => input.focus({ preventScroll: true }), 60)
    return card
  }

  function renderReadingBeat(beat: Extract<SceneBeat, { type: 'reading' }>): HTMLElement {
    const cont = h('div', { class: 'beat' })
    const card = h('div', { class: 'reading' },
      h('div', { class: 'tag' }, 'Lektüre'),
      h('h4', {}, beat.title),
      h('div', { class: 'prose' }, beat.text),
    )
    if (beat.itemIds?.length) {
      const gloss = h('div', { class: 'gloss' })
      for (const id of beat.itemIds) {
        const it = registry.itemById.get(id)
        if (!it) continue
        gloss.append(h('span', { class: 'chip2' },
          it.image && icon(it.image) ? h('span', { html: icon(it.image, 13) }) : null,
          it.german,
          h('button', {
            class: 'saybtn',
            style: 'padding:1px 5px;border:none;background:transparent',
            onclick: (e: Event) => {
              const btn = e.currentTarget as HTMLElement
              btn.classList.add('speaking')
              app.audio.speak(it.speak ?? it.german, () => btn.classList.remove('speaking'), (m) => { btn.classList.remove('speaking'); toast(m) })
            },
          }, '🔊'),
        ))
      }
      card.append(gloss)
    }
    card.append(
      h('div', { class: 'tools' },
        h('button', {
          class: 'saybtn',
          onclick: (e: Event) => {
            const btn = e.currentTarget as HTMLElement
            btn.classList.add('speaking')
            app.audio.speak(beat.text, () => btn.classList.remove('speaking'), (m) => { btn.classList.remove('speaking'); toast(m) })
          },
        }, '🔊 Vorlesen'),
        h('button', { class: 'tbtn', onclick: (e: Event) => toggleTranslation(e, beat.translation) }, 'Übersetzung'),
      ),
    )
    cont.append(card, h('div', { class: 'acts', style: 'display:flex;margin-top:10px' },
      h('button', { class: 'btn secondary', style: 'flex:1', onclick: next }, 'Weiter lesen →'),
    ))
    return cont
  }

  function renderChoiceBeat(beat: Extract<SceneBeat, { type: 'choice' }>): HTMLElement {
    const cont = h('div', { class: 'beat' })
    if (beat.prompt) cont.append(h('div', { class: 'narration' }, beat.prompt))
    const choices = h('div', { class: 'choices' })
    for (const opt of beat.options) {
      choices.append(h('button', {
        class: 'opt',
        onclick: (e: Event) => {
          choices.remove()
          if (opt.line) {
            cont.append(h('div', { class: 'dlg' },
              h('div', { class: 'who' }, 'Du'),
              h('div', { class: 'de' }, opt.line),
              h('div', { class: 'tools' },
                h('button', {
                  class: 'saybtn',
                  onclick: (e2: Event) => {
                    const btn = e2.currentTarget as HTMLElement
                    btn.classList.add('speaking')
                    app.audio.speak(opt.line!, () => btn.classList.remove('speaking'), (m) => { btn.classList.remove('speaking'); toast(m) })
                  },
                }, '🔊'),
              ),
            ))
          }
          cont.append(h('div', { class: 'acts', style: 'margin-top:10px' }, h('button', { class: 'btn', onclick: next }, 'Weiter →')))
          scrollEnd()
        },
      }, opt.label, opt.translation ? h('small', {}, opt.translation) : null))
    }
    cont.append(choices)
    return cont
  }

  function next(): void {
    const beat = scene.beats[beatIdx++]
    if (!beat) {
      finishScene()
      return
    }
    let el: HTMLElement | null = null
    switch (beat.type) {
      case 'narration': el = h('div', { class: 'beat narration' }, beat.text); break
      case 'line': el = renderLineBeat(beat); break
      case 'meet': el = renderMeetBeat(beat); break
      case 'check': el = renderCheckBeat(beat); break
      case 'choice': el = renderChoiceBeat(beat); break
      case 'reading': el = renderReadingBeat(beat); break
    }
    if (el) beatsEl.append(el)
    if (beat.type === 'narration' || beat.type === 'line') {
      beatsEl.append(h('div', { class: 'beat acts', style: 'display:flex' },
        h('button', { class: 'btn secondary', style: 'flex:1', onclick: next }, beat.type === 'narration' ? 'Weiter →' : 'Antworten / Weiter →'),
      ))
    }
    scrollEnd()
  }

  function finishScene(): void {
    app.completeScene(scene.id, shownItems)
    const hasNext = !!registry.scenesInOrder.find((s) => s.id === app.currentSceneId())
    const done = h('div', { class: 'done' },
      h('h3', {}, `Szene geschafft — ${scene.title}`),
      h('div', { class: 'stats' },
        h('span', {}, h('b', {}, String(stats.checks)), ' Abrufe'),
        h('span', {}, h('b', {}, String(stats.firstTry)), ' auf Anhieb'),
        h('span', {}, h('b', {}, String(shownItems.length)), ' neue Inhalte'),
      ),
      h('p', { style: 'color:var(--muted);font-size:13.5px' },
        'Alles, was du hier gehört hast, meldet sich wieder — über den globalen Zeitplan, wenn es fällig ist, egal in welcher Szene.'),
      h('div', { class: 'continue-row' },
        h('button', { class: 'btn secondary', onclick: () => renderMap(root, app) }, 'Zur Karte'),
        hasNext ? h('button', {
          class: 'btn',
          onclick: () => {
            const nid = app.currentSceneId()
            if (nid) openScene(root, app, nid)
          },
        }, 'Nächste Szene →') : null,
      ),
    )
    beatsEl.append(done)
    scrollEnd()
  }

  next()
}
