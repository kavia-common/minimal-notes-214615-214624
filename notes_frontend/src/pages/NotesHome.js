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
    <Element w="1920" h="1080" color="$appBg" alpha="1" visible="true" zIndex="0">
      <!-- Fixed Header bar (kept behind content to avoid coverage) -->
      <Element x="0" y="0" w="1920" h="$headerH" :color="$surface" :effects="$headerEffects" alpha="1" visible="true" zIndex="3">
        <Element x="0" y="0" w="1920" :h="$headerH" color="$headerDebugBg" alpha="1" />
        <Text content="Minimal Notes" x="24" y="16" size="32" :color="$textColor" />
        <Text content="$apiLabel" x="24" y="48" size="18" :color="$textMuted" />
        <Element x="$newBtnX" y="12" w="120" h="40" :effects="$btnEffects" :color="$btnColor" @mouseenter="enterHover" @mouseleave="leaveHover" @enter="newNote">
          <Text content="+ New" size="22" align="center" x="60" y="20" :color="$primary" />
        </Element>
      </Element>

      <!-- LEFT: Notes List -->
      <Element x="0" y="64" w="320" h="$contentH" :color="$leftBg" alpha="1" visible="true" zIndex="6">
        <Element x="0" y="0" w="320" :h="$contentH" color="$leftDebugBg" alpha="1" />
        <NotesList selectedId="$selectedId" onSelect="onSelect" w="320" h="$contentH" />
      </Element>

      <!-- RIGHT: Note Editor -->
      <Element x="320" y="64" w="$rightW" h="$contentH" :color="$rightBg" alpha="1" visible="true" zIndex="6">
        <Element x="0" y="0" :w="$rightW" :h="$contentH" color="$rightDebugBg" alpha="1" />
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

    // Labels
    const apiLabel = 'API: in-memory'

    // Layout: explicit static sizes to avoid runtime arithmetic in template
    const fullW = 1920
    const fullH = 1080
    const headerH = 64 // content starts at y=64
    const contentY = 64
    const contentH = fullH - contentY
    const rightX = 320
    const rightW = fullW - rightX
    const newBtnX = fullW - 24 - 120

    // Visuals
    const appBg = theme.colors.background
    const surface = theme.colors.surface
    const textColor = theme.colors.text
    const textMuted = theme.colors.textMuted
    const primary = theme.colors.primary

    // temp debug backgrounds to verify panes are visible
    const headerDebugBg = '#dde7ff'
    const leftDebugBg = '#c7d2fe'
    const rightDebugBg = '#bbf7d0'

    const leftBg = surface
    const rightBg = surface

    // Effects as plain object arrays
    const headerEffects = [
      { type: 'radius', radius: theme.effects.radiusLg },
      {
        type: 'shadow',
        x: theme.effects.shadowSm.x,
        y: theme.effects.shadowSm.y,
        blur: theme.effects.shadowSm.blur,
        spread: theme.effects.shadowSm.spread,
        color: theme.effects.shadowSm.color,
      },
    ]
    const btnEffects = [{ type: 'radius', radius: theme.effects.radiusSm }]

    console.log('[NotesHome] init', {
      notesCount: initial ? initial.length : 0,
      selected,
      sizes: { contentH, rightW },
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
      headerDebugBg,
      leftDebugBg,
      rightDebugBg,

      // labels
      apiLabel,

      // selection
      selectedId: selected,

      // layout
      headerH,
      contentY,
      contentH,
      rightX,
      rightW,
      newBtnX,

      // effects
      headerEffects,
      btnEffects,

      // interactive
      btnColor: 'transparent',
    }
  },

  hooks: {
    ready() {
      console.log('[NotesHome] Ready: mounted and panes should be visible', {
        selectedId: this.selectedId,
        geom: {
          list: { x: 0, y: 64, w: 320, h: this.contentH },
          editor: { x: 320, y: 64, w: this.rightW, h: this.contentH },
        },
        z: { header: 3, panes: 6 },
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
