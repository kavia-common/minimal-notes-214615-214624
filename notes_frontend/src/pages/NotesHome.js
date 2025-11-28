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
      <!-- simple static overlay color binding -->
      <Element w="1920" h="1080" :color="$appOverlay" alpha="0.0" />

      <!-- Visible header ensures UI is never blank -->
      <Text content="NotesHome" x="24" y="8" size="18" color="#6B7280" />

      <!-- Header bar -->
      <Element x="$pad" y="$pad" w="$contentW" h="$headerH" :color="$surface" :effects="$headerEffects" alpha="1" visible="true" zIndex="5">
        <!-- temporary border via inner outline element -->
        <Element x="0" y="0" :w="$contentW" :h="$headerH" color="#93c5fd" alpha="0.25" />
        <Text content="Minimal Notes" x="$pad" y="24" size="40" :color="$textColor" />
        <Text content="$apiLabel" x="$pad" y="64" size="20" :color="$textMuted" />
        <Element x="$newBtnX" y="20" w="120" h="48" :effects="$btnEffects" :color="$btnColor" @mouseenter="enterHover" @mouseleave="leaveHover" @enter="newNote">
          <Text content="+ New" size="26" align="center" x="60" y="24" :color="$primary" />
        </Element>
      </Element>

      <!-- Content area -->
      <Element x="$pad" y="$contentY" w="$contentW" h="$contentH" alpha="1" visible="true" zIndex="1">
        <!-- Sidebar with explicit x/y and solid bg/border for debug -->
        <Element x="0" y="0" w="$sidebarW" h="$contentH" :color="$surface" alpha="1" visible="true">
          <Element x="0" y="0" :w="$sidebarW" :h="$contentH" color="#3b82f6" alpha="0.08" />
          <NotesList selectedId="$selectedId" onSelect="onSelect" w="$sidebarW" h="$contentH" />
        </Element>

        <!-- Editor with explicit x positioning and debug bg -->
        <Element x="$rightX" y="0" w="$rightW" h="$contentH" :color="$surface" alpha="1" visible="true" zIndex="2">
          <Element x="0" y="0" :w="$rightW" :h="$contentH" color="#10b981" alpha="0.08" />
          <NoteEditor noteId="$selectedId" w="$rightW" h="$contentH" />
        </Element>
      </Element>
    </Element>
  `,

  state() {
    // Seed and select
    const initial = getNotes()
    let selected = null
    if (initial && initial.length && initial[0].id) {
      selected = initial[0].id
    } else {
      const created = createNote({ title: 'New note' })
      selected = created.id
    }

    // labels
    const apiLabel = 'API: in-memory'

    // layout numbers precomputed (avoid arithmetic in template)
    const pad = 24
    const fullW = 1920
    const fullH = 1080
    const headerH = theme.layout.headerHeight
    const sidebarW = theme.layout.sidebarWidth
    const gap = theme.layout.gap

    const contentW = fullW - pad - pad
    const contentY = pad + headerH + gap
    const contentH = fullH - contentY - pad
    const rightX = sidebarW + gap
    const rightW = contentW - sidebarW - gap
    const newBtnX = contentW - 140

    // colors/effects precomputed
    const appBg = theme.colors.background
    const appOverlay = theme.colors.overlay
    const surface = theme.colors.surface
    const textColor = theme.colors.text
    const textMuted = theme.colors.textMuted
    const primary = theme.colors.primary

    // effects as plain objects/arrays to satisfy precompiler
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
      appOverlay,
      surface,
      textColor,
      textMuted,
      primary,

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

  // keep minimal logic
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
