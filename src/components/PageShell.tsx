import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import SiteLayout from './SiteLayout'

export default function PageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <SiteLayout>
      <div className="page">
        <Link to="/" className="back">← Home</Link>
        <h1>{title}</h1>
        {children}
      </div>
    </SiteLayout>
  )
}
