import { Link } from 'react-router-dom'
import { useState } from 'react'
import { EXTERNAL_LINKS } from '../links'
import { exportBackup, importBackup } from '../backup'
import Notice from '../components/Notice'

const SECTIONS = [
  { to: '/articles', title: 'Articles', desc: 'Upload and read PDF articles', icon: '📄' },
  { to: '/tips', title: 'Coaching Tips and Clips', desc: 'Video clips and text tips', icon: '🎬' },
  { to: '/gffl', title: 'The GFFL', desc: 'Updateable multi-tab spreadsheet', icon: '📊' },
  { to: '/store', title: 'Web Store', desc: 'Coaching lessons', icon: '🛒' },
  { to: '/football', title: 'Football not Futbol', desc: 'Updateable multi-tab spreadsheet', icon: '🏈' },
]

export default function Home() {
  const [msg, setMsg] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  const backup = async () => {
    try {
      const url = URL.createObjectURL(await exportBackup())
      const a = document.createElement('a')
      a.href = url
      a.download = `coachs-office-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setMsg(null)
      setOk('Backup downloaded.')
    } catch {
      setOk(null)
      setMsg('Could not create the backup.')
    }
  }

  const restore = async (f: File | undefined) => {
    if (!f) return
    try {
      const n = await importBackup(f)
      setMsg(null)
      setOk(`Restored ${n} items. Reloading...`)
      setTimeout(() => window.location.reload(), 800)
    } catch (e) {
      setOk(null)
      setMsg(e instanceof Error ? e.message : 'Could not restore the backup.')
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <h1>The Coach's Office</h1>
        <p>Home Page</p>
      </header>
      <nav className="grid">
        {SECTIONS.map((s) => (
          <Link key={s.to} to={s.to} className="card">
            <span className="icon">{s.icon}</span>
            <h2>{s.title}</h2>
            <p>{s.desc}</p>
          </Link>
        ))}
        {EXTERNAL_LINKS.map((l) => (
          <a key={l.title} href={l.url} target="_blank" rel="noopener noreferrer" className="card external">
            <span className="icon">{l.icon}</span>
            <h2>{l.title}</h2>
            <p>Opens in a new tab ↗</p>
          </a>
        ))}
      </nav>
      <section>
        <h2>Backup &amp; Restore</h2>
        <p className="muted">Your work is saved only in this browser. Download a backup regularly, and restore it here or on another browser/device.</p>
        <div className="actions">
          <button onClick={backup}>Download backup</button>
          <label className="button">
            Restore from backup
            <input type="file" accept="application/json,.json" hidden
              onChange={(e) => { restore(e.target.files?.[0]); e.target.value = '' }} />
          </label>
        </div>
        <Notice message={msg} />
        <Notice message={ok} kind="ok" />
      </section>
    </div>
  )
}
