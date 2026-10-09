import { DB_NAME, STORE } from './storage'

const MARK = '__blob__'
type Json = unknown

const blobToDataUrl = (b: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.onerror = () => reject(r.error)
    r.readAsDataURL(b)
  })

async function encode(v: unknown): Promise<Json> {
  if (v instanceof Blob) return { [MARK]: await blobToDataUrl(v) }
  if (Array.isArray(v)) return Promise.all(v.map(encode))
  if (v && typeof v === 'object') {
    const out: Record<string, Json> = {}
    for (const [k, x] of Object.entries(v)) out[k] = await encode(x)
    return out
  }
  return v
}

async function decode(v: Json): Promise<unknown> {
  if (Array.isArray(v)) return Promise.all(v.map(decode))
  if (v && typeof v === 'object') {
    const o = v as Record<string, Json>
    if (typeof o[MARK] === 'string') return (await fetch(o[MARK] as string)).blob()
    const out: Record<string, unknown> = {}
    for (const [k, x] of Object.entries(o)) out[k] = await decode(x)
    return out
  }
  return v
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function exportBackup(): Promise<Blob> {
  const db = await openDb()
  const store = db.transaction(STORE).objectStore(STORE)
  const keys = await new Promise<IDBValidKey[]>((res, rej) => {
    const r = store.getAllKeys()
    r.onsuccess = () => res(r.result)
    r.onerror = () => rej(r.error)
  })
  const values = await new Promise<unknown[]>((res, rej) => {
    const r = store.getAll()
    r.onsuccess = () => res(r.result)
    r.onerror = () => rej(r.error)
  })
  const idb: Record<string, Json> = {}
  for (let i = 0; i < keys.length; i++) idb[String(keys[i])] = await encode(values[i])
  const local: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)!
    local[k] = localStorage.getItem(k)!
  }
  return new Blob([JSON.stringify({ app: 'coachs-office', version: 1, exported: new Date().toISOString(), idb, local })], {
    type: 'application/json',
  })
}

export async function importBackup(file: File): Promise<number> {
  const data = JSON.parse(await file.text())
  if (data?.app !== 'coachs-office' || typeof data.idb !== 'object' || typeof data.local !== 'object')
    throw new Error('This is not a Coach\'s Office backup file.')
  const entries: [string, unknown][] = []
  for (const [k, v] of Object.entries(data.idb as Record<string, Json>)) entries.push([k, await decode(v)])
  const db = await openDb()
  await new Promise<void>((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite')
    const s = tx.objectStore(STORE)
    for (const [k, v] of entries) s.put(v, k)
    tx.oncomplete = () => res()
    tx.onerror = () => rej(tx.error)
  })
  for (const [k, v] of Object.entries(data.local as Record<string, string>)) localStorage.setItem(k, v)
  return entries.length + Object.keys(data.local).length
}
