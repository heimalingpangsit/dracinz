# DracinTeros

Website streaming drama China/Asia subtitle Indonesia. React + Vite (frontend) dengan API scraper Express, siap deploy ke Netlify (serverless function) atau VPS.

## Jalanin Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Deploy ke Netlify

1. Push project ini ke GitHub/GitLab/Bitbucket, lalu import di Netlify — atau pakai Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```
2. Build settings sudah diatur otomatis lewat `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions` (API scraper jalan sebagai serverless function di `/api/*`)
3. Netlify otomatis install dependencies dari `package.json` dan bundle function-nya, ga perlu setting tambahan.

## Deploy ke VPS

Pakai script `build:vps` untuk build server Express standalone:

```bash
npm run build:vps
npm start
```

## Struktur Penting

- `src/server/scraper.ts` — logic scraping sumber drama
- `src/server/routes.ts` — Express router API (dipakai baik di `server.ts` untuk lokal/VPS, maupun di `netlify/functions/api.ts` untuk Netlify)
- `netlify/functions/api.ts` — wrapper serverless untuk Netlify
- `src/components/PWAInstallPrompt.tsx` — notifikasi install PWA (banner dari atas)
