import Blits from '@lightningjs/blits'
import App from './App.js'

console.log('[Bootstrap] Starting Minimal Notes app')

try {
  Blits.Launch(App, 'app', {
    w: 1920,
    h: 1080,
    debugLevel: 1,
  })
  console.log('[Bootstrap] Launch invoked successfully')
} catch (err) {
  console.error('[Bootstrap] Failed to launch app', err)
  const el = document.getElementById('app')
  if (el) {
    el.innerHTML = '<div style="padding:16px;font-family:sans-serif;color:#111827">Failed to launch Minimal Notes</div>'
  }
}
