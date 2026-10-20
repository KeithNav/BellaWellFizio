# BellaWell – útmutató ügynököknek

React (Vite, TypeScript) frontend + Strapi 5 backend. Részletek: [README.md](README.md). Éles oldal: https://bellawellfizio.hu

## Deploy az éles szerverre

Amikor a felhasználó deployt kér, használd a scriptet – ne írj saját SSH/scp parancsokat:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1                  # frontend
powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1 -Target backend  # Strapi (újraindul, adatbázis-mentés készül)
powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1 -Rollback        # előző frontend verzió
powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1 -CheckOnly       # állapotteszt
```

- A script a kulcsot a `~/.ssh/bellawell_deploy` fájlból olvassa (vagy a `BELLAWELL_DEPLOY_KEY` változóból). Ha hiányzik,
  mondd meg a felhasználónak; a kulcsot ne generáld újra és ne keress vele kerülőutat.
- Csak akkor deployolj, ha a felhasználó kéri. A deploy után a script kimenete mutatja az ellenőrzést; ha hibát jelez, jelezd.
- Teljes leírás (szerver felépítése, kulcs, új gép): [DEPLOY.md](DEPLOY.md).

## Szabályok

- **A privát kulcsot, jelszavakat, a szerver `.env`-jét soha ne commitold és ne írd a repóba.**
- A szerveren **másik éles oldal is fut** (`eletkertjudittal.hu`, a `:1337` Strapi, PM2 `admin`, nginx `frontend` és `strapi`
  site-ok, Minecraft szerver). Ezeket ne módosítsd, ne indítsd újra. Az nginx-ben csak a `bellawellfizio` site-hoz nyúlj,
  és előbb `nginx -t`.
- A tartalom (szolgáltatások, árak, galéria, hero kép) az éles Strapi adatbázisban van. A helyi `backend/.tmp/data.db`-t
  ne töltsd fel az éles szerverre.
- A szövegek magyarul, egyes szám első személyben íródnak (egy személyes vállalkozás: „megyek", „segítek").

## Fejlesztés

```powershell
cd frontend; npm install; npm run dev        # http://localhost:5173
cd backend;  npm install; npm run develop    # http://localhost:1337
cd frontend; npm run build                   # tsc + vite + prerender (dist\), ugyanez fut a deploy előtt
```

- Az oldal build után előre renderelt HTML-t kap (`frontend/scripts/prerender.mjs`, `src/entry-server.tsx`) a keresőknek,
  ezért komponens szinten kerüld a `window`/`document` használatát renderelés közben (csak `useEffect`-ben).
- Új oldal (route) esetén vedd fel a `frontend/scripts/prerender.mjs` útvonallistájába és a `frontend/public/sitemap.xml`-be.
- A kapcsolati űrlap a Web3Forms-on keresztül működik (`frontend/.env`), nem a Strapin.
