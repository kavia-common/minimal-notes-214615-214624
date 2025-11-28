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
    <Element w="1920" h="1080" color="$appBg" alpha="1" visible="true">
      <!-- Header label to verify page mount -->
      <Text content="NotesHome" x="24" y="8" size="18" color="#6B7280" />

      <!-- Header bar -->
      <Element x="$pad" y="$pad" w="$contentW" h="$headerH" :color="$surface" :effects="$headerEffects" alpha="1" visible="true" zIndex="5">
        <Element x="0" y="0" :w="$contentW" :h="$headerH" color="#93c5fd" alpha="0.25" />
        <Text content="Minimal Notes" x="$pad" y="24" size="40" :color="$textColor" />
        <Text content="$apiLabel" x="$pad" y="64" size="20" :color="$textMuted" />
        <Element x="$newBtnX" y="20" w="120" h="48" :effects="$btnEffects" :color="$btnColor" @mouseenter="enterHover" @mouseleave="leaveHover" @enter="newNote">
          <Text content="+ New" size="26" align="center" x="60" y="24" :color="$primary" />
        </Element>
      </Element>

      <!-- Two-pane Content Area -->
      <Element x="$pad" y="$contentY" w="$contentW" h="$contentH" alpha="1" visible="true" zIndex="1">
        <!-- LEFT: Notes List (fixed ~320-560 width), with debug background/border -->
        <Element x="0" y="0" w="$sidebarW" h="$contentH" :color="$leftBg" alpha="1" visible="true">
          <Element x="0" y="0" :w="$sidebarW" :h="$contentH" color="#1d4ed8" alpha="0.06" />
          <NotesList selectedId="$selectedId" onSelect="onSelect" w="$sidebarW" h="$contentH" />
        </Element>

        <!-- RIGHT: Editor fills remaining width -->
        <Element x="$rightX" y="0" w="$rightW" h="$contentH" :color="$rightBg" alpha="1" visible="true" zIndex="2">
          <Element x="0" y="0" :w="$rightW" :h="$contentH" color="#065f46" alpha="0.06" />
          <NoteEditor noteId="$selectedId" w="$rightW" h="$contentH" />
        </Element>
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
    const pad = 24
    const fullW = 1920
    const fullH = 1080
    const headerH = theme.layout.headerHeight
    // Ensure left pane around ~320px minimum; use theme default if larger
    const sidebarW = Math.max(320, theme.layout.sidebarWidth)
    const gap = theme.layout.gap

    const contentW = fullW - (pad * 2)
    const contentY = pad + headerH + gap
    const contentH = fullH - contentY - pad
    const rightX = sidebarW + gap
    const rightW = contentW - sidebarW - gap
    const newBtnX = contentW - 140

    // Visuals
    const appBg = theme.colors.background
    const surface = theme.colors.surface
    const textColor = theme.colors.text
    const textMuted = theme.colors.textMuted
    const primary = theme.colors.primary
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
      apiLabel,

      // selection
      selectedId: selected,

      // layout
      pad,
      headerH,
      sidebarW,
      contentW,
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
