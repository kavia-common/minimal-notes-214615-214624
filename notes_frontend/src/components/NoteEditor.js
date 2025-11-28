import Blits from '@lightningjs/blits'
import { theme } from '../theme.js'
import { getNoteById, updateNote, subscribe } from '../services/notesService.js'

export default Blits.Component('NoteEditor', {
  props: ['noteId'],

  template: `
    <Element w="$w" h="$h" alpha="1" visible="true" zIndex="2">
      <!-- Surface -->
      <Element w="$w" h="$h" color="$surface" />

      <!-- Header controls -->
      <Element x="24" y="16" w="$headerW" h="64">
        <Text content="$titleDisplay" size="36" color="$textColor" />
        <Element x="$saveX" y="6" w="120" h="44" color="$saveBtnColor" @enter="$save(true)">
          <Text content="$saveLabel" size="24" align="center" x="60" y="22" color="$primary" />
        </Element>
      </Element>

      <!-- Title area -->
      <Element x="24" y="96" w="$titleW" h="64" color="$bgColor">
        <Text content="$titleDisplay" size="28" x="16" y="18" color="$textColor" />
      </Element>

      <!-- Content area -->
      <Element x="24" y="176" w="$contentW" h="$contentH" color="$bgColor">
        <Text content="$contentDisplay" size="24" x="16" y="16" color="$textColor" lineheight="36" maxwidth="$contentTextW" />
      </Element>
    </Element>
  `,

  state() {
    const note = this.noteId ? getNoteById(this.noteId) : null

    const w = this.w && Number(this.w) ? Number(this.w) : 1600
    const h = this.h && Number(this.h) ? Number(this.h) : 1016

    const headerW = w - 48
    const titleW = w - 48
    const contentW = w - 48
    const contentH = h - 200
    const contentTextW = w - 48 - 32
    const saveX = w - 48 - 120

    const surface = theme.colors.surface
    const bgColor = theme.colors.background
    const primary = theme.colors.primary
    const secondary = theme.colors.secondary
    const textColor = theme.colors.text

    return {
      // geometry
      w, h, headerW, titleW, contentW, contentH, contentTextW, saveX,
      // visuals
      surface, bgColor, primary, secondary, textColor,

      // state
      title: note && note.title ? note.title : '',
      content: note && note.content ? note.content : '',
      saving: false,
      _dirtyTimer: null,
      _unsub: null,
      _lastNoteId: this.noteId !== undefined && this.noteId !== null ? this.noteId : null,

      // computed display strings (no template ternaries)
      titleDisplay: note && note.title ? note.title : 'Untitled',
      contentDisplay: note && note.content ? note.content : 'Start typing…',
      saveBtnColor: primary + '22',
      saveLabel: 'Save',
    }
  },

  hooks: {
    ready() {
      // initialize save button visuals based on saving state
      this.$updateSaveVisuals()
      this._unsub = subscribe(() => {
        if (!this.noteId) {
          this.title = ''
          this.content = ''
          this.titleDisplay = 'Untitled'
          this.contentDisplay = 'Start typing…'
          return
        }
        const n = getNoteById(this.noteId)
        this._lastNoteId = this.noteId
        if (n) {
          this.title = n.title || ''
          this.content = n.content || ''
          this.titleDisplay = this.title.length ? this.title : 'Untitled'
          // keep contentDisplay stable unless empty
          this.contentDisplay = this.content.length ? this.content : 'Start typing…'
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
      this.titleDisplay = this.title.length ? this.title : 'Untitled'
      this.contentDisplay = this.content.length ? this.content : 'Start typing…'
      this._lastNoteId = newId
    },
    title() {
      this.titleDisplay = this.title.length ? this.title : 'Untitled'
      this.$queueAutoSave()
    },
    content() {
      this.contentDisplay = this.content.length ? this.content : 'Start typing…'
      this.$queueAutoSave()
    },
    saving() {
      this.$updateSaveVisuals()
    },
  },

  methods: {
    $updateSaveVisuals() {
      this.saveLabel = this.saving ? 'Saving…' : 'Save'
      this.saveBtnColor = (this.saving ? this.secondary : this.primary) + '22'
    },
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
      updateNote(this.noteId, { title: this.title, content: this.content })
      this.$setTimeout(() => {
        this.saving = false
      }, explicit ? 200 : 50)
    },
  },

  input: {
    up() {
      this.title = this.title && this.title.endsWith(' ■') ? this.title : this.title + ' ■'
    },
    down() {
      this.title = this.title ? this.title.replace(/ ■$/, '') : ''
    },
    left() {
      this.content = (this.content || '') + ' •'
    },
    right() {
      if (this.content && this.content.endsWith(' •')) this.content = this.content.slice(0, -2)
    },
    enter() {
      this.$save(true)
    },
  },
})
