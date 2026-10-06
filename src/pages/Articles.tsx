import { useState } from 'react'
import PageShell from '../components/PageShell'
import Notice from '../components/Notice'
import { newId, useIdbState } from '../storage'

interface Article {
  id: string
  name: string
  size: number
  added: string
  data: Blob
}

function download(a: Article) {
  const url = URL.createObjectURL(a.data)
  const link = document.createElement('a')
  link.href = url
  link.download = a.name
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function view(a: Article) {
  const url = URL.createObjectURL(a.data)
  window.open(url, '_blank', 'noopener')
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}

export default function Articles() {
  const { value: articles, update, loaded, error } = useIdbState<Article[]>('articles', [])
  const [msg, setMsg] = useState<string | null>(null)

  const onFiles = (files: FileList | null) => {
    if (!files) return
    const added: Article[] = []
    const rejected: string[] = []
    for (const f of Array.from(files)) {
      if (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) {
        added.push({
          id: newId(),
          name: f.name,
          size: f.size,
          added: new Date().toISOString(),
          data: new Blob([f], { type: 'application/pdf' }),
        })
      } else rejected.push(f.name)
    }
    setMsg(rejected.length ? `Only PDF files are allowed. Skipped: ${rejected.join(', ')}` : null)
    if (added.length) update([...added, ...articles])
  }

  return (
    <PageShell title="Articles">
      <label className="button">
        Upload PDF
        <input type="file" accept="application/pdf,.pdf" multiple hidden
          onChange={(e) => { onFiles(e.target.files); e.target.value = '' }} />
      </label>
      <Notice message={msg} />
      <Notice message={error} />
      {loaded && articles.length === 0 && <p className="muted">No articles yet. Upload a PDF to get started.</p>}
      <ul className="list">
        {articles.map((a) => (
          <li key={a.id} className="row">
            <div>
              <strong>{a.name}</strong>
              <div className="muted">{(a.size / 1024).toFixed(0)} KB · {new Date(a.added).toLocaleDateString()}</div>
            </div>
            <div className="actions">
              <button onClick={() => view(a)}>View</button>
              <button onClick={() => download(a)}>Download</button>
              <button className="danger" onClick={() => update(articles.filter((x) => x.id !== a.id))}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </PageShell>
  )
}
