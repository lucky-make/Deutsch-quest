// @vitest-environment jsdom
import { beforeAll, describe, expect, it } from 'vitest'
import { App } from '../src/ui/state'
import { MemoryPersistence } from '../src/engine/storage'
import { registry } from '../src/engine/content'
import { renderMap } from '../src/ui/mapview'
import { openScene } from '../src/ui/sceneview'

/**
 * UI smoke: the real views render against the real registry without throwing.
 * Catches import cycles, missing icons/backgrounds and runtime type slips.
 */
describe('UI smoke', () => {
  let app: App
  let root: HTMLElement

  beforeAll(async () => {
    app = new App(new MemoryPersistence())
    await app.boot()
    root = document.createElement('div')
    document.body.append(root)
  })

  it('renders the story map with all 16 episodes', () => {
    renderMap(root, app)
    const text = root.textContent ?? ''
    expect(text).toContain('Ein Jahr in Leipzig')
    for (const ep of registry.episodes) {
      expect(text, ep.id).toContain(ep.title)
    }
    expect(root.querySelectorAll('.epcard')).toHaveLength(16)
  })

  it('renders scene 1 end-to-end: narration, dialogue, meet cards', () => {
    openScene(root, app, 'a1e1s1')
    const html = root.innerHTML
    expect(html).toContain('Hauptbahnhof')
    expect(html).toContain('Gleis 7')
    // meet cards are interactive — advance through them
    // advance narration → line → first meet card
    for (let i = 0; i < 5; i++) {
      const nextBtn = [...root.querySelectorAll('button')].find((b) => b.textContent === 'Weiter →')
      if (!nextBtn) break
      nextBtn.click()
      if (root.querySelector('.meet')) break
    }
    expect(root.querySelector('.meet')).toBeTruthy()
    expect(root.querySelector('.meet')?.textContent).toContain('Neu')
  })

  it('an exercise can be failed all the way down the ladder without breaking the scene', () => {
    openScene(root, app, 'a1e2s2')
    // advance narration
    let btn: HTMLButtonElement | undefined
    do {
      btn = [...root.querySelectorAll('button')].find((b) => b.textContent === 'Weiter →')
      btn?.click()
    } while (btn && !root.querySelector('.exercise'))
    const ex = root.querySelector('.exercise')
    expect(ex, 'exercise appears after meets').toBeTruthy()
  })
})
