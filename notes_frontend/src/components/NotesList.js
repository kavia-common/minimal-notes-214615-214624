import Blits from '@lightningjs/blits'
import { theme } from '../theme.js'
import {
  getNotes,
  createNote,
  deleteNote,
  subscribe,
} from '../services/notesService.js'

export default Blits.Component('NotesList', {
  /**
   * @type {['onSelect','selectedId']}
   */
  props: ['onSelect', 'selectedId'],

  components: {},

  template: `
    <Element :w="$w" :h="$h" alpha="1" visible="true">
      <!-- Panel Surface -->
      <Element :w="$w" :h="$h" :color="$surface" :effects="$panelEffects" />

      <!-- Header -->
      <Element x="24" y="16" :w="$headerW" h="64">
        <Text content="Notes" size="36" :color="$textColor" />
        <Element :x="$addBtnX" y="0" w="44" h="44"
                 :effects="$btnEffects"
                 :color="$addBtnColor"
                 @mouseenter="$onAddHover" @mouseleave="$onAddLeave"
                 @enter="$handleNew">
          <Text content="+" size="36" align="center" :mountX="$center" :mountY="$center" x="22" y="22" :color="$primary" />
        </Element>
      </Element>

      <!-- List -->
      <Element x="16" y="88" :w="$listW" :h="$listH">
        <For each="$items" let="item" index="i">
          <Element :y="$itemY(i)" :w="$rowW" h="84"
                   :effects="$rowEffects"
                   :color="$rowColor(item, i)"
                   @enter="$select(item.id)">
            <Element x="16" y="12" :w="$titleW" h="60">
              <Text :content="$itemTitle(item)" size="28" :color="$textColor" :maxwidth="$titleW" />
              <Text :content="$itemUpdated(item)" size="20" y="34" :color="$textMuted" />
            </Element>
            <Element :x="$trashX" y="20" w="44" h="44"
                     :effects="$btnEffects"
                     :color="$trashColor(i)"
                     @mouseenter="$onTrashHover(i)" @mouseleave="$onTrashLeave"
                     @enter="$remove(item.id, i)">
              <Text content="🗑" size="24" align="center" :mountX="$center" :mountY="$center" x="22" y="22" />
            </Element>
          </Element>
        </For>
      </Element>
    </Element>
  `,
  hooks: {
    ready() {
      console.log('[NotesList] Ready', {
        items: (this.items && this.items.length) || 0,
        geom: { x: 0, y: 0, w: this.w, h: this.h },
      })
      // subscribe to note updates
      this.unsub = subscribe((notes) => {
        this.items = notes
        if ((this.selectedId === undefined || this.selectedId === null) && notes[0]) {
          this.$emitSelect(notes[0].id)
        }
      })
    },
    destroy() {
      if (this.unsub) this.unsub()
    },
  },

  state() {
    // Use provided w/h if set by parent, otherwise fall back to defaults
    const w = this.w && Number(this.w) ? Number(this.w) : 320
    const h = this.h && Number(this.h) ? Number(this.h) : 1016
    const headerW = w - 48
    const listW = w - 32
    const listH = h - 104
    const rowW = w - 32
    const titleW = w - 32 - 16 - 16 - 44
    const addBtnX = w - 48 - 44
    const trashX = w - 32 - 44

    // colors/effects
    const surface = theme.colors.surface
    const primary = theme.colors.primary
    const textColor = theme.colors.text
    const textMuted = theme.colors.textMuted
    const error = theme.colors.error
    const center = 0.5

    // Effects replaced with plain objects for compatibility
    const panelEffects = [
      { type: 'radius', radius: theme.effects.radius },
      {
        type: 'shadow',
        x: theme.effects.shadow.x,
        y: theme.effects.shadow.y,
        blur: theme.effects.shadow.blur,
        spread: theme.effects.shadow.spread,
        color: theme.effects.shadow.color,
      },
    ]
    const btnEffects = [{ type: 'radius', radius: theme.effects.radiusSm }]
    const rowEffects = [{ type: 'radius', radius: theme.effects.radiusSm }]

    // transitions as simple object binding
    const scrollTransition = {
      value: 0,
      duration: theme.transition.normal,
      easing: theme.transition.easing,
    }

    // initial incoming selection prop robustness
    const incomingSelected =
      this.selectedId !== undefined && this.selectedId !== null ? this.selectedId : null

    return {
      // geometry
      w,
      h,
      headerW,
      listW,
      listH,
      rowW,
      titleW,
      addBtnX,
      trashX,

      // colors/effects
      surface,
      primary,
      textColor,
      textMuted,
      error,
      center,
      panelEffects,
      btnEffects,
      rowEffects,

      // state
      items: getNotes(),
      selectedId: incomingSelected,
      scrollY: 0,
      hoverIdx: -1,
      addHover: false,
      addBtnColor: 'transparent',
      unsub: null,

      // transitions
      scrollTransition,
    }
  },

  methods: {
    $itemTitle(item) {
      return item && item.title ? item.title : 'Untitled'
    },
    $itemUpdated(item) {
      try {
        return new Date(item.updatedAt).toLocaleString()
      } catch {
        return ''
      }
    },
    $rowColor(item) {
      const a = item && item.id != null ? String(item.id) : ''
      const b = this.selectedId != null ? String(this.selectedId) : ''
      return a === b ? this.primary + '12' : 'transparent'
    },
    $itemY(i) {
      return i * 92 + this.scrollY
    },
    $trashColor(i) {
      return this.hoverIdx === i ? this.error + '22' : 'transparent'
    },
    $onTrashHover(i) {
      this.hoverIdx = i
    },
    $onTrashLeave() {
      this.hoverIdx = -1
    },
    $onAddHover() {
      this.addHover = true
      this.addBtnColor = this.primary + '22'
    },
    $onAddLeave() {
      this.addHover = false
      this.addBtnColor = 'transparent'
    },

    $emitSelect(id) {
      this.selectedId = id
      if (typeof this.onSelect === 'function') {
        this.onSelect(id)
      }
    },
    $select(id) {
      this.$emitSelect(id)
    },
    $handleNew() {
      const created = createNote({ title: 'New note' })
      this.$emitSelect(created.id)
    },
    $remove(id, idx) {
      // basic confirm UI by quickly requiring second Enter within 1s
      if (this.hoverIdx === idx && this._confirmingId === id) {
        deleteNote(id)
        this._confirmingId = null
        // adjust selection
        const remaining = getNotes()
        if (remaining.length) {
          this.$emitSelect(remaining[0].id)
        } else {
          this.$emitSelect(null)
        }
        return
      }
      this._confirmingId = id
      // reset after timeout
      this.$setTimeout(() => {
        if (this._confirmingId === id) this._confirmingId = null
      }, 1200)
    },
  },
})
