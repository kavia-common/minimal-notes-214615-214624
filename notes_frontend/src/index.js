import Blits from '@lightningjs/blits'
import App from './App.js'

// Expose a safe env shim using a replace-at-build value injected by Vite define or fallback.
// This avoids using import.meta in module scope which confuses the precompiler.
;(function () {
  var w = (typeof window !== 'undefined') ? window : null
  if (!w) return
  // Prefer pre-existing global (when set by build tooling), otherwise keep empty string.
  var injected = (w && Object.prototype.hasOwnProperty.call(w, '__ENV_VITE_API_BASE__')) ? w.__ENV_VITE_API_BASE__ : ''
  w.__VITE_API_BASE__ = injected
})()

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
  var el = document.getElementById('app')
  if (el) {
    el.innerHTML = '<div style="padding:16px;font-family:sans-serif;color:#111827">Failed to launch Minimal Notes</div>'
  }
}
