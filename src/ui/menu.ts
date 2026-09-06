import { h, toast } from './dom'
import { parseImport, serializeExport, downloadJson } from '../engine/export'
import { resurfacingChains, liveTrailHits, NAMED_CHAINS } from '../engine/trails'
import { registry } from '../engine/content'
import { openScene } from './sceneview'
import type { App } from './state'

export function openMenu(app: App, onClose: () => void): void {
  const overlay = h('div', { class: 'overlay', onclick: (e: Event) => { if (e.target === overlay) close() } })
  const modal = h('div', { class: 'modal', role: 'dialog', 'aria-label': 'Menü' })

  const close = () => { app.audio.stop(); overlay.remove(); onClose() }

  modal.append(h('h2', {}, 'Menü'))

  // ——— audio status ———
  const st = app.audio.status()
  modal.append(
    h('h3', {}, 'Audio'),
    h('div', { class: 'audio-status' },
      st.engine === 'bundled'
        ? h('span', {}, 'Vorgerenderte Piper-Stimme: ', h('b', {}, st.voiceName))
        : st.engine === 'speech'
          ? h('span', {}, 'Browser-Sprachsynthese (Web Speech API): ', h('b', {}, st.voiceName), h('div', { style: 'color:var(--muted);margin-top:4px' }, 'Für gebündelte Piper-Audio: `npm run audio:setup && npm run audio` — dann neu bauen. Kein Code nötig.'))
          : h('span', {}, 'Kein Audio in diesem Browser verfügbar. Texte stehen trotzdem vollständig im Spiel.'),
    ),
    h('div', { class: 'row' },
      h('label', {}, 'Tempo: '),
      h('input', { type: 'range', min: '0.6', max: '1.2', step: '0.05', value: String(app.state.settings.ttsRate), oninput: (e: Event) => { app.state.settings.ttsRate = parseFloat((e.target as HTMLInputElement).value); void app.save() } }),
      h('button', { class: 'saybtn', onclick: () => app.audio.speak('Guten Tag! Willkommen in Leipzig.', undefined, (m) => toast(m)) }, '🔊 Test'),
    ),
    h('label', { class: 'toggle' },
      h('input', { type: 'checkbox', checked: app.state.settings.showTranslations, onchange: (e: Event) => { app.state.settings.showTranslations = (e.target as HTMLInputElement).checked; void app.save() } }),
      'Übersetzungen immer anzeigen',
    ),
  )

  // ——— resurfacing trails ———
  const chains = resurfacingChains(registry)
  const named = chains.filter((c) => c.named)
  const live = liveTrailHits(app.state.progress.retrievalLog, registry)
  const trailsBox = h('div', {},
    ...named.map((c) =>
      h('div', { class: 'trail named' },
        h('div', { class: 'de' }, c.german, h('span', { class: 'badge' }, 'bewiesene Kette')),
        h('div', { class: 'path' }, `${c.fromSceneTitle} → ${c.toSceneTitles.join(', ')} · gemeinsame Kontext-Tags: ${c.sharedTags.join(', ')}`),
      ),
    ),
    ...chains.filter((c) => !c.named).slice(0, 5).map((c) =>
      h('div', { class: 'trail' },
        h('div', { class: 'de' }, c.german),
        h('div', { class: 'path' }, `${c.fromSceneTitle} → ${c.toSceneTitles.join(', ')} · ${c.sharedTags.join(', ')}`),
      ),
    ),
    h('h3', {}, 'Deine Wiederkehr-Belege'),
    live.length
      ? h('div', {}, ...live.slice().reverse().slice(0, 8).map((l) =>
          h('div', { class: 'trail' }, h('span', { class: 'de' }, l.german), ` — gelernt in „${l.from}“, abgerufen in „${l.to}“`)))
      : h('div', { class: 'trail' }, 'Noch keine fächerübergreifenden Abrufe — spiel ein paar Szenen, dann erscheinen hier echte Belege.'),
  )
  modal.append(h('h3', {}, `Resurfacing-Ketten (${NAMED_CHAINS.length} benannte, ${chains.length} gefunden)`), trailsBox)

  // ——— story jump ———
  const sel = h('select', {}, ...registry.episodes.map((ep) => h('option', { value: ep.id }, `${ep.cefrLevel} · ${ep.title}`))) as HTMLSelectElement
  modal.append(
    h('h3', {}, 'Story-Sprung (zum Testen)'),
    h('div', { class: 'row' }, sel, h('button', {
      class: 'btn secondary',
      onclick: () => {
        const ep = registry.episodeById.get(sel.value)!
        const first = (registry.scenesByEpisode.get(ep.id) ?? [])[0]
        if (first) { close(); openScene(document.getElementById('app')!, app, first.id) }
      },
    }, 'Hüpfen')),
  )

  // ——— export / import ———
  const fileInput = h('input', { type: 'file', accept: 'application/json' }) as HTMLInputElement
  fileInput.addEventListener('change', () => {
    const f = fileInput.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const next = parseImport(String(reader.result))
        await app.replaceState(next)
        toast('Fortschritt importiert.')
        close()
      } catch (err) {
        toast(err instanceof Error ? err.message : 'Import fehlgeschlagen.')
      }
    }
    reader.readAsText(f)
  })
  modal.append(
    h('h3', {}, 'Fortschritt'),
    h('div', { class: 'row' },
      h('button', { class: 'btn teal', onclick: () => { downloadJson(serializeExport(app.state), `deutschpath-fortschritt-${new Date().toISOString().slice(0, 10)}.json`); toast('Export gestartet.') } }, '⬇ Export (JSON)'),
      h('button', { class: 'btn secondary', onclick: () => fileInput.click() }, '⬆ Import'),
    ),
    h('div', { class: 'row' },
      h('button', {
        class: 'btn secondary',
        onclick: () => {
          if (confirm('Wirklich allen Fortschritt löschen? Das kann nicht rückgängig gemacht werden.')) {
            void app.replaceState({ reviews: {}, progress: { completedSceneIds: [], currentSceneId: null, sceneLog: [], retrievalLog: [] }, settings: app.state.settings, recent: { itemIds: [], tags: [], sceneIds: [] } })
            toast('Fortschritt zurückgesetzt.')
            close()
          }
        },
      }, 'Fortschritt zurücksetzen'),
    ),
  )

  modal.append(h('div', { class: 'row', style: 'margin-top:16px' }, h('button', { class: 'btn', style: 'flex:1', onclick: close }, 'Schließen')))
  overlay.append(modal)
  document.body.append(overlay)
}
