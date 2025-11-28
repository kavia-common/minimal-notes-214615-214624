import Blits from '@lightningjs/blits'

import NotesHome from './pages/NotesHome.js'

export default Blits.Application({
  template: `
    <Element w="1920" h="1080" color="#f9fafb">
      <!-- Simple header without inline effects arrays -->
      <Element x="24" y="24" w="1872" h="72" color="#ffffff">
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
      console.log('[App] Ready: application mounted and router initialized')
    },
  },
})
