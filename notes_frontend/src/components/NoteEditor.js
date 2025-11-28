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
        :color="$surface"
        :effects="$panelEffects"
      />

      <!-- Header controls -->
      <Element x="24" y="16" :w="$headerW" h="64">
        <Text :content="$titleText" size="36" :color="$textColor" />
        <Element :x="$saveX" y="6" w="120" h="44"
                 :effects="$btnEffects"
                 :color="$saveColor"
                 @enter="$save(true)">
          <Text :content="$saveLabel" size="24" align="center" :mountX="$center" :mountY="$center" x="60" y="22" :color="$primary" />
        </Element>
      </Element>

      <!-- Title input -->
      <Element x="24" y="96" :w="$titleW" h="64" :color="$bgColor" :effects="$inputEffects">
        <Text :content="$titleText" size="28" x="16" y="18" :color="$textColor" />
      </Element>

      <!-- Content area -->
      <Element x="24" y="176" :w="$contentW" :h="$contentH" :color="$bgColor" :effects="$inputEffects">
        <Text :content="$contentText" size="24" x="16" y="16" :color="$textColor" lineheight="36" :maxwidth="$contentTextW" />
      </Element>
    </Element>
  `,

  state() {
    const note = this.noteId ? getNoteById(this.noteId) : null

    // dimensions
    const appW = 1920
    const gap = theme.layout.gap
    const sidebar = 560
    const outerPad = gap * 3
    const w = appW - (sidebar + outerPad)
    const h = 984

    const headerW = w - 48
    const titleW = w - 48
    const contentW = w - 48
    const contentH = h - 200
    const contentTextW = w - 48 - 32
    const saveX = w - 48 - 120

    // colors/effects
    const surface = theme.colors.surface
    const bgColor = theme.colors.background
    const primary = theme.colors.primary
    const secondary = theme.colors.secondary
    const textColor = theme.colors.text
    const center = 0.5

    // Effects: replace special helpers with plain objects for precompiler/lint compatibility
    const panelEffects = [
      { type: 'radius', radius: theme.effects.radius },
      { type: 'shadow',
        x: theme.effects.shadow.x,
        y: theme.effects.shadow.y,
        blur: theme.effects.shadow.blur,
        spread: theme.effects.shadow.spread,
        color: theme.effects.shadow.color,
      },
    ]
    const btnEffects = [
      { type: 'radius', radius: theme.effects.radiusSm },
    ]
    const inputEffects = [
      { type: 'radius', radius: theme.effects.radiusSm },
    ]

    return {
      // geometry
      w,
      h,
      headerW,
      titleW,
      contentW,
      contentH,
      contentTextW,
      saveX,

      // visual
      surface,
      bgColor,
      primary,
      secondary,
      textColor,
      center,
      panelEffects,
      btnEffects,
      inputEffects,

      // state
      title: note && note.title ? note.title : '',
      content: note && note.content ? note.content : '',
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
          this.title = n && n.title ? n.title : ''
          this.content = n && n.content ? n.content : ''
        } else {
          // same note, keep typing state
          const n = getNoteById(this.noteId)
          this.title = (n && n.title) ? n.title : this.title
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
      this.title = n && n.title ? n.title : ''
      this.content = n && n.content ? n.content : ''
      this._lastNoteId = newId
    },
    title() {
      this.$queueAutoSave()
    },
    content() {
      this.$queueAutoSave()
    },
  },

  computed: {
    $titleText() {
      return this.title && this.title.length ? this.title : 'Untitled'
    },
    $contentText() {
      return this.content && this.content.length ? this.content : 'Start typing…'
    },
    $saveLabel() {
      return this.saving ? 'Saving…' : 'Save'
    },
    $saveColor() {
      return this.saving ? this.secondary + '22' : this.primary + '22'
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
      this.title = this.title && this.title.endsWith(' ▮') ? this.title : (this.title + ' ▮')
    },
    down() {
      this.title = this.title ? this.title.replace(/ ▮$/, '') : ''
    },
    left() {
      this.content = (this.content || '') + ' •'
    },
    right() {
      if (this.content && this.content.endsWith(' •')) this.content = this.content.slice(0, -2)
    },
    // Enter to save explicitly
    enter() {
      this.$save(true)
    },
  },
})
