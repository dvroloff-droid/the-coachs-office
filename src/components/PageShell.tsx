import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import SiteLayout from './SiteLayout'

export default function PageShell({ title, eyebrow, intro, children }: { title: string; eyebrow?: string; intro?: string; children: ReactNode }) {
  return (
    <SiteLayout>
      <div className="page">
        <Link to="/" className="back">← Home</Link>
        <header className="page-header">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          {intro && <p className="page-intro">{intro}</p>}
        </header>
        {children}
      </div>
    </SiteLayout>
  )
}
