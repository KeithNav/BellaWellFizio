// Build-time prerender: writes the rendered HTML of every route into dist/ so crawlers (and users
// without JavaScript) get the full content; the browser then hydrates it.
// CMS data (hero image, prices, gallery) is fetched from the live API here and embedded in the HTML.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SITE = 'https://bellawellfizio.hu';
const API = (process.env.VITE_API_URL || SITE).replace(/\/$/, '');
const DIST = path.resolve('dist');
const SSR_ENTRY = path.resolve('dist-ssr', 'entry-server.js');

const ROUTES = [
  { url: '/', file: 'index.html' },
  {
    url: '/impresszum',
    file: 'impresszum.html',
    title: 'Impresszum | BellaWell Kutya-fizioterápia',
    description: 'A BellaWell Kutya-fizioterápia szolgáltatójának adatai, elérhetőségei és az oldal üzemeltetésére vonatkozó információk.',
  },
  {
    url: '/adatvedelem',
    file: 'adatvedelem.html',
    title: 'Adatvédelmi tájékoztató | BellaWell Kutya-fizioterápia',
    description: 'A BellaWell Kutya-fizioterápia weboldalának adatvédelmi tájékoztatója: milyen adatokat kezelek, milyen célból és milyen jogai vannak.',
  },
  {
    // Served by nginx for every unknown URL (with a real 404 status), so it must not be indexed.
    url: '/404',
    file: '404.html',
    title: 'Az oldal nem található | BellaWell Kutya-fizioterápia',
    description: 'A keresett oldal nem található.',
    notFound: true,
  },
];

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const safeJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028|\u2029/g, '');

function setMeta(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`Template is missing ${pattern}`);
  return html.replace(pattern, replacement);
}

async function getJson(pathAndQuery) {
  const res = await fetch(`${API}${pathAndQuery}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).data;
}

const pickImage = (img) =>
  img
    ? {
        url: img.url,
        alternativeText: img.alternativeText ?? null,
        width: img.width,
        height: img.height,
        formats: img.formats
          ? Object.fromEntries(Object.entries(img.formats).map(([k, f]) => [k, { url: f.url, width: f.width, height: f.height }]))
          : null,
      }
    : null;

async function loadData() {
  const data = {};
  try {
    const [settings, services, gallery] = await Promise.all([
      getJson('/api/site-setting?populate=heroImage'),
      getJson('/api/services?sort=order:asc&pagination[pageSize]=100'),
      getJson('/api/gallery-items?populate=image&sort=order:asc&pagination[pageSize]=100'),
    ]);
    data.settings = {
      servicesNote: settings.servicesNote,
      phone: settings.phone,
      email: settings.email,
      facebookUrl: settings.facebookUrl,
      instagramUrl: settings.instagramUrl,
      heroImage: pickImage(settings.heroImage),
    };
    data.services = services.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description ?? null,
      price: s.price,
      priceSuffix: s.priceSuffix ?? null,
      isAddon: !!s.isAddon,
      order: s.order,
    }));
    data.gallery = gallery.map((g) => ({ id: g.id, title: g.title ?? null, order: g.order, image: pickImage(g.image) }));
    console.log(`prefetched CMS data from ${API}: ${data.services.length} services, ${data.gallery.length} gallery items, hero ${data.settings.heroImage ? 'yes' : 'no'}`);
  } catch (err) {
    console.warn(`WARNING: CMS data could not be prefetched from ${API} (${err.message}); the pages are prerendered without it.`);
    return {};
  }
  return data;
}

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
if (!template.includes('<div id="root"></div>')) throw new Error('Root element not found in dist/index.html');

const { render, heroPreload, faqJsonLd } = await import(pathToFileURL(SSR_ENTRY).href);
const data = await loadData();

for (const route of ROUTES) {
  let html = template.replace('<div id="root"></div>', () => `<div id="root">${render(route.url, data)}</div>`);

  if (route.title) {
    const title = escapeAttr(route.title);
    const description = escapeAttr(route.description);
    const canonical = `${SITE}${route.url}`;
    html = setMeta(html, /<title>[^<]*<\/title>/, () => `<title>${route.title}</title>`);
    html = setMeta(html, /(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${description}$2`);
    html = setMeta(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`);
    html = setMeta(html, /(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${description}$2`);
    if (route.notFound) {
      html = setMeta(html, /<meta name="robots" content="[^"]*" \/>/, () => '<meta name="robots" content="noindex, follow" />');
      html = setMeta(html, /<meta property="og:url" content="[^"]*" \/>\s*/, () => '');
      html = setMeta(html, /<link rel="canonical" href="[^"]*" \/>\s*/, () => '');
    } else {
      html = setMeta(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`);
      html = setMeta(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`);
    }
    // The business markup belongs to the home page only.
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/, '');
  }

  let head = '';
  if (route.url === '/') {
    const hero = heroPreload(data);
    if (hero) {
      head += `    <link rel="preload" as="image" href="${escapeAttr(hero.href)}" imagesrcset="${escapeAttr(hero.srcset)}" imagesizes="${escapeAttr(hero.sizes)}" fetchpriority="high" />\n`;
    }
    head += `    <script type="application/ld+json">${safeJson(faqJsonLd())}</script>\n`;
  }
  if (Object.keys(data).length > 0) {
    head += `    <script>window.__BW_DATA__=${safeJson(data)}</script>\n`;
  }
  if (head) html = html.replace('</head>', () => `${head}  </head>`);

  const target = path.join(DIST, route.file);
  fs.writeFileSync(target, html);
  console.log(`prerendered ${route.url} -> dist\\${route.file} (${(html.length / 1024).toFixed(1)} kB)`);
}
