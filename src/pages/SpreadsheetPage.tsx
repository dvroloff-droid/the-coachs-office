import { useState } from 'react'
import * as XLSX from '@e965/xlsx'
import PageShell from '../components/PageShell'
import Notice from '../components/Notice'
import { useIdbState } from '../storage'

type Cell = string | number | boolean | null
interface Sheet { name: string; rows: Cell[][] }
interface Book { fileName: string; sheets: Sheet[] }

const colName = (i: number) => {
  let s = ''
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s
  return s
}

export default function SpreadsheetPage({ storageKey, title }: { storageKey: string; title: string }) {
  const { value: book, update, loaded, error } = useIdbState<Book | null>(`sheet-${storageKey}`, null)
  const [active, setActive] = useState(0)
  const [msg, setMsg] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [draft, setDraft] = useState<Book | null>(null)

  const current = draft ?? book
  const sheet = current?.sheets[Math.min(active, (current?.sheets.length ?? 1) - 1)]
  const dirty = draft !== null

  const edit = (fn: (rows: Cell[][]) => Cell[][]) => {
    if (!current || !sheet) return
    const idx = current.sheets.indexOf(sheet)
    setDraft({ ...current, sheets: current.sheets.map((s, i) => (i === idx ? { ...s, rows: fn(s.rows) } : s)) })
    setOk(null)
  }

  const width = sheet ? Math.max(1, ...sheet.rows.map((r) => r.length)) : 0

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setOk(null)
    if (!/\.xlsx?$/i.test(file.name)) return setMsg('Please choose an Excel file (.xlsx).')
    try {
      const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' })
      const sheets: Sheet[] = wb.SheetNames.map((name) => ({
        name,
        rows: (XLSX.utils.sheet_to_json<Cell[]>(wb.Sheets[name], { header: 1, defval: null, blankrows: true }) as Cell[][]),
      }))
      if (!sheets.length) return setMsg('That workbook has no sheets.')
      setMsg(null); setActive(0); setDraft(null)
      update({ fileName: file.name, sheets })
      setOk(`Loaded ${file.name}`)
    } catch {
      setMsg('Could not read that file. Is it a valid Excel workbook?')
    }
  }

  const save = () => {
    if (!draft) return
    update(draft); setDraft(null); setOk('Changes saved in this browser.')
  }

  const exportXlsx = () => {
    if (!current) return
    const wb = XLSX.utils.book_new()
    current.sheets.forEach((s) => XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s.rows), s.name.slice(0, 31)))
    XLSX.writeFile(wb, current.fileName.replace(/\.xlsx?$/i, '') + '.xlsx')
  }

  const addSheet = () => {
    if (!current) return
    const name = window.prompt('New tab name?')?.trim().slice(0, 31)
    if (!name) return
    if (current.sheets.some((s) => s.name === name)) return setMsg('A tab with that name already exists.')
    setMsg(null)
    setDraft({ ...current, sheets: [...current.sheets, { name, rows: [[null]] }] })
    setActive(current.sheets.length)
  }

  const deleteSheet = () => {
    if (!current || !sheet || current.sheets.length < 2) return setMsg('A workbook needs at least one tab.')
    if (!window.confirm(`Delete tab "${sheet.name}"?`)) return
    setMsg(null)
    setDraft({ ...current, sheets: current.sheets.filter((s) => s !== sheet) })
    setActive(0)
  }

  const clear = () => {
    if (!window.confirm('Remove this spreadsheet from the browser?')) return
    setDraft(null); update(null); setActive(0)
  }

  return (
    <PageShell title={title}>
      <div className="actions">
        <label className="button">
          Upload Excel
          <input type="file" accept=".xlsx,.xls" hidden onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = '' }} />
        </label>
        {current && (
          <>
            <button className="primary" onClick={save} disabled={!dirty}>Save</button>
            <button onClick={exportXlsx}>Export .xlsx</button>
            <button className="danger" onClick={clear}>Remove</button>
          </>
        )}
      </div>
      <Notice message={msg} />
      <Notice message={error} />
      <Notice message={ok} kind="ok" />
      {loaded && !current && <p className="muted">No spreadsheet yet. Upload an .xlsx file to begin.</p>}
      {current && sheet && (
        <>
          <p className="muted">{current.fileName}{dirty && ' — unsaved changes'}</p>
          <div className="tabs">
            {current.sheets.map((s, i) => (
              <button key={s.name} className={s === sheet ? 'active' : ''} onClick={() => setActive(i)}>{s.name}</button>
            ))}
            <button onClick={addSheet} aria-label="Add tab">+</button>
            <button onClick={deleteSheet} className="danger" aria-label="Delete current tab">🗑</button>
          </div>
          <div className="actions">
            <button onClick={() => edit((r) => [...r, Array(width).fill(null)])}>+ Row</button>
            <button onClick={() => edit((r) => r.map((row) => [...padRow(row, width), null]))}>+ Column</button>
          </div>
          <div className="sheet-wrap">
            <table className="sheet">
              <thead>
                <tr>
                  <th />
                  {Array.from({ length: width }, (_, c) => (
                    <th key={c}>
                      {colName(c)}
                      <button className="mini danger" title="Delete column" disabled={width < 2}
                        onClick={() => edit((r) => r.map((row) => padRow(row, width).filter((_, i) => i !== c)))}>×</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheet.rows.map((row, r) => (
                  <tr key={r}>
                    <th>
                      {r + 1}
                      <button className="mini danger" title="Delete row" onClick={() => edit((rows) => rows.filter((_, i) => i !== r))}>×</button>
                    </th>
                    {Array.from({ length: width }, (_, c) => (
                      <td key={c}>
                        <input
                          value={String(row[c] ?? '')}
                          onChange={(e) => {
                            const v = e.target.value
                            edit((rows) => rows.map((rw, i) => {
                              if (i !== r) return rw
                              const n = padRow(rw, width)
                              n[c] = v === '' ? null : !isNaN(Number(v)) && v.trim() !== '' ? Number(v) : v
                              return n
                            }))
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </PageShell>
  )
}

function padRow(row: Cell[], width: number): Cell[] {
  const n = row.slice()
  while (n.length < width) n.push(null)
  return n
}
