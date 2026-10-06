import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Articles from './pages/Articles'
import Tips from './pages/Tips'
import SpreadsheetPage from './pages/SpreadsheetPage'
import Store from './pages/Store'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/tips" element={<Tips />} />
      <Route path="/gffl" element={<SpreadsheetPage storageKey="gffl" title="The GFFL" />} />
      <Route path="/football" element={<SpreadsheetPage storageKey="football" title="Football not Futbol" />} />
      <Route path="/store" element={<Store />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
