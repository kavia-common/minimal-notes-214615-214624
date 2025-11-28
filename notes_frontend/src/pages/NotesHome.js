import Blits from '@lightningjs/blits'
import { theme } from '../theme.js'
import NotesList from '../components/NotesList.js'
import NoteEditor from '../components/NoteEditor.js'
import { getNotes, createNote } from '../services/notesService.js'

export default Blits.Component('NotesHome', {
  components: { NotesList, NoteEditor },

  template: `
    <Element w="1920" h="1016" color="$appBg" alpha="1" visible="true" zIndex="0">
      <!-- Fixed Header bar (zIndex above content but separate in App) -->
      <Element x="0" y="-64" w="1920" h="$headerH" color="$surface" alpha="0" visible="false" zIndex="6"></Element>

      <!-- Guaranteed visible test block to confirm child region renders -->
      <Element x="8" y="8" w="8" h="8" color="#10B981" alpha="1" visible="true" zIndex="1"></Element>

      <!-- LEFT: Notes List -->
      <Element x="0" y="0" w="320" h="$contentH" color="$leftBg" alpha="1" visible="true" zIndex="2">
        <NotesList selectedId="$selectedId" onSelect="onSelect" w="320" h="$contentH" />
      </Element>

      <!-- RIGHT: Note Editor -->
      <Element x="320" y="0" w="$rightW" h="$contentH" color="$rightBg" alpha="1" visible="true" zIndex="2">
        <NoteEditor noteId="$selectedId" w="$rightW" h="$contentH" />
      </Element>
    </Element>
  `,

  state() {
    // Seed data and set initial selection
    const initial = getNotes()
    let selected = null
    if (initial && initial.length && initial[0] && initial[0].id) {
      selected = initial[0].id
    } else {
      const created = createNote({ title: 'Welcome Note' })
      selected = created.id
    }

    // Static layout values to avoid any inline arithmetic
    const fullW = 1920
    const headerH = 64
    const contentH = 1016
    const rightX = 320
    const rightW = fullW - rightX
    const newBtnX = fullW - 24 - 120

    // Colors
    const appBg = theme.colors.background
    const surface = theme.colors.surface
    const textColor = theme.colors.text
    const textMuted = theme.colors.textMuted
    const primary = theme.colors.primary

    // Panel colors
    const leftBg = surface
    const rightBg = surface

    console.log('[NotesHome] init', {
      notesCount: initial ? initial.length : 0,
      selected,
      contentH,
      rightW,
    })

    return {
      // visuals
      appBg,
      surface,
      textColor,
      textMuted,
      primary,
      leftBg,
      rightBg,

      // labels
      apiLabel: 'API: in-memory',

      // selection
      selectedId: selected,

      // layout
      headerH,
      contentH,
      rightX,
      rightW,
      newBtnX,

      // interactive
      btnColor: 'transparent',
    }
  },

  hooks: {
    ready() {
      console.log('[NotesHome] Ready: child panes targeted geometry', {
        selectedId: this.selectedId,
        geom: {
          list: { x: 0, y: 0, w: 320, h: this.contentH },
          editor: { x: 320, y: 0, w: this.rightW, h: this.contentH },
        },
      })
    },
  },

  methods: {
    onSelect(id) {
      this.selectedId = id
    },
    newNote() {
      const created = createNote({ title: 'New note' })
      this.selectedId = created.id
    },
    enterHover() {
      this.btnColor = theme.colors.primary + '22'
    },
    leaveHover() {
      this.btnColor = 'transparent'
    },
  },
})
