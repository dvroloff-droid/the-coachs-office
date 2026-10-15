# the-coachs-office

The Coach's Office is a responsive home base for coaching resources, practice tips, film-room clips, and fantasy sports tools.

## Get started

Requires Node.js and npm.

```sh
npm ci
npm run dev
```

## Checks and production build

```sh
npm run lint
npm run build
npm run preview
```

## Features

- Save and manage PDF articles in the browser.
- Collect coaching tips and YouTube/Vimeo clips.
- Upload, edit, and export fantasy league spreadsheets.
- Browse coaching lessons and manage a local cart.

Articles, tips, cart contents, and spreadsheets are stored in the current browser; they are not synced to a server.

## Publish with GitHub Pages

Pushes to `main` build and deploy the site via `.github/workflows/pages.yml`. Enable it once under **Settings → Pages → Source: GitHub Actions**. The site will be at `https://<user>.github.io/the-coachs-office/`.
