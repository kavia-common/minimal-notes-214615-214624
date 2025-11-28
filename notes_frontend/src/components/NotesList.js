import Blits from '@lightningjs/blits'
import { theme } from '../theme.js'
import { getNotes, createNote, deleteNote, subscribe } from '../services/notesService.js'

export default Blits.Component('NotesList', {
  props: ['onSelect', 'selectedId'],

  template: `
    <Element w="$w" h="$h" alpha="1" visible="true" zIndex="2">
      <!-- Panel Surface -->
      <Element w="$w" h="$h" color="$surface" />

      <!-- Header -->
      <Element x="24" y="16" w="$headerW" h="64">
        <Text content="Notes" size="36" color="$textColor" />
        <Element x="$addBtnX" y="0" w="44" h="44"
                 color="$addBtnColor"
                 @mouseenter="$onAddHover" @mouseleave="$onAddLeave"
                 @enter="$handleNew">
          <Text content="+" size="36" align="center" x="22" y="22" />
        </Element>
      </Element>

      <!-- List -->
      <Element x="16" y="88" w="$listW" h="$listH">
        <For each="$items" let="item" index="i">
          <Element y="$rowYs[i]" w="$rowW" h="84"
                   color="$rowColors[i]"
                   @enter="$select(item.id)">
            <Element x="16" y="12" w="$titleW" h="60">
              <Text content="$titles[i]" size="28" color="$textColor" maxwidth="$titleW" />
              <Text content="$updateds[i]" size="20" y="34" color="$textMuted" />
            </Element>
            <Element x="$trashX" y="20" w="44" h="44"
                     color="$trashColors[i]"
                     @mouseenter="$onTrashHover(i)" @mouseleave="$onTrashLeave"
                     @enter="$remove(item.id, i)">
              <Text content="🗑" size="24" align="center" x="22" y="22" />
            </Element>
          </Element>
        </For>
      </Element>
    </Element>
  `,

  state() {
    const w = this.w && Number(this.w) ? Number(this.w) : 320
    const h = this.h && Number(this.h) ? Number(this.h) : 1016
    const headerW = w - 48
    const listW = w - 32
    const listH = h - 104
    const rowW = w - 32
    const titleW = w - 32 - 16 - 16 - 44
    const addBtnX = w - 48 - 44
    const trashX = w - 32 - 44

    const surface = theme.colors.surface
    const primary = theme.colors.primary
    const textColor = theme.colors.text
    const textMuted = theme.colors.textMuted
    const error = theme.colors.error

    const items = getNotes()
    const selected = this.selectedId !== undefined && this.selectedId !== null ? String(this.selectedId) : ''

    // Precompute arrays to avoid inline functions/ternaries in template
    const titles = items.map(n => (n && n.title ? n.title : 'Untitled'))
    const updateds = items.map(n => {
      try { return new Date(n.updatedAt).toLocaleString() } catch { return '' }
    })
    const rowYs = items.map((_, i) => i * 92)
    const rowColors = items.map(n => (String(n.id) === selected ? primary + '12' : 'transparent'))
    const trashColors = items.map((_, i) => (this.hoverIdx === i ? error + '22' : 'transparent'))

    return {
      // geometry
      w, h, headerW, listW, listH, rowW, titleW, addBtnX, trashX,
      // visuals
      surface, primary, textColor, textMuted, error,

      // state
      items,
      selectedId: this.selectedId !== undefined && this.selectedId !== null ? this.selectedId : null,
      hoverIdx: -1,
      addBtnColor: 'transparent',

      // precomputed
      titles, updateds, rowYs, rowColors, trashColors,
    }
  },

  hooks: {
    ready() {
      this.unsub = subscribe((notes) => {
        this.items = notes
        // recompute display caches whenever items change
        const selected = this.selectedId !== undefined && this.selectedId !== null ? String(this.selectedId) : ''
        this.titles = notes.map(n => (n && n.title ? n.title : 'Untitled'))
        this.updateds = notes.map(n => { try { return new Date(n.updatedAt).toLocaleString() } catch { return '' } })
        this.rowYs = notes.map((_, i) => i * 92)
        this.rowColors = notes.map(n => (String(n.id) === selected ? this.primary + '12' : 'transparent'))
        this.trashColors = notes.map((_, i) => (this.hoverIdx === i ? this.error + '22' : 'transparent'))

        if ((this.selectedId === undefined || this.selectedId === null) && notes[0]) {
          this.$emitSelect(notes[0].id)
        }
      })
    },
    destroy() {
      if (this.unsub) this.unsub()
    },
  },

  methods: {
    $onTrashHover(i) {
      this.hoverIdx = i
      // update trashColors to reflect hover
      this.trashColors = this.items.map((_, idx) => (idx === i ? this.error + '22' : 'transparent'))
    },
    $onTrashLeave() {
      this.hoverIdx = -1
      this.trashColors = this.items.map(() => 'transparent')
    },
    $onAddHover() {
      this.addBtnColor = this.primary + '22'
    },
    $onAddLeave() {
      this.addBtnColor = 'transparent'
    },

    $emitSelect(id) {
      this.selectedId = id
      if (typeof this.onSelect === 'function') {
        this.onSelect(id)
      }
      // Update rowColors based on new selection
      const selected = this.selectedId !== undefined && this.selectedId !== null ? String(this.selectedId) : ''
      this.rowColors = this.items.map(n => (String(n.id) === selected ? this.primary + '12' : 'transparent'))
    },
    $select(id) {
      this.$emitSelect(id)
    },
    $handleNew() {
      const created = createNote({ title: 'New note' })
      this.$emitSelect(created.id)
    },
    $remove(id, idx) {
      if (this.hoverIdx === idx && this._confirmingId === id) {
        deleteNote(id)
        this._confirmingId = null
        const remaining = getNotes()
        this.items = remaining
        // recompute caches
        this.titles = remaining.map(n => (n && n.title ? n.title : 'Untitled'))
        this.updateds = remaining.map(n => { try { return new Date(n.updatedAt).toLocaleString() } catch { return '' } })
        this.rowYs = remaining.map((_, i) => i * 92)
        const selected = this.selectedId !== undefined && this.selectedId !== null ? String(this.selectedId) : ''
        this.rowColors = remaining.map(n => (String(n.id) === selected ? this.primary + '12' : 'transparent'))
        this.trashColors = remaining.map(() => 'transparent')

        if (remaining.length) {
          this.$emitSelect(remaining[0].id)
        } else {
          this.$emitSelect(null)
        }
        return
      }
      this._confirmingId = id
      this.$setTimeout(() => {
        if (this._confirmingId === id) this._confirmingId = null
      }, 1200)
    },
  },
})
