import { Link } from 'react-router-dom'
import { EXTERNAL_LINKS } from '../links'

const SECTIONS = [
  { to: '/articles', title: 'Articles', desc: 'Keep coaching reads and PDF resources together.', icon: '📄', label: 'Read' },
  { to: '/tips', title: 'Coaching Tips and Clips', desc: 'Save useful coaching ideas, tips, and video clips.', icon: '🎬', label: 'Learn' },
  { to: '/gffl', title: 'The GFFL', desc: 'Open and update your GFFL spreadsheet.', icon: '📊', label: 'League tools' },
  { to: '/football', title: 'Football not Futbol', desc: 'Open and update your football spreadsheet.', icon: '🏈', label: 'League tools' },
  { to: '/store', title: 'Coaching Lessons', desc: 'Explore one-on-one lessons and coaching sessions.', icon: '🛒', label: 'Store' },
]

export default function Home() {
  return (
    <main className="page home-page">
      <header className="hero home-hero">
        <p className="home-eyebrow">Plan • Practice • Play</p>
        <h1>The Coach's Office</h1>
        <p className="home-intro">Coaching ideas, team tools, and lessons to help you make the next play.</p>
        <Link to="/tips" className="home-cta">Explore coaching tips <span aria-hidden="true">→</span></Link>
      </header>

      <section className="home-section" aria-labelledby="resources-heading">
        <div className="home-section-heading">
          <div>
            <p className="home-eyebrow">Your coaching toolkit</p>
            <h2 id="resources-heading">Explore the office</h2>
          </div>
          <p>Pick up where you need to: read, learn, manage your league, or find a lesson.</p>
        </div>
        <nav className="grid home-grid" aria-label="Explore site sections">
          {SECTIONS.map((s) => (
            <Link key={s.to} to={s.to} className="card home-card">
              <span className="icon" aria-hidden="true">{s.icon}</span>
              <span className="home-card-label">{s.label}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <span className="home-card-link">Open section <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="home-section home-quick-links" aria-labelledby="quick-links-heading">
        <div className="home-section-heading">
          <div>
            <p className="home-eyebrow">Around the web</p>
            <h2 id="quick-links-heading">Useful links</h2>
          </div>
          <p>Quick access to the sites and tools used by the teams.</p>
        </div>
        <nav className="grid home-grid home-external-grid" aria-label="External team links">
          {EXTERNAL_LINKS.map((l) => (
            <a key={l.title} href={l.url} target="_blank" rel="noopener noreferrer" className="card external home-card">
              <span className="icon" aria-hidden="true">{l.icon}</span>
              <h3>{l.title}</h3>
              <p>Visit this site in a new tab.</p>
              <span className="home-card-link">Visit site <span aria-hidden="true">↗</span></span>
            </a>
          ))}
        </nav>
      </section>
    </main>
  )
}
