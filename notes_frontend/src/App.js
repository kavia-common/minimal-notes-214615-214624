import Blits from '@lightningjs/blits'

import NotesHome from './pages/NotesHome.js'

export default Blits.Application({
  template: `
    <Element w="1920" h="1080" color="#f9fafb" alpha="1" visible="true">
      <!-- App Header -->
      <Element x="24" y="16" w="1872" h="48" color="#ffffff" alpha="1" visible="true" zIndex="4">
        <Text content="Minimal Notes (LightningJS)" x="24" y="10" size="28" color="#111827" />
      </Element>

      <!-- Routed Content Area (explicit size and higher zIndex so panes are interactive) -->
      <Element x="24" y="72" w="1872" h="992" color="#dde7ff" alpha="0.35" visible="true" zIndex="5">
        <!-- Give RouterView explicit bounds so child layouts can anchor properly -->
        <RouterView w="1872" h="992" />
      </Element>
    </Element>
  `,
  // Ensure initial route renders NotesHome without conditional logic
  routes: [{ path: '/', component: NotesHome }],

  hooks: {
    ready() {
      console.log('[App] Ready: application mounted and router initialized')
    },
    afterRouteUpdate({ route }) {
      console.log('[App] Route updated to:', route && route.path ? route.path : route)
    },
  },
})
