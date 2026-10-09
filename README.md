# the-coachs-office
The Coach's Office - A functional web application for coaching resources, articles, tips, and fantasy sports management

See [DEV.md](DEV.md) for running the app, the data architecture, the color palette, and how to request changes.

## Deploying to Vercel

1. In the Vercel dashboard, choose **Add New → Project** and import this repo.
2. Vercel reads `vercel.json` (Vite, `npm run build`, output `dist`); click **Deploy**.

The app is fully client-side (HashRouter), so no rewrites are needed. Uploaded articles are stored in each visitor's browser (IndexedDB).
