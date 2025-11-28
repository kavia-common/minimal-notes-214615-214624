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
    <Element :w="$w" :h="$h">
      <!-- Panel Surface -->
      <Element
        :w="$w"
        :h="$h"
        :color="theme.colors.surface"
        :effects="[$shader('radius', { radius: theme.effects.radius }), $shadow(theme.effects.shadow)]"
      />

      <!-- Header -->
      <Element x="24" y="16" :w="$w - 48" h="64">
        <Text content="Notes" size="36" color="${theme.colors.text}" />
        <Element x="$w - 48 - 44" y="0" w="44" h="44"
                 :effects="[$shader('radius', { radius: theme.effects.radiusSm })]"
                 :color="$hoverNew ? '${theme.colors.primary}22' : 'transparent'"
                 @mouseenter="$hoverNew = true" @mouseleave="$hoverNew = false"
                 @enter="$handleNew()">
          <Text content="+" size="36" align="center" mount="{x:0.5,y:0.5}" x="22" y="22" color="${theme.colors.primary}" />
        </Element>
      </Element>

      <!-- List -->
      <Element x="16" y="88" :w="$w - 32" :h="$h - 104">
        <Element :y.transition="{ value: $scrollY, duration: ${theme.transition.normal}, easing: '${theme.transition.easing}' }" />
        <For each="$items" let="item" index="i">
          <Element :y="i * 92 + $scrollY" :w="$w - 32" h="84"
                   :effects="[$shader('radius', { radius: theme.effects.radiusSm })]"
                   :color="item.id === $selectedId ? '${theme.colors.primary}12' : 'transparent'"
                   @enter="$select(item.id)">
            <Element x="16" y="12" :w="$w - 32 - 16 - 16 - 44" h="60">
              <Text :content="item.title || 'Untitled'" size="28" color="${theme.colors.text}" maxwidth="$w - 32 - 16 - 16 - 44" />
              <Text :content="new Date(item.updatedAt).toLocaleString()" size="20" y="34" color="${theme.colors.textMuted}" />
            </Element>
            <Element :x="$w - 32 - 44" y="20" w="44" h="44"
                     :effects="[$shader('radius', { radius: theme.effects.radiusSm })]"
                     :color="$hoverIdx === i ? '${theme.colors.error}22' : 'transparent'"
                     @mouseenter="$hoverIdx = i" @mouseleave="$hoverIdx = -1"
                     @enter="$remove(item.id, i)">
              <Text content="🗑" size="24" align="center" mount="{x:0.5,y:0.5}" x="22" y="22" />
            </Element>
          </Element>
        </For>
      </Element>
    </Element>
  `,

  state() {
    return {
      theme,
      items: getNotes(),
      selectedId: this.selectedId ?? null,
      scrollY: 0,
      hoverIdx: -1,
      hoverNew: false,
      w: 560,
      h: 984,
      unsub: null,
    }
  },

  hooks: {
    ready() {
      // subscribe to note updates
      this.unsub = subscribe((notes) => {
        this.items = notes
        if (!this.selectedId && notes[0]) {
          this.$emitSelect(notes[0].id)
        }
      })
    },
    destroy() {
      if (this.unsub) this.unsub()
    },
  },

  methods: {
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
