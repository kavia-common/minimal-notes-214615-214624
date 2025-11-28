import Blits from '@lightningjs/blits'
import NotesHome from './pages/NotesHome.js'

/**
 * Root Application for Minimal Notes.
 * Renders NotesHome directly within an explicit content region.
 */
export default Blits.Application({
  components: { NotesHome },
  template: `
    <Element w="1920" h="1080" color="#f9fafb" alpha="1" visible="true">
      <!-- App Header -->
      <Element x="0" y="0" w="1920" h="64" color="#ffffff" alpha="1" visible="true" zIndex="6">
        <Text content="Minimal Notes (LightningJS)" x="24" y="16" size="28" color="#111827" />
      </Element>

      <!-- Direct content area rendering NotesHome with fixed bounds -->
      <Element x="0" y="64" w="1920" h="1016" color="#dde7ff" alpha="0.0" visible="true" zIndex="2">

        <NotesHome w="1920" h="1016" />
      </Element>
    </Element>
  `,
  hooks: {
    ready() {
      console.log('[App] Ready: application mounted and NotesHome rendered directly with content region below header')
    },
  },
})
