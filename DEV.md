# Development Guide

React + Vite + TypeScript, fully client-side (no backend). Routing uses `HashRouter`, so URLs look like `/#/tips`.

## Run it and see it live

```bash
npm install
npm run dev        # http://localhost:5173 – hot-reloads on every save
npm run build      # type-check + production build into dist/
npm run lint
npm run preview    # serve the production build
```

**In GitHub Codespaces:** open the repo → Code → Codespaces → New, run `npm run dev`, and open the forwarded port 5173 from the Ports tab. Edits show up instantly, so you can review visually and ask for changes in chat.

## Routes and where their code/data live

| Route | File | Data source |
|-------|------|-------------|
| `/` | `src/pages/Home.tsx` | Section cards hardcoded in Home.tsx; external cards from `src/links.ts` (**placeholder URLs**) |
| `/articles` | `src/pages/Articles.tsx` | **IndexedDB** key `articles` (uploaded PDFs, per browser) |
| `/tips` | `src/pages/Tips.tsx` | **localStorage** key `tips` (text tips and video-clip links) |
| `/gffl` | `src/pages/SpreadsheetPage.tsx` | **IndexedDB** key `sheet-gffl` (uploaded/edited .xlsx) |
| `/football` | `src/pages/SpreadsheetPage.tsx` | **IndexedDB** key `sheet-football` |
| `/store` | `src/pages/Store.tsx` | Catalog hardcoded in `LESSONS` (**placeholder prices**); cart in localStorage keys `cart`, `cart-done` |

Routes are registered in `src/App.tsx`.

## Data architecture

- **IndexedDB** (database `coachs-office`, object store `kv`) – large files. Helper: `useIdbState` in `src/storage.ts`.
- **localStorage** – small data. Helper: `useLocalState` in `src/storage.ts`.
- **Hardcoded** – external links (`src/links.ts`), store catalog (`LESSONS` in `src/pages/Store.tsx`), home section cards.
- All saved data lives only in the visitor's browser; clearing site data erases it. There is no server or shared database.

### Changing placeholder data
- **External links:** edit `EXTERNAL_LINKS` in `src/links.ts` (`title`, `url`, `icon`). Currently ESPN Fantasy, and two `https://gc.com/` Gamechanger links that need the real team URLs.
- **Store catalog:** edit `LESSONS` in `src/pages/Store.tsx`. Each item is `{ id, title, desc, price }` (price in dollars; `id` must stay unique and stable because the cart references it). Checkout is a stub – no payment is processed.

### Placeholder data to replace
- [ ] `src/links.ts` – all three URLs (two are the generic `https://gc.com/`)
- [ ] `src/pages/Store.tsx` – lesson titles, descriptions and prices
- [ ] Spreadsheets and articles start empty; upload real content in the running app

## Styling and color palette

All styling is in **`src/index.css`**; colors are CSS variables in `:root`:

| Variable | Value | Use |
|----------|-------|-----|
| `--accent` | `rgb(171, 154, 192)` | Borders, card outlines, hover tints |
| `--purple` | `#4b2e83` | Headings, primary buttons, hero gradient start |
| `--blue` | `#2c4a9a` | Links, hover/active buttons, hero gradient end |
| `--bg` | `#f4f1f9` | Page background |

Changing a variable updates the whole site. A few values are hardcoded and must be changed with it: the accent tints `rgba(171, 154, 192, …)` (card.external, button hover, sheet header), the shadow `rgba(75, 46, 131, .25)`, text `#241b36`, muted `#6b6280`, and error/ok notice colors.

## Component structure
- `src/main.tsx` – entry, wraps the app in `HashRouter`
- `src/App.tsx` – route table
- `src/components/PageShell.tsx` – shared page layout/header; `Notice.tsx` – error/ok messages
- `src/pages/*` – one file per page

## Requesting changes (template)

Describe what you see and what you want. Examples:

**Colors**
- "Change the accent color to teal." → updates `--accent` (and its tints) in `src/index.css`
- "Make the hero gradient go from navy to teal."
- "Show me a palette of 3 options before changing anything."

**New pages**
- "Add a `/schedules` page with a table of practice times, linked from the home cards. Data should be [hardcoded / editable and saved in localStorage / uploaded Excel file]."

**New features / content**
- "Add a lesson called 'Pitching Clinic' for $35 to the store."
- "Replace the Madison College link with <url>."

**Data questions**
- "Where does the data on the Tips page come from?"
- "What is stored in my browser, and how do I reset it?" (DevTools → Application → IndexedDB / Local Storage)

**Tips for good requests:** name the page (route), say what should change, and for new data say where it should come from and whether it's editable.
