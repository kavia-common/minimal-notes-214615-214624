import Blits from '@lightningjs/blits'
import { theme } from '../theme.js'
import NotesList from '../components/NotesList.js'
import NoteEditor from '../components/NoteEditor.js'
import { getNotes, createNote } from '../services/notesService.js'

export default Blits.Component('NotesHome', {
  components: {
    NotesList,
    NoteEditor,
  },

  template: `
    <Element w="1920" h="1080" :color="theme.colors.background">
      <Element w="1920" h="1080" :color="theme.colors.overlay" />

      <Element :x="$pad" :y="$pad" :w="$contentW" :h="theme.layout.headerHeight"
               :effects="$headerEffects"
               :color="theme.colors.surface">
        <Text content="Minimal Notes" :x="$pad" y="24" size="40" color="${theme.colors.text}" />
        <Text :content="$apiLabel" :x="$pad" y="64" size="20" color="${theme.colors.textMuted}" />
        <Element :x="$contentW - 140" y="20" w="120" h="48"
                 :effects="$btnEffects"
                 :color="$btnColor"
                 @mouseenter="$onHoverNew(true)" @mouseleave="$onHoverNew(false)"
                 @enter="$newNote()">
          <Text content="+ New" size="26" align="center" x="60" y="24" color="${theme.colors.primary}" />
        </Element>
      </Element>

      <Element :x="$pad" :y="$contentY" :w="$contentW" :h="$contentH">
        <Element :w="theme.layout.sidebarWidth" :h="$contentH">
          <NotesList :selectedId="$selectedId" :onSelect="$onSelect" :w="theme.layout.sidebarWidth" :h="$contentH" />
        </Element>

        <Element :x="$rightX" :w="$rightW" :h="$contentH">
          <NoteEditor :noteId="$selectedId" :w="$rightW" :h="$contentH" />
        </Element>
      </Element>
    </Element>
  `,

  state() {
    const initial = getNotes()
    const selected = (initial && initial[0] && initial[0].id) ? initial[0].id : createNote({ title: 'New note' }).id

    let apiBase = ''
    try {
      if (typeof import !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) {
        apiBase = import.meta.env.VITE_API_BASE
      }
    } catch (e) {
      apiBase = ''
    }
    const label = 'API: ' + (apiBase ? apiBase : 'in-memory')

    // layout numbers
    const pad = 24
    const fullW = 1920
    const fullH = 1080
    const contentW = fullW - pad * 2 // 1872
    const contentY = pad + theme.layout.headerHeight + theme.layout.gap
    const contentH = fullH - (contentY + pad)
    const rightX = theme.layout.sidebarWidth + theme.layout.gap
    const rightW = contentW - (theme.layout.sidebarWidth + theme.layout.gap)

    return {
      theme,
      hoverNew: false,
      selectedId: selected,
      apiLabel: label,

      // precomputed visual helpers
      headerEffects: [$shader('radius', { radius: theme.effects.radiusLg }), $shadow(theme.effects.shadowSm)],
      btnEffects: [$shader('radius', { radius: theme.effects.radiusSm })],
      btnColor: 'transparent',

      pad,
      contentW,
      contentY,
      contentH,
      rightX,
      rightW,
    }
  },

  methods: {
    $onSelect(id) {
      this.selectedId = id
    },
    $newNote() {
      const created = createNote({ title: 'New note' })
      this.selectedId = created.id
    },
    $onHoverNew(v) {
      this.hoverNew = !!v
      this.btnColor = this.hoverNew ? '${theme.colors.primary}22' : 'transparent'
    },
  },
})
