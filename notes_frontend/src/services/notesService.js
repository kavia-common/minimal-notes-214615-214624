const API_BASE = (typeof window !== 'undefined' && window.__VITE_API_BASE__) ? window.__VITE_API_BASE__ : ''

// Basic safe UUID fallback
function makeId() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch {
    // ignore and fall back to timestamp-based id
  }
  return String(Date.now())
}

let _notes = [
  {
    id: makeId(),
    title: 'Welcome to Ocean Notes',
    content:
      'This is your first note. Select it to edit. Use the + New button to create more notes. Delete with the trash button.',
    updatedAt: Date.now(),
  },
  {
    id: makeId(),
    title: 'Editing Tips',
    content:
      'Use Arrow keys to simulate edits in this demo: Up/Down toggles title marker, Left/Right add/remove bullets, Enter saves.',
    updatedAt: Date.now() - 1000,
  },
]

/**
 * Simple event system so UI can subscribe to changes in the in-memory store
 */
const subscribers = new Set()

function notify() {
  subscribers.forEach((cb) => {
    try {
      cb(getNotes())
    } catch {
      // noop
    }
  })
}

/**
 * PUBLIC_INTERFACE
 */
export function subscribe(callback) {
  /** Subscribe to notes updates. Returns an unsubscribe function. */
  subscribers.add(callback)
  // Immediately emit current state
  callback(getNotes())
  return () => subscribers.delete(callback)
}

/**
 * PUBLIC_INTERFACE
 */
export function getNotes() {
  /** Return a shallow-copied, sorted list (desc by updatedAt) */
  const arr = _notes.slice()
  arr.sort((a, b) => b.updatedAt - a.updatedAt)
  return arr
}

/**
 * PUBLIC_INTERFACE
 */
export function getNoteById(id) {
  /** Get a single note by id (cloned) */
  const found = _notes.find((n) => n.id === id)
  if (!found) return null
  return {
    id: found.id,
    title: found.title,
    content: found.content,
    updatedAt: found.updatedAt,
  }
}

/**
 * PUBLIC_INTERFACE
 */
export function createNote(partial = {}) {
  /** Create a new note and return it */
  const now = Date.now()
  const id = makeId()
  const title = (partial && typeof partial.title === 'string') ? partial.title : 'Untitled'
  const content = (partial && typeof partial.content === 'string') ? partial.content : ''
  const note = { id, title, content, updatedAt: now }
  _notes.unshift(note)
  notify()
  return { id: note.id, title: note.title, content: note.content, updatedAt: note.updatedAt }
}

/**
 * PUBLIC_INTERFACE
 */
export function updateNote(id, updates) {
  /** Update a note by id with provided fields */
  const idx = _notes.findIndex((n) => n.id === id)
  if (idx === -1) return null
  const existing = _notes[idx]
  const next = {
    id: existing.id,
    title: updates && typeof updates.title === 'string' ? updates.title : existing.title,
    content: updates && typeof updates.content === 'string' ? updates.content : existing.content,
    updatedAt: Date.now(),
  }
  _notes[idx] = next
  notify()
  return { id: next.id, title: next.title, content: next.content, updatedAt: next.updatedAt }
}

/**
 * PUBLIC_INTERFACE
 */
export function deleteNote(id) {
  /** Delete a note by id */
  const oldLen = _notes.length
  _notes = _notes.filter((n) => n.id !== id)
  if (_notes.length !== oldLen) {
    notify()
    return true
  }
  return false
}

/**
 * PUBLIC_INTERFACE
 */
export function getApiBase() {
  /** Returns current API base (used for future backend swap) */
  return API_BASE
}
