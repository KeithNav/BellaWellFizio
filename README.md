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

## Galéria (bento rács + PhotoSwipe)

A galéria képei a **Galéria elem** tartalomtípusból jönnek, a megjelenítési sorrendet az `order` mező adja. A kép
automatikusan több méretben készül el (500/800/1280/1920 px): a rács a kisebbeket, a PhotoSwipe nagyítás az 1920 px-es
változatot tölti be. A bento elrendezés hat darabos blokkokban ismétlődik (nagy – magas – magas / széles – kicsi –
kicsi), így a sorrend módosításával lehet az elrendezést alakítani; az utolsó blokk hiányzó helyeit a rács kitölti.

Képek tömeges feltöltése egy mappából (a Strapi közben **ne** fusson):

```powershell
cd backend
npm run import:gallery -- public/uploads/pictures
```

A script csak üres galériánál fut le (`--force` kapcsolóval újra), a képeket a Media Library-be tölti, és a hero képet
is beállítja. A kiinduló mappa eredeti, nagy fájljait az import után érdemes törölni, mert a `public/uploads` alatt
a Strapi publikusan kiszolgálja őket.

## Környezeti változók

`backend/.env` (lásd `.env.example`): Strapi kulcsok, `CLIENT_URLS` (CORS), `HCAPTCHA_SITEKEY`, `HCAPTCHA_SECRET`,
`SMTP_*`, `CONTACT_TO`, `CONTACT_FROM`.

`frontend/.env` (lásd `.env.example`): `VITE_API_URL`, `VITE_WEB3FORMS_KEY`, `VITE_HCAPTCHA_SITEKEY`.

> A kapcsolati űrlap a **Web3Forms**-on keresztül működik (böngészőből közvetlenül küld, a Strapi `/api/contact`
> végpontját már nem használja). A Web3Forms access key publikus; a Web3Forms dashboardon érdemes a domain szerinti
> korlátozást bekapcsolni, és az űrlapnál az hCaptcha-t engedélyezni. Az ingyenes csomagban a Web3Forms saját hCaptcha
> sitekey-ét kell használni (`50b2fe65-b00b-4b9e-ad62-3ba471098be2`, ez az alapérték), saját hCaptcha kulcs csak fizetős
> csomaggal használható. Az SMTP és a `HCAPTCHA_*` backend változók így nem szükségesek.

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
