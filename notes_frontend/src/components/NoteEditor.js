import Blits from '@lightningjs/blits'
import { theme } from '../theme.js'
import { getNoteById, updateNote, subscribe } from '../services/notesService.js'

export default Blits.Component('NoteEditor', {
  /**
   * @type {['noteId']}
   */
  props: ['noteId'],

  template: `
    <Element :w="$w" :h="$h">
      <!-- Surface -->
      <Element
        :w="$w"
        :h="$h"
        :color="theme.colors.surface"
        :effects="[$shader('radius', { radius: theme.effects.radius }), $shadow(theme.effects.shadow)]"
      />

      <!-- Header controls -->
      <Element x="24" y="16" :w="$w - 48" h="64">
        <Text :content="$title || 'Untitled'" size="36" color="${theme.colors.text}" />
        <Element x="$w - 48 - 120" y="6" w="120" h="44"
                 :effects="[$shader('radius', { radius: theme.effects.radiusSm })]"
                 :color="$saving ? '${theme.colors.secondary}22' : '${theme.colors.primary}22'"
                 @enter="$save(true)">
          <Text :content="$saving ? 'Saving…' : 'Save'" size="24" align="center" mount="{x:0.5,y:0.5}" x="60" y="22" color="${theme.colors.primary}" />
        </Element>
      </Element>

      <!-- Title input -->
      <Element x="24" y="96" :w="$w - 48" h="64" :color="'${theme.colors.background}'" :effects="[$shader('radius', { radius: theme.effects.radiusSm })]">
        <Text :content="$title || 'Untitled'" size="28" x="16" y="18" color="${theme.colors.text}" />
      </Element>

      <!-- Content area -->
      <Element x="24" y="176" :w="$w - 48" :h="$h - 200" :color="'${theme.colors.background}'" :effects="[$shader('radius', { radius: theme.effects.radiusSm })]">
        <Text :content="$content || 'Start typing…'" size="24" x="16" y="16" color="${theme.colors.text}" lineheight="36" maxwidth="$w - 48 - 32" />
      </Element>
    </Element>
  `,

  state() {
    const note = this.noteId ? getNoteById(this.noteId) : null
    return {
      theme,
      w: 1920 - (560 + theme.layout.gap * 3),
      h: 984,
      title: note?.title ?? '',
      content: note?.content ?? '',
      saving: false,
      _dirtyTimer: null,
      _unsub: null,
      _lastNoteId: this.noteId ?? null,
    }
  },

  hooks: {
    ready() {
      // listen to store changes to reflect external updates/selection
      this._unsub = subscribe(() => {
        if (!this.noteId) {
          this.title = ''
          this.content = ''
          return
        }
        if (this._lastNoteId !== this.noteId) {
          // note changed, reload it
          const n = getNoteById(this.noteId)
          this._lastNoteId = this.noteId
          this.title = n?.title ?? ''
          this.content = n?.content ?? ''
        } else {
          // same note, keep typing state
          const n = getNoteById(this.noteId)
          this.title = n?.title ?? this.title
          // content keep as is if user typing; store is authoritative after save
        }
      })
    },
    destroy() {
      if (this._unsub) this._unsub()
    },
  },

  watchers: {
    noteId(newId) {
      const n = newId ? getNoteById(newId) : null
      this.title = n?.title ?? ''
      this.content = n?.content ?? ''
      this._lastNoteId = newId
    },
    title() {
      this.$queueAutoSave()
    },
    content() {
      this.$queueAutoSave()
    },
  },

  methods: {
    $queueAutoSave() {
      if (!this.noteId) return
      if (this._dirtyTimer) this.$clearTimeout(this._dirtyTimer)
      this._dirtyTimer = this.$setTimeout(() => {
        this.$save(false)
      }, 600)
    },
    $save(explicit) {
      if (!this.noteId) return
      this.saving = true
      updateNote(this.noteId, {
        title: this.title,
        content: this.content,
      })
      // simulate delay
      this.$setTimeout(() => {
        this.saving = false
      }, explicit ? 200 : 50)
    },
  },

  input: {
    // Simple editing using arrow keys to modify content/title
    // In a real app, you'd integrate a proper text input behavior.
    up() {
      // focus title semantics: prepend marker to indicate edit
      this.title = this.title.endsWith(' ▮') ? this.title : `${this.title} ▮`
    },
    down() {
      this.title = this.title.replace(/ ▮$/, '')
    },
    left() {
      this.content = `${this.content} •`
    },
    right() {
      if (this.content.endsWith(' •')) this.content = this.content.slice(0, -2)
    },
    // Enter to save explicitly
    enter() {
      this.$save(true)
    },
  },
})
