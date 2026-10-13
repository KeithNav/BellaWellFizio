# BellaWell Kutya-fizioterápia – bellawellfizio.hu

Landing page React (Vite + TypeScript) frontenddel és Strapi 5 backenddel.

```
backend/    Strapi 5 CMS (SQLite fejlesztésben)
frontend/   React + Vite oldal
```

## Indítás fejlesztéshez

```powershell
# 1. backend  (http://localhost:1337, admin: /admin)
cd backend
npm install
npm run develop

# 2. frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

Az első indításkor a Strapi admin felületen létre kell hozni az admin felhasználót. A szolgáltatások, árak és
elérhetőségek az első indításkor automatikusan feltöltődnek az árlistából, és a publikus olvasási jogosultságok is
beállítódnak.

## Tartalomkezelés (Strapi admin → Content Manager)

| Tartalom | Mit lehet szerkeszteni |
|---|---|
| **Szolgáltatás** | név, leírás, ár (Ft), ár utótag (pl. „/ terület”), „kiegészítő terápia” jelölés, sorrend |
| **Galéria elem** | kép feltöltése, cím, sorrend – a Media Library-n keresztül |
| **Oldal beállítások** | telefon, e-mail, Facebook/Instagram link, kiszállási tájékoztató szöveg, főoldali (hero) kép |

A frontend a `/api/services`, `/api/gallery-items` és `/api/site-setting` végpontokról tölt. Ha a backend nem érhető el,
az árlista beépített alapértékekkel jelenik meg.

## Környezeti változók

`backend/.env` (lásd `.env.example`): Strapi kulcsok, `CLIENT_URLS` (CORS), `HCAPTCHA_SITEKEY`, `HCAPTCHA_SECRET`,
`SMTP_*`, `CONTACT_TO`, `CONTACT_FROM`.

`frontend/.env` (lásd `.env.example`): `VITE_API_URL`, `VITE_HCAPTCHA_SITEKEY`.

> A mellékelt hCaptcha kulcsok a hCaptcha nyilvános **teszt** kulcsai. Élesítés előtt cserélni kell a saját kulcsokra
> (hcaptcha.com), és be kell állítani az SMTP szolgáltatót, különben az űrlap éles módban nem tud üzenetet küldeni.
> A kapcsolati űrlap hCaptcha-ellenőrzését és e-mail küldését még nem teszteltük végig.

## Élesítés előtti teendők

1. Töltsd ki az Impresszum és az Adatvédelmi tájékoztató `[szögletes zárójeles]` adatait:
   `frontend/src/lib/business.ts`.
2. Állítsd be az éles Strapi kulcsokat (`APP_KEYS`, `*_SALT`, `*_SECRET`) és állítsd át a `HOST`/`PUBLIC_URL` értékeket.
3. Production adatbázis (pl. PostgreSQL) és tartós média tárolás (fájlrendszer vagy felhő provider).
4. `frontend`: `npm run build`, a `dist/` mappa kiszolgálása úgy, hogy minden útvonal az `index.html`-re essen vissza
   (SPA fallback az `/impresszum` és `/adatvedelem` oldalakhoz).
5. Cserélj hCaptcha és SMTP adatokat élesre, `CLIENT_URLS`-ben szerepeljen a végleges domain.

## Jogi oldalak

Az `/impresszum` és `/adatvedelem` oldalak nyomtathatók (Nyomtatás gomb vagy Ctrl+P): a nyomtatási nézet elrejti a
fejlécet, láblécet és a gombokat. A szövegek sablonok, élesítés előtt érdemes jogásszal ellenőriztetni.
