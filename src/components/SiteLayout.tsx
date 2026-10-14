import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/articles', label: 'Articles' },
  { to: '/tips', label: 'Tips & clips' },
  { to: '/gffl', label: 'Fantasy tools' },
  { to: '/store', label: 'Lessons' },
]

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="brand" aria-label="The Coach's Office home">
            <span className="brand-mark" aria-hidden="true">CO</span>
            <span className="brand-name">The Coach's Office</span>
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to}>{link.label}</Link>
            ))}
          </nav>
        </div>
      </header>
      <main id="main-content" className="site-main">{children}</main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <span>Good coaching is built one practice at a time.</span>
          <Link to="/">The Coach's Office</Link>
        </div>
      </footer>
    </div>
  )
}
