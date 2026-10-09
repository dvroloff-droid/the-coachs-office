import { Link } from 'react-router-dom'
import { EXTERNAL_LINKS } from '../links'

const SECTIONS = [
  { to: '/articles', title: 'Articles', desc: 'Upload and read PDF articles', icon: '📄' },
  { to: '/tips', title: 'Coaching Tips and Clips', desc: 'Video clips and text tips', icon: '🎬' },
  { to: '/gffl', title: 'The GFFL', desc: 'Updateable multi-tab spreadsheet', icon: '📊' },
  { to: '/store', title: 'Web Store', desc: 'Coaching lessons', icon: '🛒' },
  { to: '/football', title: 'Football not Futbol', desc: 'Updateable multi-tab spreadsheet', icon: '🏈' },
]

export default function Home() {
  return (
    <div className="page">
      <header className="hero">
        <h1>The Coach's Office</h1>
        <p>Field notes from another dimension</p>
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
    </div>
  )
}
