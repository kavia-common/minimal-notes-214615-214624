import Blits from '@lightningjs/blits'

import NotesHome from './pages/NotesHome.js'

export default Blits.Application({
  // Provide a simple visible fallback header so the screen never appears blank,
  // and mount the RouterView for actual content.
  template: `
    <Element w="1920" h="1080" color="#f9fafb">
      <!-- Fallback header is always visible -->
      <Element x="24" y="24" w="1872" h="72" color="#ffffff" :effects="[{type:'radius', radius: 12}]">
        <Text content="Minimal Notes (LightningJS)" x="24" y="20" size="36" color="#111827" />
      </Element>
      <!-- Routed content -->
      <Element x="24" y="112" w="1872" h="944">
        <RouterView />
      </Element>
    </Element>
  `,
  routes: [{ path: '/', component: NotesHome }],

  hooks: {
    ready() {
      // Basic mount log for diagnostics
      console.log('[App] Ready: application mounted and router initialized')
    },
  },
})
