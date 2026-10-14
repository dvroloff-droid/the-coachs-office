import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const Articles = lazy(() => import('./pages/Articles'))
const Tips = lazy(() => import('./pages/Tips'))
const SpreadsheetPage = lazy(() => import('./pages/SpreadsheetPage'))
const Store = lazy(() => import('./pages/Store'))

export default function App() {
  return (
    <Suspense fallback={<div className="route-loading" role="status">Loading your office…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/gffl" element={<SpreadsheetPage storageKey="gffl" title="The GFFL" />} />
        <Route path="/football" element={<SpreadsheetPage storageKey="football" title="Football not Futbol" />} />
        <Route path="/store" element={<Store />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  )
}
