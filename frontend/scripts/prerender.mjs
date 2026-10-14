// Build-time prerender: writes the rendered HTML of every route into dist/ so crawlers (and users
// without JavaScript) get the full content; the browser then hydrates it.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SITE = 'https://bellawellfizio.hu';
const DIST = path.resolve('dist');
const SSR_ENTRY = path.resolve('dist-ssr', 'entry-server.js');

const ROUTES = [
  { url: '/' },
  {
    url: '/impresszum',
    title: 'Impresszum | BellaWell Kutya-fizioterápia',
    description: 'A BellaWell Kutya-fizioterápia szolgáltatójának adatai, elérhetőségei és az oldal üzemeltetésére vonatkozó információk.',
  },
  {
    url: '/adatvedelem',
    title: 'Adatvédelmi tájékoztató | BellaWell Kutya-fizioterápia',
    description: 'A BellaWell Kutya-fizioterápia weboldalának adatvédelmi tájékoztatója: milyen adatokat kezelek, milyen célból és milyen jogai vannak.',
  },
];

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function setMeta(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`Template is missing ${pattern}`);
  return html.replace(pattern, replacement);
}

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
if (!template.includes('<div id="root"></div>')) throw new Error('Root element not found in dist/index.html');

const { render } = await import(pathToFileURL(SSR_ENTRY).href);

for (const route of ROUTES) {
  let html = template.replace('<div id="root"></div>', () => `<div id="root">${render(route.url)}</div>`);

  if (route.title) {
    const title = escapeAttr(route.title);
    const description = escapeAttr(route.description);
    const canonical = `${SITE}${route.url}`;
    html = setMeta(html, /<title>[^<]*<\/title>/, () => `<title>${route.title}</title>`);
    html = setMeta(html, /(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${description}$2`);
    html = setMeta(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`);
    html = setMeta(html, /(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${description}$2`);
    html = setMeta(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`);
    html = setMeta(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`);
    // The business markup belongs to the home page only.
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/, '');
  }

  // /impresszum -> impresszum.html (nginx try_files $uri.html), so the URL needs no trailing-slash redirect.
  const target = route.url === '/' ? path.join(DIST, 'index.html') : path.join(DIST, `${route.url.slice(1)}.html`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
  console.log(`prerendered ${route.url} -> ${path.relative(process.cwd(), target)} (${(html.length / 1024).toFixed(1)} kB)`);
}
