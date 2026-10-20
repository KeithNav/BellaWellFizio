<#
.SYNOPSIS
  BellaWell deploy az eles szerverre (bellawellfizio.hu). Reszletek: DEPLOY.md

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1                 # frontend (alapertelmezett)
  powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1 -Target backend # Strapi
  powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1 -Target nginx   # nginx site (deploy\nginx-bellawellfizio.conf)
  powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1 -Target all
  powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1 -Rollback       # elozo frontend verzio
  powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1 -CheckOnly      # csak kapcsolat- es allapotteszt
#>
[CmdletBinding()]
param(
  [ValidateSet('frontend', 'backend', 'nginx', 'all')][string]$Target = 'frontend',
  [switch]$Rollback,
  [switch]$CheckOnly
)

$ErrorActionPreference = 'Stop'

$Server = 'root@91.98.141.17'
$Site = 'https://bellawellfizio.hu'
$Key = if ($env:BELLAWELL_DEPLOY_KEY) { $env:BELLAWELL_DEPLOY_KEY } else { Join-Path $HOME '.ssh\bellawell_deploy' }
$Root = Split-Path $PSScriptRoot -Parent
$SshOpts = @('-i', $Key, '-o', 'IdentitiesOnly=yes', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15')
$script:Bundle = ''

function Write-Step([string]$Text) { Write-Host "==> $Text" -ForegroundColor Cyan }

# Native programs write progress to stderr; only the exit code decides success.
# Output goes to the console (Out-Host) so it never mixes into function return values.
function Invoke-Native([string]$What, [scriptblock]$Command) {
  $previous = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    & $Command | Out-Host
    $code = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $previous
  }
  if ($code -ne 0) { throw "$What sikertelen (kilepesi kod: $code)" }
}

# Runs a bash script on the server. The trailing comment absorbs the CR PowerShell appends to piped text.
function Invoke-Remote([string]$Script) {
  $payload = ($Script -replace "`r", '').TrimEnd() + "`n# end"
  $previous = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    $payload | & ssh @SshOpts $Server 'bash -s' | Out-Host
    $code = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $previous
  }
  if ($code -ne 0) { throw "A szerveren futtatott lepes sikertelen (kilepesi kod: $code)" }
}

function Send-File([string]$Local, [string]$Remote) {
  Invoke-Native 'Feltoltes (scp)' { scp @SshOpts $Local "${Server}:$Remote" }
}

function Get-StatusCode([string]$Url) {
  (curl.exe -s -o NUL -w '%{http_code}' $Url)
}

function Get-BundleName([string]$Html) {
  $m = [regex]::Match($Html, 'assets/(index-[A-Za-z0-9_-]+\.js)')
  if ($m.Success) { $m.Groups[1].Value } else { '' }
}

function Test-Site([string]$ExpectedBundle, [bool]$CheckNginx = $false) {
  Write-Step 'Ellenorzes az eles oldalon'
  $failed = $false
  foreach ($path in '/', '/impresszum', '/adatvedelem', '/api/services', '/sitemap.xml') {
    $code = Get-StatusCode "$Site$path"
    $ok = $code -eq '200'
    if (-not $ok) { $failed = $true }
    Write-Host ('  {0,-14} {1}' -f $path, $code) -ForegroundColor $(if ($ok) { 'Green' } else { 'Red' })
  }
  if ($CheckNginx) {
    $checks = @(
      @{ Url = "$Site/nincs-ilyen-oldal"; Want = '404'; Label = 'ismeretlen URL (404)' },
      @{ Url = 'https://www.bellawellfizio.hu/'; Want = '301'; Label = 'www -> apex (301)' },
      @{ Url = "$Site/index.html"; Want = '301'; Label = '/index.html -> / (301)' }
    )
    foreach ($c in $checks) {
      $code = Get-StatusCode $c.Url
      $ok = $code -eq $c.Want
      if (-not $ok) { $failed = $true }
      Write-Host ('  {0,-26} {1}' -f $c.Label, $code) -ForegroundColor $(if ($ok) { 'Green' } else { 'Red' })
    }
  }
  $other = Get-StatusCode 'https://eletkertjudittal.hu/'
  Write-Host ('  eletkertjudittal.hu (masik oldal) {0}' -f $other) -ForegroundColor $(if ($other -eq '200') { 'Green' } else { 'Red' })
  if ($other -ne '200') { $failed = $true }
  if ($ExpectedBundle) {
    $live = Get-BundleName ((curl.exe -s "$Site/") -join "`n")
    $same = $live -eq $ExpectedBundle
    Write-Host ('  JS csomag: elo={0} helyi={1}' -f $live, $ExpectedBundle) -ForegroundColor $(if ($same) { 'Green' } else { 'Red' })
    if (-not $same) { $failed = $true }
  }
  if ($failed) { throw 'Az ellenorzes hibat talalt, nezd meg a fenti sorokat.' }
  Write-Host 'Minden rendben.' -ForegroundColor Green
}

function Deploy-Frontend {
  $dir = Join-Path $Root 'frontend'
  Write-Step 'Frontend build (tsc + vite + prerender)'
  Push-Location $dir
  try {
    Get-ChildItem Env:VITE_* -ErrorAction SilentlyContinue | Remove-Item
    $env:VITE_API_URL = $Site
    Invoke-Native 'npm run build' { npm run build }
  } finally {
    Remove-Item Env:VITE_API_URL -ErrorAction SilentlyContinue
    Pop-Location
  }

  $dist = Join-Path $dir 'dist'
  $index = Join-Path $dist 'index.html'
  if (-not (Test-Path $index)) { throw 'Nincs dist\index.html, a build nem keszult el.' }
  $html = Get-Content $index -Raw -Encoding UTF8
  if ($html -notmatch '<h1') { throw 'A dist\index.html nem tartalmaz prerenderelt tartalmat.' }
  $script:Bundle = Get-BundleName $html

  Write-Step 'Feltoltes'
  $archive = Join-Path $env:TEMP 'bellawell-frontend.tgz'
  Invoke-Native 'tar' { tar -czf $archive -C $dist . }
  try { Send-File $archive '/tmp/bellawell-frontend.tgz' } finally { Remove-Item $archive -ErrorAction SilentlyContinue }

  Write-Step 'Atomi csere a szerveren (az elozo verzio: /var/www/bellawell.prev)'
  Invoke-Remote @'
set -euo pipefail
NEW=/var/www/bellawell.new
rm -rf "$NEW"; mkdir -p "$NEW"
tar -xzf /tmp/bellawell-frontend.tgz -C "$NEW"
rm -f /tmp/bellawell-frontend.tgz
test -f "$NEW/index.html"
chown -R root:root "$NEW"
find "$NEW" -type d -exec chmod 755 {} +
find "$NEW" -type f -exec chmod 644 {} +
rm -rf /var/www/bellawell.prev
mv /var/www/bellawell /var/www/bellawell.prev
mv "$NEW" /var/www/bellawell
nginx -t
echo "frontend telepitve"
'@
}

function Deploy-Nginx {
  $conf = Join-Path $Root 'deploy\nginx-bellawellfizio.conf'
  if (-not (Test-Path $conf)) { throw "Nincs $conf" }
  Write-Step 'nginx beallitas feltoltese'
  Send-File $conf '/tmp/bellawell-nginx.conf'
  Write-Step 'nginx frissitese (mentes, nginx -t, reload; hiba eseten visszaallitas)'
  Invoke-Remote @'
set -uo pipefail
CONF=/etc/nginx/sites-available/bellawellfizio
mkdir -p /opt/bellawell/backups
BAK="/opt/bellawell/backups/nginx-bellawellfizio-$(date +%Y%m%d-%H%M%S).conf"
cp "$CONF" "$BAK"
ls -1t /opt/bellawell/backups/nginx-bellawellfizio-*.conf | tail -n +11 | xargs -r rm -f
cp /tmp/bellawell-nginx.conf "$CONF"
rm -f /tmp/bellawell-nginx.conf
if nginx -t; then
  systemctl reload nginx
  echo "nginx frissitve (mentes: $BAK)"
else
  cp "$BAK" "$CONF"
  nginx -t
  echo "HIBA: az uj nginx beallitas hibas, a regi vissza lett allitva ($BAK)"
  exit 1
fi
'@
}

function Deploy-Backend {
  $dir = Join-Path $Root 'backend'
  Write-Step 'Strapi build'
  $archive = Join-Path $env:TEMP 'bellawell-backend.tgz'
  Push-Location $dir
  try {
    $env:NODE_ENV = 'production'
    Invoke-Native 'strapi build' { npm run build }

    $items = 'dist', 'config', 'database', 'public', 'src', 'scripts', 'package.json', 'package-lock.json', 'tsconfig.json', 'favicon.png' |
      Where-Object { Test-Path $_ }
    # Never ship uploads, the database or .env: content lives on the server.
    Invoke-Native 'tar' { tar --exclude=public/uploads -czf $archive @items }
  } finally {
    Remove-Item Env:NODE_ENV -ErrorAction SilentlyContinue
    Pop-Location
  }

  Write-Step 'Feltoltes'
  try { Send-File $archive '/tmp/bellawell-backend.tgz' } finally { Remove-Item $archive -ErrorAction SilentlyContinue }

  Write-Step 'Strapi frissitese (adatbazis-mentes + ujrainditas)'
  Invoke-Remote @'
set -euo pipefail
APP=/opt/bellawell/backend
NEW=/tmp/bellawell-backend-new
rm -rf "$NEW"; mkdir -p "$NEW"
tar -xzf /tmp/bellawell-backend.tgz -C "$NEW"
rm -f /tmp/bellawell-backend.tgz
test -d "$NEW/dist"
mkdir -p /opt/bellawell/backups
cp "$APP/.tmp/data.db" "/opt/bellawell/backups/data-$(date +%Y%m%d-%H%M%S).db"
ls -1t /opt/bellawell/backups/data-*.db | tail -n +11 | xargs -r rm -f
cd "$APP"
OLDLOCK=$(md5sum package-lock.json | cut -d' ' -f1)
for d in dist config database src scripts; do
  if [ -d "$NEW/$d" ]; then rm -rf "$d"; mv "$NEW/$d" "$d"; fi
done
mkdir -p public
cp -a "$NEW/public/." public/
for f in package.json package-lock.json tsconfig.json favicon.png; do
  if [ -f "$NEW/$f" ]; then cp -a "$NEW/$f" "$f"; fi
done
rm -rf "$NEW"
NEWLOCK=$(md5sum package-lock.json | cut -d' ' -f1)
chown -R bellawell:bellawell "$APP"
if [ "$OLDLOCK" != "$NEWLOCK" ] || [ ! -d node_modules ]; then
  sudo -u bellawell -H env NODE_ENV=production npm ci --omit=dev --no-audit --no-fund
fi
systemctl restart bellawell-strapi
code=000
for i in $(seq 1 40); do
  code=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:1338/api/services || true)
  if [ "$code" = "200" ]; then break; fi
  sleep 2
done
if [ "$code" != "200" ]; then
  journalctl -u bellawell-strapi -n 40 --no-pager
  echo "A Strapi nem indult el (HTTP $code). Az adatbazis-mentes: /opt/bellawell/backups"
  exit 1
fi
echo "strapi fut"
'@
}

if (-not (Test-Path $Key)) {
  throw "Nem talalom a deploy kulcsot: $Key`nMasold oda a bellawell_deploy fajlt (lasd DEPLOY.md), vagy allitsd be a BELLAWELL_DEPLOY_KEY kornyezeti valtozot."
}

Write-Step 'Kapcsolat a szerverrel'
Invoke-Remote 'echo "kapcsolat ok: $(hostname)"; systemctl is-active nginx bellawell-strapi'

if ($CheckOnly) {
  Test-Site ''
  return
}

if ($Rollback) {
  Write-Step 'Frontend visszaallitasa az elozo verziora'
  Invoke-Remote @'
set -euo pipefail
test -d /var/www/bellawell.prev
mv /var/www/bellawell /var/www/bellawell.swap
mv /var/www/bellawell.prev /var/www/bellawell
mv /var/www/bellawell.swap /var/www/bellawell.prev
echo "visszaallitva"
'@
  Test-Site ''
  return
}

if ($Target -in 'backend', 'all') { Deploy-Backend }
if ($Target -in 'frontend', 'all') { Deploy-Frontend }
if ($Target -in 'nginx', 'all') { Deploy-Nginx }
Test-Site $script:Bundle ($Target -in 'nginx', 'all')
