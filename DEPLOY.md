# BellaWell – deploy az éles szerverre

Az oldal: https://bellawellfizio.hu · Szerver: `root@91.98.141.17` (Hetzner VPS, Ubuntu 24.04), SSH **kulccsal**.

## Gyors használat

```powershell
# a repo gyökeréből
powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1                  # frontend (alapértelmezett)
powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1 -Target backend  # Strapi
powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1 -Target all
powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1 -Rollback        # előző frontend verzió
powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1 -CheckOnly       # csak kapcsolat- és állapotteszt
```

A script minden futás végén ellenőrzi az oldalt (főoldal, `/impresszum`, `/adatvedelem`, `/api/services`, `sitemap.xml`,
a másik oldal, és hogy az éles JS csomag egyezik-e a helyi builddel). Hiba esetén nem nulla kilépési kóddal áll le.

## Mit csinál

**Frontend:** `npm run build` (tsc → vite → SSR → prerender), `VITE_API_URL=https://bellawellfizio.hu` mellett →
feltöltés → atomi csere a `/var/www/bellawell` mappán. Az előző verzió a `/var/www/bellawell.prev` mappában marad
(`-Rollback` ezt cseréli vissza).

**Backend (Strapi):** `strapi build` → feltöltés → az adatbázis lementése (`/opt/bellawell/backups/data-*.db`, az utolsó
10 marad) → a kód cseréje → `npm ci` csak ha a `package-lock.json` változott → `systemctl restart bellawell-strapi` →
várakozás, amíg az API válaszol. **Nem küldi fel** és nem írja felül: `.env`, `.tmp/data.db`, `public/uploads`. A tartalom
(szolgáltatások, galéria, hero kép, beállítások) az éles admin felületen szerkesztendő (`/admin`), nem a helyi adatbázisból.

## Kulcs és hozzáférés

- A privát kulcs: `~/.ssh/bellawell_deploy` (Windows: `C:\Users\<felhasználó>\.ssh\bellawell_deploy`), a publikus párja
  a szerver `/root/.ssh/authorized_keys` fájljában van (`copilot-deploy-bellawell` megjegyzéssel).
- **A privát kulcs soha nem kerülhet a repóba** (a `.gitignore` tiltja). A repo publikus is lehet.
- Másik útvonal esetén: `BELLAWELL_DEPLOY_KEY` környezeti változó.
- Kényelmi alias az `~/.ssh/config`-ban: `ssh bellawell`.
- A kulcs mentése a gépen kívül a `BellaWell-deploy-backup` mappában van (lásd az ottani `README.txt`-t).

### Új gépen
1. Másold a `bellawell_deploy` fájlt a `~/.ssh/` mappába (jogosultság: csak a saját felhasználód olvashatja).
2. `ssh -i ~/.ssh/bellawell_deploy root@91.98.141.17 hostname` – első alkalommal fogadd el a host kulcsot.
3. `powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1 -CheckOnly`

### Kulcs cseréje / új kulcs
```powershell
ssh-keygen -t ed25519 -f $HOME\.ssh\bellawell_deploy -C "bellawell-deploy" -N '""'
# a publikus kulcsot (bellawell_deploy.pub) add hozzá a szerveren a /root/.ssh/authorized_keys fájlhoz,
# majd a régi sort töröld onnan.
```

## A szerver felépítése

| Mit | Hol |
|---|---|
| Frontend (statikus) | `/var/www/bellawell` |
| Strapi | `/opt/bellawell/backend`, `bellawell` felhasználó, `127.0.0.1:1338`, `bellawell-strapi.service` |
| nginx | `/etc/nginx/sites-available/bellawellfizio` (HTTPS: certbot, automatikus megújítás) |
| Feltöltött képek | `/opt/bellawell/backend/public/uploads` (az nginx közvetlenül szolgálja ki a `/uploads/` alatt) |
| Adatbázis | `/opt/bellawell/backend/.tmp/data.db` (SQLite), mentések: `/opt/bellawell/backups` |

**Ugyanezen a szerveren fut egy másik, éles oldal is – ahhoz nem szabad nyúlni:** `eletkertjudittal.hu`
(`/var/www/eletkert`, nginx `sites-enabled/frontend` és `strapi`, a Strapi `:1337`-en a PM2 `admin` folyamat alatt),
valamint egy Minecraft szerver (`:25565`, sok RAM-ot használ). A szerveren 2 GB swap van.

## Nyitott biztonsági teendők
- A root jelszó egyszer chatben szerepelt: **cseréld le** (`passwd`).
- Ha a kulcsos belépés működik, érdemes a jelszavas SSH-t letiltani (`PasswordAuthentication no`), de csak a kulcs
  tesztelése és egy tartalék hozzáférés megléte után.
