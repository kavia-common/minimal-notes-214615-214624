import Blits from '@lightningjs/blits'
import App from './App.js'

// Expose a safe env shim using a replace-at-build value injected by Vite define or fallback.
// This avoids using import.meta in module scope which can confuse the precompiler.
;(function () {
  var w = (typeof window !== 'undefined') ? window : null
  if (!w) return
  // Prefer pre-existing global (when set by build tooling), otherwise keep empty string.
  var injected = (w && Object.prototype.hasOwnProperty.call(w, '__ENV_VITE_API_BASE__')) ? w.__ENV_VITE_API_BASE__ : ''
  if (!injected) {
    injected = (w && Object.prototype.hasOwnProperty.call(w, '__VITE_API_BASE__')) ? w.__VITE_API_BASE__ : ''
  }
  w.__VITE_API_BASE__ = injected || ''
})()

console.log('[Bootstrap] Starting Minimal Notes app')

// Verify mount target exists and is empty
const mountEl = document.getElementById('app')
if (!mountEl) {
  console.error('[Bootstrap] #app mount element not found')
} else {
  // Minimal visible marker to confirm DOM is reachable before canvas mounts
  const probe = document.createElement('div')
  probe.style.cssText = 'position:absolute;left:2px;top:2px;width:6px;height:6px;background:#10B981;z-index:0;opacity:0.6;'
  mountEl.appendChild(probe)
}

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
