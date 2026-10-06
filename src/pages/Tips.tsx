import { useState } from 'react'
import PageShell from '../components/PageShell'
import Notice from '../components/Notice'
import { newId, useLocalState } from '../storage'

interface Item {
  id: string
  kind: 'video' | 'text'
  title: string
  content: string
}

/** Returns an embeddable URL for YouTube/Vimeo, or null. */
function embedUrl(raw: string): string | null {
  try {
    const u = new URL(raw)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
    if (host.endsWith('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      const m = u.pathname.match(/^\/(embed|shorts)\/([\w-]+)/)
      if (m) return `https://www.youtube.com/embed/${m[2]}`
    }
    if (host === 'vimeo.com') {
      const m = u.pathname.match(/^\/(\d+)/)
      if (m) return `https://player.vimeo.com/video/${m[1]}`
    }
  } catch {
    /* invalid */
  }
  return null
}

function isHttp(raw: string) {
  try {
    return ['http:', 'https:'].includes(new URL(raw).protocol)
  } catch {
    return false
  }
}

export default function Tips() {
  const [items, setItems] = useLocalState<Item[]>('tips', [])
  const [kind, setKind] = useState<'video' | 'text'>('video')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const reset = () => { setTitle(''); setContent(''); setEditing(null); setErr(null) }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const c = content.trim()
    if (!c) return setErr(kind === 'video' ? 'Enter a video URL.' : 'Enter some tip text.')
    if (kind === 'video' && !isHttp(c)) return setErr('Enter a valid http(s) URL.')
    const item: Item = { id: editing ?? newId(), kind, title: title.trim(), content: c }
    setItems(editing ? items.map((i) => (i.id === editing ? item : i)) : [item, ...items])
    reset()
  }

  const edit = (i: Item) => {
    setEditing(i.id); setKind(i.kind); setTitle(i.title); setContent(i.content); setErr(null)
  }

  return (
    <PageShell title="Coaching Tips and Clips">
      <form className="form" onSubmit={submit}>
        <div className="tabs">
          <button type="button" className={kind === 'video' ? 'active' : ''} onClick={() => setKind('video')}>Video clip</button>
          <button type="button" className={kind === 'text' ? 'active' : ''} onClick={() => setKind('text')}>Text tip</button>
        </div>
        <input placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
        {kind === 'video' ? (
          <input placeholder="Video URL (YouTube, Vimeo, ...)" value={content} onChange={(e) => setContent(e.target.value)} />
        ) : (
          <textarea rows={4} placeholder="Coaching tip" value={content} onChange={(e) => setContent(e.target.value)} />
        )}
        <Notice message={err} />
        <div className="actions">
          <button type="submit" className="primary">{editing ? 'Save changes' : 'Add'}</button>
          {editing && <button type="button" onClick={reset}>Cancel</button>}
        </div>
      </form>
      {items.length === 0 && <p className="muted">Nothing here yet.</p>}
      <div className="grid">
        {items.map((i) => {
          const embed = i.kind === 'video' ? embedUrl(i.content) : null
          return (
            <article key={i.id} className="card static">
              {i.title && <h2>{i.title}</h2>}
              {i.kind === 'text' && <p className="pre">{i.content}</p>}
              {embed && <iframe className="video" src={embed} title={i.title || 'Video'} allowFullScreen />}
              {i.kind === 'video' && !embed && (
                <a href={i.content} target="_blank" rel="noopener noreferrer">{i.content}</a>
              )}
              <div className="actions">
                <button onClick={() => edit(i)}>Edit</button>
                <button className="danger" onClick={() => setItems(items.filter((x) => x.id !== i.id))}>Delete</button>
              </div>
            </article>
          )
        })}
      </div>
    </PageShell>
  )
}
