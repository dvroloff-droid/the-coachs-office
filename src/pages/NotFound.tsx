import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'

export default function NotFound() {
  return (
    <PageShell title="Page not found">
      <p className="muted">We couldn’t find that page. Head back to the office to find what you need.</p>
      <Link to="/" className="button">Go to the home page</Link>
    </PageShell>
  )
}
