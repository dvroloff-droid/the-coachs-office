import { useState } from 'react'
import Notice from '../components/Notice'
import { newId, useIdbState } from '../storage'
import { Link } from 'react-router-dom'

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
    <main className="page newspaper-page">
      <Link to="/" className="back">← Home</Link>
      <header className="paper-masthead">
        <div className="paper-edition">
          <span>THE COACH'S OFFICE</span>
          <span>FIELD NOTES · EST. 2026</span>
        </div>
        <h1>The Playbook</h1>
        <p className="paper-deck">A collection of coaching articles, ready for your next game plan.</p>
        <div className="paper-toolbar">
          <span>{articles.length} {articles.length === 1 ? 'ARTICLE' : 'ARTICLES'} IN THE ARCHIVE</span>
          <label className="button">
            Upload PDF
            <input type="file" accept="application/pdf,.pdf" multiple hidden
              onChange={(e) => { onFiles(e.target.files); e.target.value = '' }} />
          </label>
        </div>
      </header>
      <Notice message={msg} />
      <Notice message={error} />
      {loaded && articles.length === 0 && (
        <section className="paper-empty">
          <span className="paper-kicker">YOUR ARCHIVE STARTS HERE</span>
          <h2>No articles on the desk yet.</h2>
          <p>Upload a coaching PDF to add the first story to your playbook.</p>
        </section>
      )}
      {articles.length > 0 && (
        <section className="paper-archive" aria-label="Uploaded articles">
          <div className="paper-section-heading">
            <h2>From the archive</h2>
            <span>PDF EDITION</span>
          </div>
          <ul className="paper-list">
        {articles.map((a) => (
          <li key={a.id} className="paper-story">
            <div className="paper-story-heading">
              <span className="paper-kicker">COACHING · PDF</span>
              <span className="paper-file-mark" aria-hidden="true">PDF</span>
            </div>
            <h3>{a.name}</h3>
            <p className="paper-byline">Added {new Date(a.added).toLocaleDateString()} <span>·</span> {(a.size / 1024).toFixed(0)} KB</p>
            <div className="paper-actions">
              <button className="primary" onClick={() => view(a)}>Read article</button>
              <button onClick={() => download(a)}>Download</button>
              <button className="danger" onClick={() => update(articles.filter((x) => x.id !== a.id))}>Delete</button>
            </div>
          </li>
        ))}
          </ul>
        </section>
      )}
    </main>
  )
}
