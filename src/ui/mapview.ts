import { registry } from '../engine/content'
import { background } from './backgrounds'
import { h } from './dom'
import type { App } from './state'
import { openScene } from './sceneview'
import { openMenu } from './menu'

const ARC_TITLES: Record<string, string> = {
  A1: 'Neu in Leipzig — arriving, first words, first friends',
  A2: 'Der Alltag — Amt, Arbeit, Apotheke',
  B1: 'Mitten im Leben — opinions, work, moving',
  B2: 'Angekommen — responsibility, voice, Zuhause',
}

export function renderMap(root: HTMLElement, app: App): void {
  root.replaceChildren()
  const wrap = h('div', {})

  // top bar
  const audio = app.audio.status()
  wrap.append(
    h('div', { class: 'topbar' },
      h('div', { class: 'logo' }, h('span', { class: 'mark', html: iconMark() }), h('span', {}, 'Deutsch', h('b', {}, 'Path'))),
      h('div', { class: 'chip' }, `${app.knownCount()} gelernt`),
      h('div', { class: 'chip', title: `Audio: ${audio.engine} (${audio.voiceName || '—'})` }, audio.engine === 'bundled' ? '🔊 Piper' : audio.engine === 'speech' ? '🔊 Browser-Stimme' : '🔇 ohne Audio'),
      h('div', { class: 'spacer' }),
      h('button', { class: 'iconbtn', onclick: () => openMenu(app, () => renderMap(root, app)) }, '⚙︎ Menü'),
    ),
  )

  // hero
  const current = app.currentSceneId()
  wrap.append(
    h('div', { class: 'hero' },
      h('div', { class: 'art', html: background('strasse') }),
      h('div', { class: 'blurb' },
        h('h1', {}, 'Ein Jahr in Leipzig'),
        h('p', {}, 'Du bist neu hier. Die Stadt spricht Deutsch — und mit jeder Szene sprichst du mit. Jede Wiederholung kommt zurück, wenn sie dran ist, nicht wenn die Lektion es sagt.'),
      ),
    ),
  )

  // continue CTA
  if (current) {
    const scene = registry.sceneById.get(current)!
    const ep = registry.episodeById.get(scene.episodeId)!
    wrap.append(
      h('div', { class: 'cta' },
        h('button', {
          class: 'btn',
          onclick: () => openScene(root, app, scene.id),
        }, app.state.progress.completedSceneIds.length ? `Weiterspielen: ${ep.title} · ${scene.title}` : 'Ankommen — Szene 1 beginnen'),
      ),
    )
  }

  // arcs by level
  for (const level of ['A1', 'A2', 'B1', 'B2'] as const) {
    const eps = registry.episodes.filter((e) => e.cefrLevel === level)
    if (!eps.length) continue
    const itemCount = registry.items.filter((i) => i.cefrLevel === level).length
    wrap.append(h('div', { class: 'arc' }, h('h2', {}, `Level ${level}`), h('span', { class: 'sub' }, `${ARC_TITLES[level] ?? ''} · ${eps.length} Folgen · ${itemCount} Inhalte`)))
    const grid = h('div', { class: 'episodes' })
    for (const ep of eps) {
      const scenes = registry.scenesByEpisode.get(ep.id) ?? []
      const dots = h('div', { class: 'dots' },
        ...scenes.map((s) => {
          const done = app.state.progress.completedSceneIds.includes(s.id)
          const isCurrent = current === s.id
          return h('span', { class: `dot ${done ? 'done' : ''} ${isCurrent ? 'current' : ''}`, title: s.title })
        }),
      )
      const firstOpen = scenes.find((s) => app.isUnlocked(s.id) && !app.state.progress.completedSceneIds.includes(s.id))
      grid.append(
        h('div', { class: 'epcard' },
          h('div', { class: 'head' }, h('span', { class: 'chip', dataset: { level: level } }, level), h('h3', {}, ep.title), dots),
          h('p', { class: 'en' }, ep.titleEn),
          h('div', { class: 'row' },
            h('p', { class: 'blurb' }, ep.blurb),
            firstOpen
              ? h('button', { class: 'btn teal', onclick: () => openScene(root, app, firstOpen.id) }, '▶')
              : scenes.every((s) => app.state.progress.completedSceneIds.includes(s.id))
                ? h('span', { class: 'chip' }, '✓')
                : h('span', { class: 'chip' }, '🔒'),
          ),
        ),
      )
    }
    wrap.append(grid)
  }

  wrap.append(h('div', { class: 'foot' }, 'DeutschPath — läuft komplett offline. Fortschritt bleibt auf diesem Gerät.'))
  root.append(wrap)
}

function iconMark(): string {
  return `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path d="M3 19V9l9-6 9 6v10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M8 19v-6h8v6" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="12" cy="10.5" r="1.2" fill="#E9A13B"/>
  </svg>`
}
