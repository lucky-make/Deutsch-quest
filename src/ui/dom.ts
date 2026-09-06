export function h(tag: string, attrs: Record<string, unknown> = {}, ...children: (Node | string | null | undefined | false)[]): HTMLElement {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue
    if (k === 'class') el.className = v as string
    else if (k === 'dataset') Object.assign(el.dataset, v)
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v as EventListener)
    else if (k === 'html') el.innerHTML = v as string
    else if (v === true) el.setAttribute(k, '')
    else el.setAttribute(k, String(v))
  }
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue
    el.append(c instanceof Node ? c : document.createTextNode(c))
  }
  return el
}

export function clear(el: HTMLElement): void {
  el.replaceChildren()
}

let toastTimer: number | undefined
export function toast(msg: string): void {
  document.querySelector('.toast')?.remove()
  const t = h('div', { class: 'toast' }, msg)
  document.body.append(t)
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => t.remove(), 2600)
}

/** article chip: der→blue, die→red, das→green */
export function articleChip(german: string): string {
  const first = german.split(/\s+/)[0].toLowerCase().replace(/[.,!]/g, '')
  if (first === 'der') return `<span class="art-chip art-der">der</span>`
  if (first === 'die') return `<span class="art-chip art-die">die</span>`
  if (first === 'das') return `<span class="art-chip art-das">das</span>`
  return ''
}
