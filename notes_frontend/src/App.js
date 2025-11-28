import Blits from '@lightningjs/blits'

import NotesHome from './pages/NotesHome.js'

export default Blits.Application({
  template: `
    <Element w="1920" h="1080" color="#f9fafb" alpha="1" visible="true">
      <!-- App Header -->
      <Element x="24" y="24" w="1872" h="72" color="#ffffff" alpha="1" visible="true" zIndex="5">
        <Text content="Minimal Notes (LightningJS)" x="24" y="20" size="36" color="#111827" />
      </Element>

      <!-- Routed Content Area -->
      <Element x="24" y="112" w="1872" h="944" color="#dde7ff" alpha="0.6" visible="true" zIndex="1">
        <!-- Give RouterView explicit bounds so child layouts can anchor properly -->
        <RouterView w="1872" h="944" />
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
