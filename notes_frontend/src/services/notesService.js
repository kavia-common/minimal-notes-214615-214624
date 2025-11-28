const API_BASE = import.meta?.env?.VITE_API_BASE || ''

let _notes = [
  {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title: 'Welcome to Ocean Notes',
    content:
      'This is your first note. Select it to edit. Use the + New button to create more notes. Delete with the trash button.',
    updatedAt: Date.now(),
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
  return [..._notes].sort((a, b) => b.updatedAt - a.updatedAt)
}

/**
 * PUBLIC_INTERFACE
 */
export function getNoteById(id) {
  /** Get a single note by id (cloned) */
  const found = _notes.find((n) => n.id === id)
  return found ? { ...found } : null
}

/**
 * PUBLIC_INTERFACE
 */
export function createNote(partial = {}) {
  /** Create a new note and return it */
  const now = Date.now()
  const note = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(now),
    title: partial.title ?? 'Untitled',
    content: partial.content ?? '',
    updatedAt: now,
  }
  _notes.unshift(note)
  notify()
  return { ...note }
}

/**
 * PUBLIC_INTERFACE
 */
export function updateNote(id, updates) {
  /** Update a note by id with provided fields */
  const idx = _notes.findIndex((n) => n.id === id)
  if (idx === -1) return null
  _notes[idx] = {
    ..._notes[idx],
    ...updates,
    updatedAt: Date.now(),
  }
  notify()
  return { ..._notes[idx] }
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
