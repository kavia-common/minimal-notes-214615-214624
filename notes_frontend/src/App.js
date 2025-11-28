import Blits from '@lightningjs/blits'
import NotesHome from './pages/NotesHome.js'

/**
 * Root Application for Minimal Notes.
 * Removes dependency on RouterView to avoid any routing-related blank states
 * and renders NotesHome directly within an explicit content region.
 */
export default Blits.Application({
  // Declare components so static analyzers mark imports as used
  components: { NotesHome },
  template: `
    <Element w="1920" h="1080" color="#f9fafb" alpha="1" visible="true">
      <!-- App Header -->
      <Element x="24" y="16" w="1872" h="48" color="#ffffff" alpha="1" visible="true" zIndex="4">
        <Text content="Minimal Notes (LightningJS)" x="24" y="10" size="28" color="#111827" />
      </Element>

      <!-- Direct content area rendering NotesHome with fixed bounds -->
      <Element x="24" y="72" w="1872" h="992" color="#dde7ff" alpha="0.35" visible="true" zIndex="5">
        <NotesHome w="1872" h="992" />
      </Element>
    </Element>
  `,
  hooks: {
    ready() {
      console.log('[App] Ready: application mounted and NotesHome rendered directly')
    },
  },
})
