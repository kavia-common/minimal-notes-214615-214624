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
    <Element w="1920" h="1080" color="$appBg">
      <Element w="1920" h="1080" :color="$appOverlay" />

      <Element :x="$pad" :y="$pad" :w="$contentW" :h="$headerH"
               :effects="$headerEffects"
               :color="$surface">
        <Text content="Minimal Notes" :x="$pad" y="24" size="40" :color="$textColor" />
        <Text :content="$apiLabel" :x="$pad" y="64" size="20" :color="$textMuted" />
        <Element :x="$newBtnX" y="20" w="120" h="48"
                 :effects="$btnEffects"
                 :color="$btnColor"
                 @mouseenter="enterHover" @mouseleave="leaveHover"
                 @enter="newNote">
          <Text content="+ New" size="26" align="center" x="60" y="24" :color="$primary" />
        </Element>
      </Element>

      <Element :x="$pad" :y="$contentY" :w="$contentW" :h="$contentH">
        <Element :w="$sidebarW" :h="$contentH">
          <NotesList :selectedId="$selectedId" :onSelect="onSelect" :w="$sidebarW" :h="$contentH" />
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

    // layout numbers precomputed
    const pad = 24
    const fullW = 1920
    const fullH = 1080
    const headerH = theme.layout.headerHeight
    const sidebarW = theme.layout.sidebarWidth
    const gap = theme.layout.gap

    const contentW = fullW - pad * 2
    const contentY = pad + headerH + gap
    const contentH = fullH - (contentY + pad)
    const rightX = sidebarW + gap
    const rightW = contentW - (sidebarW + gap)
    const newBtnX = contentW - 140

    // colors/effects precomputed (no inline objects/functions in template)
    const appBg = theme.colors.background
    const appOverlay = theme.colors.overlay
    const surface = theme.colors.surface
    const textColor = theme.colors.text
    const textMuted = theme.colors.textMuted
    const primary = theme.colors.primary

    // Effects: use plain objects (no special helpers) to satisfy precompiler/linting
    // Build effect objects explicitly to avoid spread syntax issues in precompiler
    const headerEffects = [
      { type: 'radius', radius: theme.effects.radiusLg },
      { type: 'shadow',
        x: theme.effects.shadowSm.x,
        y: theme.effects.shadowSm.y,
        blur: theme.effects.shadowSm.blur,
        spread: theme.effects.shadowSm.spread,
        color: theme.effects.shadowSm.color,
      },
    ]
    const btnEffects = [
      { type: 'radius', radius: theme.effects.radiusSm },
    ]

    return {
      // theme parts used in simple bindings
      appBg,
      appOverlay,
      surface,
      textColor,
      textMuted,
      primary,

      // ids and labels
      selectedId: selected,
      apiLabel: label,

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

      // effects and interactive color
      headerEffects,
      btnEffects,
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
      // avoid inline ternary; assign precomputed string
      this.btnColor = theme.colors.primary + '22'
    },
    leaveHover() {
      this.btnColor = 'transparent'
    },
  },
})
