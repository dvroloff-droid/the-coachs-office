import { Link } from 'react-router-dom'
import { EXTERNAL_LINKS } from '../links'
import SiteLayout from '../components/SiteLayout'

const SECTIONS = [
  { to: '/articles', title: 'The reading room', desc: 'Keep useful coaching articles and reference PDFs close at hand.', icon: '01', type: 'Library' },
  { to: '/tips', title: 'Tips & film room', desc: 'Collect the small reminders and video clips that change a game.', icon: '02', type: 'Practice' },
  { to: '/gffl', title: 'The GFFL', desc: 'Manage your fantasy league workbook, right here in your browser.', icon: '03', type: 'Fantasy' },
  { to: '/football', title: 'Football, not futbol', desc: 'A flexible spreadsheet for the details behind your season.', icon: '04', type: 'Football' },
  { to: '/store', title: 'Work with a coach', desc: 'Find one-on-one lessons, film sessions, and small-group clinics.', icon: '05', type: 'Lessons' },
]

export default function Home() {
  return (
    <SiteLayout>
      <div className="page home-page">
        <section className="hero" aria-labelledby="home-title">
          <div className="hero-copy">
            <p className="eyebrow">A better day starts with a game plan</p>
            <h1 id="home-title">Make every practice <span>count.</span></h1>
            <p className="hero-description">A home base for coaches, players, and fantasy managers who want to keep learning and get a little better every day.</p>
            <div className="hero-actions">
              <Link to="/articles" className="button">Explore the resources <span aria-hidden="true">→</span></Link>
              <Link to="/tips" className="text-link">Head to the film room</Link>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="playbook-card">
              <div className="playbook-top"><span>THE PLAYBOOK</span><span>NO. 01</span></div>
              <div className="field">
                <span className="field-line field-line-one" />
                <span className="field-line field-line-two" />
                <span className="route route-one" />
                <span className="route route-two" />
                <span className="route-dot route-dot-one" />
                <span className="route-dot route-dot-two" />
              </div>
              <p>Prepare with purpose.<br /><strong>Play with confidence.</strong></p>
            </div>
            <span className="hero-stamp">COACH<br />BETTER</span>
          </div>
          <span className="hero-note" aria-hidden="true">EST. FOR THE LOVE OF THE GAME</span>
        </section>

        <section className="resource-section" aria-labelledby="resources-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your tools, all in one place</p>
              <h2 id="resources-title">The office is open.</h2>
            </div>
            <p>Practical resources for the work before, during, and after game day.</p>
          </div>
          <div className="grid resource-grid">
            {SECTIONS.map((section) => (
              <Link key={section.to} to={section.to} className="card resource-card">
                <span className="resource-number">{section.icon}</span>
                <span className="resource-type">{section.type}</span>
                <h3>{section.title}</h3>
                <p>{section.desc}</p>
                <span className="resource-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="community-strip" aria-labelledby="community-title">
          <div>
            <p className="eyebrow">More from the sidelines</p>
            <h2 id="community-title">Your game, your community.</h2>
            <p>Visit ESPN Fantasy or GameChanger to find the leagues and teams you follow.</p>
          </div>
          <div className="community-links">
            {EXTERNAL_LINKS.map((link) => (
              <a key={link.title} href={link.url} target="_blank" rel="noopener noreferrer" className="community-link">
                <span aria-hidden="true">{link.icon}</span>
                <span>{link.title}</span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  )
}
