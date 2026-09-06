import './ui/styles.css'
import { app } from './ui/state'
import { renderMap } from './ui/mapview'

async function boot(): Promise<void> {
  await app.boot()
  const root = document.getElementById('app')!
  renderMap(root, app)

  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {
        // offline caching unavailable — the app still works as a plain static site
      })
    })
  }
}

void boot()
