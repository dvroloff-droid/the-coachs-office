import { useCallback, useEffect, useState } from 'react'

const DB_NAME = 'coachs-office'
const STORE = 'kv'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function idbGet<T>(key: string): Promise<T | undefined> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE).objectStore(STORE).get(key)
    req.onsuccess = () => resolve(req.result as T | undefined)
    req.onerror = () => reject(req.error)
  })
}

export async function idbSet<T>(key: string, value: T): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(value, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

/** State persisted in IndexedDB (suitable for large files). */
export function useIdbState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    idbGet<T>(key)
      .then((v) => {
        if (active && v !== undefined) setValue(v)
      })
      .catch(() => active && setError('Could not read saved data from this browser.'))
      .finally(() => active && setLoaded(true))
    return () => {
      active = false
    }
  }, [key])

  const update = useCallback(
    (next: T) => {
      setValue(next)
      idbSet(key, next).then(
        () => setError(null),
        () => setError('Could not save to browser storage (it may be full).'),
      )
    },
    [key],
  )

  return { value, update, loaded, error }
}

/** State persisted in localStorage (small data). */
export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  const update = useCallback(
    (next: T) => {
      setValue(next)
      try {
        localStorage.setItem(key, JSON.stringify(next))
      } catch {
        /* storage unavailable */
      }
    },
    [key],
  )
  return [value, update] as const
}

export const newId = () => Math.random().toString(36).slice(2) + Date.now().toString(36)
